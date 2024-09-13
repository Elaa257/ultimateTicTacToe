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
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { config } from 'rxjs';

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
  isError:boolean = false;
  nickname: string = '';
  registerPassword: string = '';
  confirmPassword: string = '';
  registerEmail: string = '';
  role?: string;
  loginPassword: string = '';
  loginEmail: string = '';
  message:string = '';


  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, isError: boolean) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = isError ? ['snackbar-error'] : ['snackbar-success']; // Verwende die entsprechenden Klassen

    this.snackBar.open(message, 'Close', config);
  }
  onRegister() {
    console.log(this.nickname, this.registerPassword, this.registerEmail);

    if (this.registerEmail === '' || this.registerPassword === '' || this.nickname === '') {
      this.isError = true;
      this.message = 'The input fields are required.';
      this.openSnackBar(this.message, 'Close', true); // Fehler: Snackbar rot
      return;
    }

    if (this.nickname.trim().length <= 0) {
      this.isError = true;
      this.message = 'Please enter a valid nickname';
      this.openSnackBar(this.message, 'Close', true); // Fehler: Snackbar rot
      return;
    }

    if (this.registerEmail.trim().length <= 0 || !this.registerEmail.includes('@')) {
      this.isError = true;
      this.message = 'Please enter a valid email';
      this.openSnackBar(this.message, 'Close', true); // Fehler: Snackbar rot
      return;
    }

    if (this.registerPassword !== this.confirmPassword) {
      this.isError = true;
      this.message = 'The passwords must match';
      this.openSnackBar(this.message, 'Close', true); // Fehler: Snackbar rot
      return;
    }

    if (this.registerPassword.length < 8) {
      this.isError = true;
      this.message = 'The password must be at least 8 characters long';
      this.openSnackBar(this.message, 'Close', true); // Fehler: Snackbar rot
      return;
    }

    this.authService.register({ nickname: this.nickname, email: this.registerEmail, password: this.registerPassword })
      .subscribe(response => {
        console.log(response);
        this.isError = false;
        this.message = 'Successfully registered';
        this.openSnackBar(this.message, 'Close', false); // Erfolg: Snackbar grün
      }, error => {
        this.isError = true;
        this.message = 'Registration failed. Try again.';
        this.openSnackBar(this.message, 'Close', true); // Fehler: Snackbar rot
      });
  }

  onLogin() {
    console.log("Email:", this.loginEmail, " Password: ", this.loginPassword);
    if (this.loginEmail === ''|| this.loginPassword === ''){
      this.isError = true;
      this.message = 'please enter some valid data'
      this.openSnackBar(this.message, 'close', true);
      return
    }

    this.authService.login({ email: this.loginEmail, password: this.loginPassword })
      .subscribe(response => {
        console.log('Login response:', response);
        this.isError = false;
        this.message = 'Login successful';
        this.openSnackBar(this.message, 'Close', false); // Erfolg: Snackbar grün
      }, error => {
        this.isError = true;
        this.message = 'Login failed. Please check your credentials.';
        this.openSnackBar(this.message, 'Close', true); // Fehler: Snackbar rot
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
