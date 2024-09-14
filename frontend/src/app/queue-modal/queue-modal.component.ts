import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { WebSocketService } from './web-socket.service';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';  // Import the Router
import { Subscription } from 'rxjs';  // Import Subscription
import { TicTacToeService } from '../tic-tac-toe/tic-tac-toe.service';

@Component({
  selector: 'app-queue-modal',
  templateUrl: './queue-modal.component.html',
  standalone: true,
  styleUrls: ['./queue-modal.component.css'],
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
})
export class QueueModalComponent implements OnInit, OnDestroy {
  canStartGame = false;
  timeInQueue: number = 0;
  countdown: number = 10;
  timer: any;
  countdownTimer: any;

  // Add subscriptions for the WebSocket events
  private playerJoinedSubscription!: Subscription;
  protected urlParam!: string;
  constructor(
    public dialogRef: MatDialogRef<QueueModalComponent>,
    private webSocketService: WebSocketService,
    private router: Router,
    private tictactoeService: TicTacToeService,
  ) {
    // Join the queue when the component is initialized
    this.webSocketService.emit('join-queue');
  }

  ngOnInit() {
    this.startTimer(); // Start the timer when the component is initialized

    // Subscribe to the "player-joined" event
    this.playerJoinedSubscription = this.webSocketService.listen<{opponent: string, param: string, gameId: number}>('player-joined').subscribe((data) => {
      console.log('Received player-joined event');
      console.log(data);
      this.canStartGame = true;
      this.tictactoeService.gameId = data.gameId;
      this.urlParam = data.param;
      this.stopTimer(); // Stop the queue timer
      this.startCountdown(); // Start the 10-second countdown
    });
  }

  ngOnDestroy() {
    this.stopTimer();
    this.leaveQueue(); // Emit leave-queue on component destroy
    this.stopCountdown();
    this.unsubscribeEvents(); // Unsubscribe from WebSocket events
  }

  // Unsubscribe from all event listeners
  unsubscribeEvents() {
    if (this.playerJoinedSubscription) {
      this.playerJoinedSubscription.unsubscribe();
    }
  }

    startTimer() {
    this.timer = setInterval(() => {
      this.timeInQueue++;
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // Start the 10-second countdown before the game starts
  startCountdown() {
    this.countdownTimer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.stopCountdown();
        this.emitStartGame();
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  // Emit the start-game event after the countdown finishes
  emitStartGame(): void {
    console.log('Emitting start-game event after countdown');
    this.dialogRef.close();
    this.leaveQueue();
    this.redirectToGame();
  }

  // Redirect to the '/game' route when the server emits the game-started event
  redirectToGame(): void {
    console.log('Redirecting to /game');
    this.router.navigate(['/game/'+ this.urlParam]);
  }

  formatTime(sec: number) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number) {
    return value < 10 ? `0${value}` : `${value}`;
  }

  // Leave the queue when the game starts or is cancelled
  leaveQueue(): void {
    console.log('Leaving the queue');
    this.webSocketService.emit('leave-queue');
  }
}
