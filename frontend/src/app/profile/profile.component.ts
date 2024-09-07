import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { UserService } from './user.service';

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
  user:any;
  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe((data) => {
      console.log('Message Profile:', data);
      this.user = data;
    },
      (error) =>{
      console.error("Error getting profile", error);
      })
  }

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
