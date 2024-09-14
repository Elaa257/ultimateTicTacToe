import { Component, OnInit } from '@angular/core';
import { TicTacToeService } from './tic-tac-toe.service';
import { WebSocketService } from '../queue-modal/web-socket.service';
import { AuthService } from '../auth/auth.service';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { UserService } from '../profile/user.service';
import { UserDTO } from '../profile/DTOs/userDTO';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  templateUrl: './tic-tac-toe.component.html',
  imports: [
    MatButton,
    MatCard,
    NgClass,
  ],
  styleUrls: ['./tic-tac-toe.component.css'],
})
export class TicTacToeComponent implements OnInit {
  protected cells: number[] = Array(9).fill(null);
  protected currentUserId!: number;
  protected currentPlayerId!: number;
  protected gameId!: number;
  private gameEnd: boolean = false;

  player1Image: string | null ='';
  player2Image: string | null ='';

  player1: UserDTO | undefined;
  player2: UserDTO | undefined;

  constructor(
    private ticTacToeService: TicTacToeService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      console.log('User:', user.user?.id);
      console.log('User:', user.user?.id);

      if (user.user?.id !== null && user.user?.id !== undefined) {
        this.currentUserId = Number(user.user?.id);
      } else {
        console.error('User ID is null or undefined');
      }

      this.ticTacToeService.getGame().subscribe((gameData) => {
        this.cells = gameData.board.map(Number);

        this.gameId = gameData.id;
        this.currentPlayerId = Number(gameData.turn.id);
        this.player1 = gameData.player1;
        this.player2 = gameData.player2;



      });

      this.player1Image = this.player1?.profilePicture
        ? 'data:image/jpeg;base64' + this.player1.profilePicture
        : '/profile-picture.jpg';

      this.player2Image = this.player2?.profilePicture
        ? 'data:image/jpeg;base64' + this.player2.profilePicture
        : '/profile-picture.jpg';
    });

    this.webSocketService.listen<{ board: number[], turnId: number, gameEnd: boolean}>('player-move')
      .subscribe((game) => {
        console.log('Received player-move event', game);
        this.currentPlayerId = Number(game.turnId);
        this.cells = game.board.map(cell => Number(cell));
        this.gameEnd = game.gameEnd;
        console.log('Game end:', this.gameEnd);
      });
  }

  get isMyTurn(): boolean {
    return this.currentPlayerId === this.currentUserId;
  }

  makeMove(index: number) {

    if (this.gameEnd) {
      console.log("Game is already over");
      return;
    }
    if (this.cells[index] !== -1) {
      console.log("Cell is already occupied");
      return;
    }

    if (!this.isMyTurn) {
      console.log("It's not your turn");
      return;
    }
    console.log("Player " + this.currentPlayerId + " is playing");
    // Sende den Zug an den Server
    this.webSocketService.emit('make-move', {
      gameId: this.gameId,
      index: index,
    });
  }

  getCellSymbol(cellValue: number): string {
    console.log('Cell value:', cellValue);
    if (cellValue === -1) {
      return '';
    } else if (cellValue === 0) {
      return 'X';
    } else if (cellValue === 1) {
      return 'O';
    }
    return '';
  }
}
