import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { MatCard, MatCardImage } from '@angular/material/card';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatInput,
    MatIconButton,
    MatIcon,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    NgOptimizedImage,
    MatCard,
    MatCardImage,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginVisible = true;

  nickname: string = '';
  registerPassword: string = '';
  confirmPassword: string = '';
  registerEmail: string = '';
  role?: string;
  loginPassword: string = '';
  loginEmail: string = '';

  constructor(private authService: AuthService) {}

  onRegister() {
    console.log(this.nickname, this.registerPassword, this.registerEmail);
    this.authService.register({ nickname: this.nickname, email: this.registerEmail, password: this.registerPassword }).subscribe(response => {
      console.log(response);
    });
  }

  onLogin() {
    console.log("Email:", this.loginEmail, " Password: ", this.loginPassword);
    this.authService.login({ email: this.loginEmail, password: this.loginPassword }).subscribe(response => {
      console.log('Login response:', response);
    });
  }

  showLogin(){
    this.isLoginVisible = true;
  }
  showRegister(){
    this.isLoginVisible =false;
  }

  onLogout() {
    this.authService.logout().subscribe(response => {
      console.log('Logout response:', response);
    });
  }
}
