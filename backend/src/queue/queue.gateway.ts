import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from 'src/game/game.service';

interface QueueUser {
  clientId: string;
  userId: number;
  username: string;
  elo: number;
  socket: Socket;
}

@Injectable()
@WebSocketGateway({ cors: true })
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private queue: QueueUser[] = [];
  private matchingInProgress = false;

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private gameService: GameService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractJwtFromSocket(client);
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      console.log(
        `Client connected: ${client.id}, User: ${user.nickname}, Elo: ${user.elo}`
      );
    } catch (err) {
      console.log('Invalid token:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.queue = this.queue.filter((item) => item.clientId !== client.id);
    this.broadcastQueueToAdmins();
  }

  @SubscribeMessage('join-queue')
  async handleJoinQueue(client: Socket): Promise<void> {
    try {
      const token = this.extractJwtFromSocket(client);
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      console.log(`User ${user.nickname} joined queue with Elo ${user.elo}`);

      // Prevent duplicate queue entries
      if (this.queue.find((queueUser) => queueUser.clientId === client.id)) {
        console.log(`User ${user.nickname} is already in the queue.`);
        return;
      }

      // Add user to the queue
      this.queue.push({
        clientId: client.id,
        userId: user.id,
        username: user.nickname,
        elo: user.elo,
        socket: client,
      });

      // Try to match users
      await this.attemptMatch();
    } catch (err) {
      console.log('Error during join-queue:', err.message);
      client.disconnect();
    }
  }

  private async attemptMatch() {
    if (this.matchingInProgress) {
      return;
    }

    this.matchingInProgress = true;

    try {
      while (this.queue.length >= 2) {
        const player1 = this.queue.shift()!;

        const matchIndex = this.queue.findIndex(
          (queueUser) =>
            Math.abs(queueUser.elo - player1.elo) <= 99 &&
            queueUser.clientId !== player1.clientId
        );

        if (matchIndex !== -1) {
          const player2 = this.queue.splice(matchIndex, 1)[0];

          // Create a unique room ID
          const roomId = uuidv4();

          // Add both clients to the room
          player1.socket.join(roomId);
          player2.socket.join(roomId);

          // Create the game
          const newGame = await this.gameService.create(
            player1.userId,
            player2.userId
          );
          if (!newGame) {
            throw new Error('Could not create game');
          }
          console.log(`Game created with ID ${newGame.id}`);

          // Emit 'player-joined' event to the room
          this.server.to(roomId).emit('player-joined', {
            opponents: [player1.username, player2.username],
            param: roomId,
            gameId: newGame.id,
          });
        } else {
          // No suitable match found for player1, put them back in the queue
          this.queue.unshift(player1);
          break;
        }
      }
    } catch (err) {
      console.log('Error during attemptMatch:', err.message);
    } finally {
      this.matchingInProgress = false;
    }
  }

  @SubscribeMessage('leave-queue')
  async handleLeaveQueue(client: Socket): Promise<void> {
    try {
      const token = this.extractJwtFromSocket(client);
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      console.log(`User ${user.nickname} is leaving the queue`);

      // Remove the user from the queue
      this.queue = this.queue.filter((item) => item.clientId !== client.id);

      // Notify admins about the updated queue
      this.broadcastQueueToAdmins();

      // Optionally, confirm to the client that they've left the queue
      client.emit('left-queue', { message: 'You have left the queue.' });
    } catch (err) {
      console.log('Error during leave-queue:', err.message);
      client.disconnect();
    }
  }

  // Get Queue Information's for the Admins
  @SubscribeMessage('get-queue')
  async handleGetQueue(client: Socket): Promise<void> {
    const token = this.extractJwtFromSocket(client);
    const payload = this.jwtService.verify(token);

    if (payload.role === 'admin') {
      client.emit('queue-data', this.queue);
    } else {
      client.emit('unauthorized');
    }
  }

  private extractJwtFromSocket(client: Socket): string {
    const cookie = client.handshake.headers.cookie;
    const token = cookie
      ?.split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

    if (!token) {
      throw new Error('No access token found');
    }

    return token;
  }

  private broadcastQueueToAdmins(): void {
    console.log('Broadcasting updated queue to admins:', this.queue);
    const adminClients = this.server.sockets.sockets;

    adminClients.forEach((client) => {
      const token = this.extractJwtFromSocket(client);
      const payload = this.jwtService.verify(token);

      if (payload.role === 'admin') {
        client.emit('queue-data', this.queue);
      }
    });
  }
}
