import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';
import { JwtService } from '@nestjs/jwt';
import { Game } from './game.entity';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: true })
export class GameGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeGames: Game[] = []; // Declare activeGames array

  constructor(
    private gameService: GameService,
    private jwtService: JwtService
  ) {}

  handleConnection(socket: Socket) {
    console.log('New Admin client connected:', socket.id);

    const token = this.extractJwtFromSocket(socket);
    if (!token) {
      console.error('No token found for socket:', socket.id);
      return;
    }

    try {
      const payload = this.jwtService.verify(token);
      if (payload.role === 'admin') {
        // Send current active games to the admin
        socket.emit('active-games', this.getActiveGamesData());
      }
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  @SubscribeMessage('make-move')
  async handlePlayerMove(
    @MessageBody() data: { gameId: number; index: number }
  ) {
    console.log('Received make-move event with data:', data);
    const { gameId, index } = data;
    const response = await this.gameService.makeMove(gameId, index);
    if (response.message === 'Successfully made move') {
      this.server.emit('player-move', {
        board: response.board,
        turnId: response.turn.id,
        gameEnd: response.finished,
      });

      // If the game has ended, handle game end
      if (response.finished) {
        await this.gameService.deleteGame(gameId);
      }
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  @OnEvent('game.started')
  handleGameStartedEvent(game: Game) {
    console.log('game started event emitted');
    this.activeGames.push(game);
    this.broadcastActiveGamesToAdmins();
  }

  @OnEvent('game.ended')
  handleGameEndedEvent(game: Game) {
    // Remove the game from the active games list
    this.activeGames = this.activeGames.filter((g) => g.id !== game.id);
    this.broadcastActiveGamesToAdmins();
  }

  @SubscribeMessage('get-games')
  handleGetGames(client: Socket) {
    console.log('Received get-games event from:', client.id);

    const token = this.extractJwtFromSocket(client);
    if (!token) {
      console.error('No token found for socket:', client.id);
      client.emit('unauthorized');
      return;
    }

    try {
      const payload = this.jwtService.verify(token);
      if (payload.role === 'admin') {
        // Send current active games to the admin
        client.emit('active-games', this.getActiveGamesData());
      } else {
        client.emit('unauthorized');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      client.emit('unauthorized');
    }
  }

  // Function to broadcast active games to admins
  private broadcastActiveGamesToAdmins(): void {
    console.log('Broadcasting active games to admins:', this.activeGames);
    const sockets = this.server.sockets.sockets;

    const activeGamesData = this.getActiveGamesData();

    for (const [id, client] of sockets) {
      const token = this.extractJwtFromSocket(client);
      if (!token) {
        continue; // Skip if no token
      }
      try {
        const payload = this.jwtService.verify(token);
        if (payload.role === 'admin') {
          client.emit('active-games', activeGamesData);
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }

  private getActiveGamesData(): any[] {
    return this.activeGames.map((game) => ({
      id: game.id,
      player1: { id: game.player1.id, nickname: game.player1.nickname },
      player2: { id: game.player2.id, nickname: game.player2.nickname },
      // Include other necessary properties
    }));
  }

  private extractJwtFromSocket(client: Socket): string | null {
    const cookie = client.handshake.headers.cookie;
    const token = cookie
      ?.split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

    if (!token) {
      console.error('No access token found');
      return null;
    }

    return token;
  }
}
