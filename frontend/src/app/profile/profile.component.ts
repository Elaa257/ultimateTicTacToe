import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { UserService } from './user.service';
import { MatDialog } from '@angular/material/dialog';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { NgOptimizedImage } from '@angular/common';
import { UserDTO } from './DTOs/userDTO';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { QueueModalComponent } from '../queue-modal/queue-modal.component';

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
    BaseChartDirective,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    NgOptimizedImage,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  user: UserDTO | undefined;
  isModalOpen = false;
  selectedImage: string | null ='';
  wins = 0;
  losses = 0;
  draws = 0;
  winRate = this.wins == 0 && this.losses == 0 ? '0' : (this.wins / (this.wins + this.losses)).toFixed(2);

  constructor(private authService: AuthService, private userService: UserService, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.selectedImage = '/profile-picture.jpg'
    this.userService.getProfile().subscribe((data) => {
        this.user = data.user;
        console.log('WO IST DRAW: ', this.user);
        if (this.user) {
          this.wins = this.user.wins
          this.losses = this.user.loses
          this.draws = this.user.draw;
        }
        if (this.user?.profilePicture) {
          this.selectedImage ='data:image/jpeg;base64'+ this.user.profilePicture;
        }

      },
      (error) => {
        console.error('Error getting profile', error);
      });
  }
  openSnackBar(message: string, action:string, isError: boolean) {
    const config = new MatSnackBarConfig();
    config.duration = 4500;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center'
    config.panelClass = isError ? ['snackbar-error'] : ['snackbar-success']; // Verwende die entsprechenden Klassen

    this.snackBar.open(message, 'close',config);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file){
      this.uploadImage(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  uploadImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;  // Base64-String wird hier gespeichert
      console.log(this.selectedImage);  // Zum Debuggen, um den Base64-String zu sehen

      if (this.user?.email && this.selectedImage) {
        // Sende das Bild an den Backend-Dienst
        this.userService.changeProfilePicture(this.selectedImage, this.user.email).subscribe(
          (response) => {
            if (response.ok){
              this.openSnackBar('Profile Picture changed', 'close', false);
            }else{
              this.openSnackBar('Something went wrong', 'close', true);
            }
          },
          (error) => {
            console.log('Fehler beim Hochladen des Bildes', error);
          }
        );
      } else {
        console.error('Email oder Bild fehlt');
      }
    };

    reader.readAsDataURL(file);  // Lies die Datei als Data URL (Base64-String)
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmPasswordChange(result.currentPassword, result.newPassword);
      }
    });
  }

  confirmPasswordChange(currentPassword: string, newPassword: string): void {
    const email = this.user?.email;

    if (newPassword.trim().length < 0){
      this.openSnackBar('you have to choose a valid Password', 'close', true)
      return
    }
    if (email !== undefined) {
      if (confirm('Möchten Sie Ihr Passwort wirklich ändern?')) {
          this.userService.changePassword(currentPassword, newPassword, email).subscribe(
          (response) => {
            if(response.ok) {
              this.openSnackBar('Password was change', 'close',false)
            }else{
             this.openSnackBar('Something went wrong', 'close',true)
            }

          },
          (error) => {
            console.error('Fehler beim Ändern des Passworts', error);
          },
        );
      } else {
        console.log('Email is undefined', email);
      }
    }

  }

  openQueueModal(): void {
    this.dialog.open(QueueModalComponent, {
      disableClose: true,
      hasBackdrop: true,
    });
  }

  gameHistory = [
    { opponent: 'JaneDoe', result: 'Win', eloChange: '+20' },
    { opponent: 'MaxMustermann', result: 'Lose', eloChange: '-15' },
    { opponent: 'Player123', result: 'Win', eloChange: '+25' },
    { opponent: 'MaxMustermann', result: 'Lose', eloChange: '-15' },
    { opponent: 'Player123', result: 'Win', eloChange: '+25' },
    { opponent: 'MaxMustermann', result: 'Lose', eloChange: '-15' },
    { opponent: 'Player123', result: 'Win', eloChange: '+25' },
    { opponent: 'MaxMustermann', result: 'Lose', eloChange: '-15' },
    { opponent: 'Player123', result: 'Win', eloChange: '+25' },
  ];

  // Daten für das Diagramm
  chartData = [
    { data: [this.wins, this.losses, this.draws], label: 'Games' },
  ];
  chartLabels = ['Wins', 'Losses', 'Draws'];
  chartOptions = {
    responsive: true,
  };

}
