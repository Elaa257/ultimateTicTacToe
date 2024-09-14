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

@WebSocketGateway({ cors: true })
export class GameGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GameService) {}

  handleConnection(socket: Socket) {
    console.log('New client connected:', socket.id);
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
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket}`);
  }
}
