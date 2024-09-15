import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { QueueModalComponent } from '../queue-modal/queue-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatButton,
    MatCardTitle,
    MatCardActions,
    MatCardImage,
    RouterLink,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
 * Gibt an, ob der Benutzer authentifiziert ist.
 */
  protected isLoggedIn: boolean = false;
  /**
 * Subscription zur Verwaltung der Authentifizierungs-Observable.
 * Wird verwendet, um die Subscription bei der Zerstörung der Komponente zu kündigen.
 */
  private authSubscription!: Subscription;

  constructor(public dialog: MatDialog, private authService: AuthService) { }

  /**
 * Lifecycle-Hook, der beim Initialisieren der Komponente aufgerufen wird.
 * Abonniert den Authentifizierungsstatus des Benutzers und aktualisiert die isLoggedIn-Eigenschaft entsprechend.
 */
  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated().subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
      },
      (error: any) => {
        console.error("Error checking authentication", error);
        this.isLoggedIn = false;
      }
    );
  }

  /**
 * Lifecycle-Hook, der aufgerufen wird, wenn die Komponente zerstört wird.
 * Kündigt die Authentifizierungs-Subscription, um Speicherlecks zu vermeiden.
 */
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /**
 * Öffnet das Warteschlangen-Modal.
 * 
 * Das Modal ist konfiguriert, um nicht geschlossen werden zu können, solange es geöffnet ist,
 * und zeigt eine Hintergrundabschattung (Backdrop).
 */
  protected openQueueModal(): void {
    this.dialog.open(QueueModalComponent, {
      disableClose: true,
      hasBackdrop: true,
    });
  }
}
