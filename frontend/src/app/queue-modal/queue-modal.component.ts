import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogClose,
  MatDialogRef, MatDialogTitle,
} from '@angular/material/dialog';
import { WebSocketService } from './web-socket.service';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicTacToeService } from '../tic-tac-toe/tic-tac-toe.service';
import { GameOverDialogData } from './gameOverDialogData';

@Component({
  selector: 'app-queue-modal',
  templateUrl: './queue-modal.component.html',
  standalone: true,
  styleUrls: ['./queue-modal.component.css'],
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
  ],
})
export class QueueModalComponent implements OnInit, OnDestroy {
  canStartGame = false;
  timeInQueue: number = 0;
  countdown: number = 10;
  timer: any;
  countdownTimer: any;
  gameModal: boolean = false;

  private playerJoinedSubscription!: Subscription;
  protected urlParam!: string;

  constructor(
    public dialogRef: MatDialogRef<QueueModalComponent>,
    private webSocketService: WebSocketService,
    private router: Router,
    private tictactoeService: TicTacToeService,
    @Inject(MAT_DIALOG_DATA) public data: GameOverDialogData
  ) {
    if (data) {
      console.log('Data passed to the dialog:', data);
      this.gameModal = true;
    } else {
      this.webSocketService.emit('join-queue');
    }
  }

  ngOnInit() {
    this.startTimer();

    this.playerJoinedSubscription = this.webSocketService
      .listen<{ opponent: string; param: string; gameId: number }>('player-joined')
      .subscribe((data) => {
        console.log('Received player-joined event');
        this.canStartGame = true;
        this.tictactoeService.gameId = data.gameId;
        this.urlParam = data.param;
        this.stopTimer();
        this.startCountdown();
      });
  }

  ngOnDestroy() {
    this.stopTimer();
    this.stopCountdown();
    this.unsubscribeEvents();
  }

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

  emitStartGame(): void {
    console.log('Emitting start-game event after countdown');
    this.dialogRef.close();
    this.leaveQueue();
    this.redirectToGame();
  }

  redirectToGame(): void {
    console.log('Redirecting to /game');
    this.router.navigate(['/game/' + this.urlParam]);
  }

  formatTime(sec: number): string {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  leaveQueue(): void {
    console.log('Leaving the queue');
    this.webSocketService.emit('leave-queue');
  }

  returnHome(): void {
    console.log('Return Home clicked');
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(() => {
      console.log('Dialog closed, navigating to home');
      this.router.navigate(['/home']);
    });
  }
}
