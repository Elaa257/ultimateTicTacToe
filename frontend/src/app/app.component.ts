import { Component, OnInit } from '@angular/core';
import {
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/authInterceptor';
import { LoadingComponent } from './loading/loading.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, FooterComponent, LoadingComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppComponent implements OnInit {
  title = 'frontend';

  // Flag to indicate loading state
  isLoading = true;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log("check " + this.isLoading);

    // Event handler to set loading state to false when the window has fully loaded
    window.onload = () => {

      this.isLoading = false;
      console.log("loaded " + this.isLoading);
    };

    // Subscribe to router events to manage loading state
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      // Fallback timeout to hide loading spinner after 2.5 seconds
      setTimeout(() => {
        this.isLoading = false;
      }, 2500); // fallback timeout
    });

    // Fallback timeout to hide loading spinner after 2.5 seconds
    setTimeout(() => {

      this.isLoading = false;
      console.log("fallback " + this.isLoading);
    }, 2500); // fallback timeout
  }
}
