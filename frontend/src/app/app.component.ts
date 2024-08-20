import { Component, OnInit } from '@angular/core';
import {
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingComponent } from './loading/loading.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, FooterComponent, LoadingComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  isLoading = true;

  constructor(private router: Router) { }

  ngOnInit() {
    window.onload = () => {
      this.isLoading = false;
    };

    // Listen to router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 2500); // fallback timeout
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 2500); // fallback timeout
  }
}
