import { Component, signal } from '@angular/core';
import {AuthService} from "./auth.service";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatIconButton,
    MatIcon,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginVisible = false;

  nickname: string = '';
  registerPassword: string = '';
  confirmPassword: string = '';
  registerEmail: string = '';
  role?: string;
  loginPassword: string = '';
  loginEmail: string = '';

  constructor(private authService: AuthService) {}

  hide = signal(true);
  onPassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  onRegister() {
    this.authService.register({ nickname: this.nickname, email: this.registerEmail, password: this.registerPassword }).subscribe(response => {
      console.log('Registration response:', response);
    });
  }

  onLogin() {
    console.log("Email:", this.loginEmail, " Password: ", this.loginPassword);
    this.authService.login({ email: this.loginEmail, password: this.loginPassword }).subscribe(response => {
      console.log('Login response:', response);
    });
  }

  onLogout() {
    this.authService.logout().subscribe(response => {
      console.log('Logout response:', response);
    });
  }

  showLogin(){
    this.isLoginVisible = true;
  }
  showRegister(){
    this.isLoginVisible =false;
  }


}
