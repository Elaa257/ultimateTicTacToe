import { Component, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  protected readonly close = close;

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
}
