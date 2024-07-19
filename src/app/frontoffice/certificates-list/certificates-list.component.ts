
///////////////////////////////////////////////////////
////////////////////  IMPORTATIONS   //////////////////
///////////////////////////////////////////////////////

import { Component, OnInit, Input, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

// Subcomponents
import { CertifiCardComponent } from '../certifi-card/certifi-card.component';
import { NotificationsComponent } from '../notifications/notifications.component';

// Model
import { CertificateCardModel } from '../../models/certificate.models';

// Service
import { CertificateService } from '../../services/certificate.service';
import { NotificationsService } from '../../services/notifications.service';





@Component({
  selector: 'app-certificates-list',
  standalone: true,
  imports: [CommonModule,CertifiCardComponent, NotificationsComponent],
  templateUrl: './certificates-list.component.html',
  styleUrl: './certificates-list.component.scss'
})





export class CertificatesListComponent implements OnInit {
@Input() title: string = '';


// Attributes
dataCertificates: CertificateCardModel[] = [];            
token: string | null = '';

isWindowOpen = true;
isWindowToggled = false;


isNotificationWindow = false;
notificationMessage: string = '';

isLoading: Boolean = false;



// Constructor
constructor ( private certificateService: CertificateService,
              private router: Router,
              private detector: ChangeDetectorRef,
              private notificationServices: NotificationsService,
              @Inject(PLATFORM_ID) private platformId: Object) {}  



/**
 * 
 * Method used to fetch the data menu. Initialized after the creation of the component
 */              
ngOnInit(): void {
  // Local storage access only if the platform is the browser (not the server)
  if (isPlatformBrowser(this.platformId)) {
    this.token = localStorage.getItem('token');
  }
  
  if (!this.token) {
    this.notificationServices.displayNotification(this, 'login-need', 3000, '/accueil', 'client', false);
    return;
  }
  this.isLoading = true;

  this.certificateService.getCertificates(this.token).subscribe({
    next: (data: any) => {
      this.dataCertificates = data.body;
      this.isLoading = false;
      // this.detector.detectChanges();
    },
    error: (error: any) => {
      this.isLoading = false;
      // this.detector.detectChanges();
      const message: string = error.error.message;
      this.notificationServices.displayNotification(this, message, 3000, '/login', 'server', false);
    }
  });
}


/**
 * 
 * Method used to close the window and back to the home page
 */
closeWindow() {
  this.isWindowOpen = !this.isWindowOpen;
  this.router.navigate(['/accueil']);
}

/**
 * 
 * Method used to hide or show the content of the window
 */
toggleWindow() {
  this.isWindowToggled = !this.isWindowToggled;
}

}
