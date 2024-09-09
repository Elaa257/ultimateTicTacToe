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
import { Router } from '@angular/router';

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
  timeInQueue: number = 0;
  timer:any;

  constructor(
    public dialogRef: MatDialogRef<QueueModalComponent>,
    private webSocketService: WebSocketService,
    private router: Router
  ) {
    // Listen for the "player-joined" event
    console.log('QueueModalComponent initialized');

    this.webSocketService.emit('join-queue');


    this.webSocketService.listen<{ param: string, opponent: string }>('player-joined').subscribe((data) => {
      console.log('Received player-joined event', data);

      this.startTimer();
      this.dialogRef.close();
      this.router.navigate(['/game', data.param]);   
      this.webSocketService.connect(data.param);
    });
  }

  ngOnInit(){
    this.startTimer()
  }
  ngOnDestroy(){
    this.stopTimer();
    this.leaveQueue();
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

  leaveQueue(): void {
    console.log('Emitting leave-queue event');
    this.webSocketService.emit('leave-queue');
  }
}
