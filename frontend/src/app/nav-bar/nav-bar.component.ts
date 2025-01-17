import { Component, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { QueueModalComponent } from '../queue-modal/queue-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatChip, MatChipListbox, MatChipSet } from '@angular/material/chips';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatButton,
    MatToolbar,
    MatMenu,
    MatSidenavContainer,
    MatNavList,
    NgClass,
    MatMenuTrigger,
    MatIconButton,
    MatIcon,
    MatMenuItem,
    RouterLink,
    MatSidenav,
    MatSidenavModule,
    RouterLinkActive,
    MatChip,
    MatChipListbox,
    MatChipSet,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, public dialog: MatDialog){}

  ngDoCheck() {
    this.authService.isAuthenticated().subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
      },
      (error) => {
        console.error("Error checking authentication", error);
        this.isLoggedIn = false;
      }
    );
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  handleClick(event: Event): void {
    const target = event.currentTarget as HTMLElement;

    document.querySelectorAll('.highlighted').forEach(item => {
      item.classList.remove('highlighted');
    });

    target.classList.add('highlighted');

    // Remove highlight
    setTimeout(() => {
      target.classList.remove('highlighted');
    }, 1500);

    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  openQueueModal(): void {
    if (this.sidenav) {
      this.sidenav.close();
    }

    this.dialog.open(QueueModalComponent, {
      disableClose: true,
      hasBackdrop: true,
    });
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
