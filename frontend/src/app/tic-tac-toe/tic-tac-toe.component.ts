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

    constructor(protected ticTacToeService: TicTacToeService) {}

    // Die Methode wird aufgerufen, sobald die Komponente initialisiert ist
    ngOnInit() {
      this.createGame();  // Erstelle das Spiel, wenn die Komponente geladen wird
    }

    // Methode zum Erstellen eines neuen Spiels
    createGame(): void {
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
