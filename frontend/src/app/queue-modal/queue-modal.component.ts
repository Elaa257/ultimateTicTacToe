import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { WebSocketService } from './web-socket.service';
import { MatButton } from '@angular/material/button';

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
export class QueueModalComponent {
  canStartGame = false; // Initially false
  timeInQueue: number = 0;
  timer:any;

  constructor(
    public dialogRef: MatDialogRef<QueueModalComponent>,
    private webSocketService: WebSocketService
  ) {
    // Listen for the "player-joined" event
    console.log('QueueModalComponent initialized');

    this.webSocketService.emit('join-queue');


    this.webSocketService.listen('player-joined').subscribe(() => {
      console.log('Received player-joined event');
      this.canStartGame = true; // Enable the start game button
    });
  }

  startGame(): void {
    console.log('Start Game button clicked');
    this.stopTimer()
    this.webSocketService.emit('start-game');
    this.dialogRef.close();

  }
  ngOnInit(){
    this.startTimer()
  }
  ngOnDestroy(){
    this.stopTimer();
  }
  startTimer(){
    this.timer = setInterval(()=>{
      this.timeInQueue++
    },1000)
  }
  stopTimer(){
    if(this.timer){
      clearInterval(this.timer);
    }
  }
  formatTime(sec:number){
    const minutes = Math.floor((sec/60));
    const seconds = sec%60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`
  }

  pad(value:number){
    return value <10 ? `0${value}` : `${value}`;
  }
}
