import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatMenu } from '@angular/material/menu';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatButton,
    MatToolbar,
    MatMenu,
    MatSidenavContainer,
    MatNavList,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

}
