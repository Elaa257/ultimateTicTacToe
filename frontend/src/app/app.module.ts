import { NgModule } from '@angular/core';
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
import {IMAGE_LOADER, ImageLoaderConfig} from '@angular/common';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppComponent,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    FooterComponent,
    HomeComponent,
    NavBarComponent
  ],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `https://example.com/${config.src}-${config.width}.jpg}`;
      }
    },
  ],
})
export class AppModule { }
