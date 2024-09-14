import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { UserService } from '../profile/user.service';
import { MatSelectModule } from '@angular/material/select';
import { UserDTO, UsersDTO } from '../profile/DTOs/userDTO';
import {
  MatTableModule,
} from '@angular/material/table';
import { AdminService } from './admin.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit, OnDestroy {
  isSmallScreen = false;
  selectedTab = 'players'; // Default selected tab
  tabIndex = 0; // Tracks the current tab index in MatTabGroup

  users: UserDTO[] = [];
  displayedColumns: string[] = ['id', 'nickname', 'email', 'elo', 'role'];

  currentQueue: { clientId: string; username: string; elo: number }[] = [];
  activeGames: any[] = [];

  queueColumns: string[] = ['clientId', 'username', 'elo'];
  gameColumns: string[] = ['id', 'player1', 'player2'];

  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.userService.getAllUsers().subscribe((data: UsersDTO) => {
      this.users = data.users || [];
      console.log('Message:', data.message);
      console.log('Users:', this.users);
    });

    // Emit event to get the initial queue data
    this.adminService.emit('get-queue');

    // Listen for updated queue data
    const queueSub = this.adminService
      .listen<{ clientId: string; username: string; elo: number }[]>(
        'queue-data'
      )
      .subscribe((data) => {
        console.log('Received updated queue data:', data);
        this.currentQueue = data;
      });
    this.subscriptions.push(queueSub);

    // Listen for unauthorized event
    const unauthorizedSub = this.adminService
      .listen('unauthorized')
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
    this.subscriptions.push(unauthorizedSub);

    // Emit event to get the initial active games data
    this.adminService.emit('get-games');

    // Listen for active games updates
    const activeGamesSub = this.adminService
      .listen<any[]>('active-games')
      .subscribe((data) => {
        console.log('Received active games data:', data);
        this.activeGames = data;
      });
    this.subscriptions.push(activeGamesSub);
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
      case 0:
        return 'players';
      case 1:
        return 'queue';
      case 2:
        return 'currentGames';
      default:
        return 'players';
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
