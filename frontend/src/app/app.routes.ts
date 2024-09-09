import { RouterModule, Routes } from '@angular/router';
import { AuthComponent} from './auth/auth.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth/authGuard';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { RedirectGuard } from './auth/redirect.guard';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, RedirectGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminPageComponent , canActivate: [AuthGuard, RedirectGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
