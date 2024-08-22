import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WebSocketService } from './web-socket.service';

@Component({
  selector: 'app-queue-modal',
  templateUrl: './queue-modal.component.html',
  standalone: true,
  styleUrls: ['./queue-modal.component.css'],
})
export class QueueModalComponent {
  canStartGame = false; // Initially false

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
    this.webSocketService.emit('start-game');
    this.dialogRef.close();
  }
}
