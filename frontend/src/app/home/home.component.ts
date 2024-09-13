import { Component } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { QueueModalComponent } from '../queue-modal/queue-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatButton,
    MatCardTitle,
    MatCardActions,
    MatCardImage,
    RouterLink,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isLoggedIn: boolean = false;

  constructor(public dialog: MatDialog, private authService: AuthService) {}

  openQueueModal(): void {
    this.dialog.open(QueueModalComponent, {
      disableClose: true,
      hasBackdrop: true,
    });
  }
}
