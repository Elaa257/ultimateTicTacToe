import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { BaseChartDirective } from 'ng2-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

export function initializeApp(): () => Promise<void> {
  return (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 2000); // Delay for 2 seconds before resolving
    });
  };
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AppComponent,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    FooterComponent,
    HomeComponent,
    NavBarComponent,
    AdminPageComponent,
    AuthComponent,
    LoadingComponent,
    BaseChartDirective,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true
    }
  ],
})
export class AppModule { }
