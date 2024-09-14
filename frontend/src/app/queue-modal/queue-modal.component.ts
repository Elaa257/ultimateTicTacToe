import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { WebSocketService } from './web-socket.service';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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

  private playerJoinedSubscription!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<QueueModalComponent>,
    private webSocketService: WebSocketService,
    private router: Router
  ) {

    this.webSocketService.emit('join-queue');
  }

  ngOnInit() {
    this.startTimer();

    this.playerJoinedSubscription = this.webSocketService.listen('player-joined').subscribe(() => {
      console.log('Received player-joined event');
      this.canStartGame = true;
      this.stopTimer();
      this.startCountdown();
    });
  }

  ngOnDestroy() {
    this.stopTimer();
    this.leaveQueue();
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
    this.router.navigate(['/game']);
  }

  formatTime(sec: number) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number) {
    return value < 10 ? `0${value}` : `${value}`;
  }

  leaveQueue(): void {
    console.log('Leaving the queue');
    this.webSocketService.emit('leave-queue');
  }
}
