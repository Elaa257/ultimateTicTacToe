  import { Component, OnInit } from '@angular/core';
  import { TicTacToeService } from './tic-tac-toe.service';
  import { UserDTO } from '../profile/DTOs/userDTO';
  import { CreateTicTacToeRequestDto } from './DTOs/CreateTicTacToeRequestDto';
  import { ResponseDTO } from './DTOs/ResponseDTO';


  @Component({
    selector: 'app-tic-tac-toe',
    standalone: true,
    templateUrl: './tic-tac-toe.component.html',
    styleUrls: ['./tic-tac-toe.component.css']
  })
  export class TicTacToeComponent implements OnInit {
    cells: string[] = Array(9).fill(null);  // Das Tic-Tac-Toe Spielfeld
    currentPlayer: string = 'X';  // Der erste Spieler, der am Zug ist
    gameId: number = 1;  // Die Spiel-ID, die vom Backend nach der Erstellung des Spiels zurückkommt

    // Erstelle Spielerobjekte (vorher definieren)
    player1: UserDTO = { id: 1, email: 'player1@example.com', nickname: 'Player1', role: 'player', elo: 1500 };
    player2: UserDTO = { id: 2, email: 'player2@example.com', nickname: 'Player2', role: 'player', elo: 1600 };

    constructor(protected ticTacToeService: TicTacToeService) {}

    // Die Methode wird aufgerufen, sobald die Komponente initialisiert ist
    ngOnInit() {
      this.createGame();  // Erstelle das Spiel, wenn die Komponente geladen wird
      console.log(this.ticTacToeService.getGames(this.gameId));
    }

    // Methode zum Erstellen eines neuen Spiels
    createGame(): void {
      const newGame: CreateTicTacToeRequestDto = {
        player1: this.player1,
        player2: this.player2,
        player1EloBefore: this.player1.elo,
        player2EloBefore: this.player2.elo,
        board:  this.cells.map(cell => Number(cell)), // Das aktuelle Spielfeld (leer)
        turn: this.player1  // Spieler 1 beginnt
      };

      const test = this.ticTacToeService.createGame(newGame).subscribe((response: ResponseDTO) => {
        if (response.ok) {
          console.log('Spiel erfolgreich erstellt:', response);
          this.gameId = response.gameId ?? 0;  // Speichere die Spiel-ID, um weitere Aktionen darauf auszuführen
        } else {
          console.error('Fehler beim Erstellen des Spiels:', response.message);
        }
      });
    }

    // Methode, um einen Zug zu machen
    makeMove(index: number) {
      if (!this.cells[index]) {
        this.cells[index] = this.currentPlayer;

        // Wechsle den Spieler
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      }
    }
  }
