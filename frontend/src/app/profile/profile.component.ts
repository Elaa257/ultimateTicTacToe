import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatCardImage,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout().subscribe(response =>({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (err: any) => {
        console.error('Logout failed', err);
      }
    }));
  }

}
