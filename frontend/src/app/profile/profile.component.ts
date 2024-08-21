import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
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
