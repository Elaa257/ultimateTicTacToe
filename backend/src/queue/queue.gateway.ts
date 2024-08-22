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
        where: { id: payload.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      console.log(
        `Client connected: ${client.id}, User: ${user.nickname}, Elo: ${user.elo}`
      );
    } catch (err) {
      console.log('Invalid token:', err.message);
      client.disconnect(); // Wenn das Token ungültig ist, Verbindung trennen
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.queue = this.queue.filter((item) => item.clientId !== client.id);
  }

  @SubscribeMessage('join-queue')
  async handleJoinQueue(client: Socket): Promise<void> {
    try {
      const token = this.extractJwtFromSocket(client);
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      console.log(`User ${user.nickname} joined queue with Elo ${user.elo}`);

      // Prüfe, ob es einen passenden Gegner in der Queue gibt
      const match = this.queue.find(
        (queueUser) => Math.abs(queueUser.elo - user.elo) <= 99
      );

      if (match) {
        // Gegner gefunden, matchen und Spiel starten
        console.log(
          `Matched ${user.nickname} (Elo: ${user.elo}) with ${match.username} (Elo: ${match.elo})`
        );

        // Entferne die gematchten Benutzer aus der Queue
        this.queue = this.queue.filter(
          (item) =>
            item.clientId !== client.id && item.clientId !== match.clientId
        );

        // Spiel starten
        this.server
          .to(client.id)
          .emit('player-joined', { opponent: match.username });
        this.server
          .to(match.clientId)
          .emit('player-joined', { opponent: user.nickname });

        this.server.emit('game-started');
      } else {
        // Kein passender Gegner, Benutzer zur Queue hinzufügen
        this.queue.push({
          clientId: client.id,
          username: user.nickname,
          elo: user.elo,
        });
        console.log(
          `Current queue: ${this.queue.map((item) => item.username).join(', ')}`
        );
      }
    } catch (err) {
      console.log('Error during join-queue:', err.message);
      client.disconnect(); // Verbindung trennen bei Fehler
    }
  }

  @SubscribeMessage('start-game')
  handleStartGame(): void {
    console.log('Game started');
    this.server.emit('game-started');
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
}