import { Component } from '@angular/core';
import { AuthService } from "./auth.service";
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
  // Flag to toggle between login and registration views
  protected isLoginVisible = true;

  // Error handling status and messages
  protected isError: boolean = false;
  protected message: string = '';
  // Registration form fields
  protected nickname: string = '';
  protected registerPassword: string = '';
  protected confirmPassword: string = '';
  protected registerEmail: string = '';
  protected role?: string;
  // Login form fields
  protected loginPassword: string = '';
  protected loginEmail: string = '';


  /**
   * Constructor injecting the AuthService for authentication
   * and MatSnackBar for displaying notifications.
   */
  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

  /**
  * Handles the registration process by validating the input fields 
  * and calling the AuthService to register the user.
  */
  protected onRegister(): void {
    console.log(this.nickname, this.registerPassword, this.registerEmail);

    if (!this.nickname.trim() || !this.registerEmail.trim() || !this.registerPassword) {
      this.showError('All fields are required.');
      return;
    }

    if (!this.registerEmail.includes('@')) {
      this.showError('Please enter a valid email.');
      return;
    }

    if (this.registerPassword !== this.confirmPassword) {
      this.showError('Passwords must match.');
      return;
    }

    if (this.registerPassword.length < 8) {
      this.showError('Password must be at least 8 characters long.');
      return;
    }

    this.authService.register({ nickname: this.nickname, email: this.registerEmail, password: this.registerPassword })
      .subscribe({
        next: () => {
          this.showSuccess('Registration successful!');
        },
        error: () => {
          this.showError('Registration failed. Please try again.');
        }
      });
  }

  /**
 * Handles the login process by validating input fields
 * and calling the AuthService to log the user in.
 */
  protected onLogin(): void {

    if (!this.loginEmail.trim() || !this.loginPassword) {
      this.showError('Please enter valid data.');
      return;
    }

    this.authService.login({ email: this.loginEmail, password: this.loginPassword })
      .subscribe({
        next: response => {
          if (response.ok) {
            this.showSuccess('Login successful!');
          } else {
            this.showError('Login failed. Please check your credentials.');
          }
        },
        error: () => {
          this.showError('Login failed. Please check your credentials.');
        }
      });
  }

  /**
 * Switches to the login view.
 */
  protected showLogin(): void {
    this.isLoginVisible = true;
  }

  /**
 * Switches to the registration view.
 */
  protected showRegister(): void {
    this.isLoginVisible = false;
  }

  /**
  * Handles the user logout by calling the AuthService's logout method.
  */
  protected onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.showSuccess(' Successfully logged out!');
      },
      error: () => {
        this.showError('Logout failed. Please try again.');
      }
    });
  }

  /**
 * Opens a Material Snackbar to display a message to the user.
 * @param message The message to be displayed.
 * @param action The label for the snackbar action button (default is 'Close').
 * @param isError Indicates if the message is an error message (styles accordingly).
 */
  private openSnackBar(message: string, action: string, isError: boolean) {
    const config = new MatSnackBarConfig();
    config.duration = 4500;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center'
    config.panelClass = isError ? ['snackbar-error'] : ['snackbar-success'];

    this.snackBar.open(message, 'close', config);
  }

  /**
 * Displays an error message in a snackbar.
 * @param message The error message to be displayed.
 */
  private showError(message: string): void {
    this.isError = true;
    this.message = message;
    this.openSnackBar(this.message, 'Close', true);
  }

  /**
 * Displays a success message in a snackbar.
 * @param message The success message to be displayed.
 */
  private showSuccess(message: string): void {
    this.isError = false;
    this.message = message;
    this.openSnackBar(this.message, 'Close', false);
  }
}
