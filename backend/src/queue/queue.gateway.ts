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

interface QueueUser {
  clientId: string;
  username: string;
  elo: number;
}

@Injectable()
@WebSocketGateway({ cors: true })
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private queue: QueueUser[] = [];

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>
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
      if (this.queue.find(queueUser => queueUser.clientId === client.id)) {
        console.log(`User ${user.nickname} is already in the queue.`);
        return;
      }

      // Try to match the user
      const match = this.queue.find(
        (queueUser) => Math.abs(queueUser.elo - user.elo) <= 99 && queueUser.clientId !== client.id
      );

      if (match) {
        // Found a match
        console.log(`Matched ${user.nickname} (Elo: ${user.elo}) with ${match.username} (Elo: ${match.elo})`);

        // Remove matched users from the queue
        this.queue = this.queue.filter(
          (item) => item.clientId !== client.id && item.clientId !== match.clientId
        );

        // Notify both players that a match has been found (player-joined)
        this.server.to(client.id).emit('player-joined', { opponent: match.username });
        this.server.to(match.clientId).emit('player-joined', { opponent: user.nickname });
      } else {
        // No match found, add user to the queue
        this.queue.push({
          clientId: client.id,
          username: user.nickname,
          elo: user.elo,
        });
        console.log(`Current queue: ${this.queue.map((item) => item.username).join(', ')}`);
      }

      this.broadcastQueueToAdmins();
    } catch (err) {
      console.log('Error during join-queue:', err.message);
      client.disconnect();

    }
  }

  @SubscribeMessage('leave-queue')
  async handleLeaveQueue(client: Socket): Promise<void> {
    try {
      const token = this.extractJwtFromSocket(client);
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
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




  //Get Queue Information's for the Admins
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

