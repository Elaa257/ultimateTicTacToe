import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardImage } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { UserService } from './user.service';
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
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: UserDTO | undefined;
  isModalOpen = false;
  selectedImage:string | ArrayBuffer | null = null;
  wins = 20;
  losses = 13;
  draws = 4;
  winRate = (this.wins / (this.wins + this.losses + this.draws)).toFixed(2);

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
  openModal(){
    this.isModalOpen = true;
  }
  closeModal(){
    this.isModalOpen = false;
  }
  onFileSelected(event:any){
    const file = event.dataTransfer?.files[0];
    this.uploadImage(file)
  }
  onDrop(event:DragEvent){
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if(file){
      this.uploadImage(file);
    }
  }
  onDragOver(event: DragEvent){
    event.preventDefault();
  }

  uploadImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result; // Zeigt das hochgeladene Bild an
    };
    reader.readAsDataURL(file);
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
    { opponent: 'Player123', result: 'Win', eloChange: '+25' }
  ];

  // Daten für das Diagramm
  chartData = [
    { data: [this.wins, this.losses, this.draws], label: 'Games' }
  ];
  chartLabels = ['Wins', 'Losses', 'Draws'];
  chartOptions = {
    responsive: true,
  };

}
