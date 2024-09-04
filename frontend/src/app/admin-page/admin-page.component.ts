import { Component, HostListener, OnInit } from '@angular/core';
import { MatCard, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatTab, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { UserService } from '../profile/user.service';
import { MatOption, MatSelect } from '@angular/material/select';
import { UserDTO, UsersDTO } from '../profile/DTOs/userDTO';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatCard,
    MatCardTitle,
    MatTabGroup,
    MatTab,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatFormFieldModule,
    MatSelect,
    MatOption,
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit{

  isSmallScreen = false;
  selectedTab = 'players'; // Default selected tab
  tabIndex = 0; // Tracks the current tab index in MatTabGroup

  users: UserDTO[] = [];
  displayedColumns: string[] = ['id', 'nickname', 'email', 'elo', 'role'];

  currentQueue: { clientId: string; username: string; elo: number }[] = [];

  queueColumns: string[] = ['clientId', 'username', 'elo'];

  constructor(private userService: UserService, private adminService: AdminService) {}

  ngOnInit(): void {

    this.checkScreenSize();

    this.userService.getAllUsers().subscribe((data: UsersDTO) => {
      this.users = data.users || [];
      console.log('Message:', data.message);
      console.log('Users:', this.users);
    });

    //Gets queue data from server
    this.adminService.emit('get-queue');

    this.adminService.listen<{ clientId: string; username: string; elo: number }[]>('queue-data')
      .subscribe(data => {
        console.log('Received updated queue data:', data);
        this.currentQueue = data;
      });

    this.adminService.listen('unauthorized')
      .subscribe(() => {
        alert('Unauthorized access. Admin privileges required.');
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 600;
    if (!this.isSmallScreen) {
      this.selectedTab = this.getTabNameByIndex(this.tabIndex);
    }
  }

  getTabNameByIndex(index: number): string {
    switch (index) {
      case 0: return 'players';
      case 1: return 'queue';
      case 2: return 'currentGames';
      default: return 'players';
    }
  }
}

