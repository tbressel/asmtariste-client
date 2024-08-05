///////////////////////////////////////////////////////
////////////////////  IMPORTATIONS   //////////////////
///////////////////////////////////////////////////////

// Modules
import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';


// Model
import { CertificatesAverageModel } from '../../models/certificate.models';
import { CertificatesNotesMedals } from '../../models/certificate.models';

// Services
import { CertificateService } from '../../services/certificate.service';
import { NotificationsService } from '../../services/notifications.service';

import { NotificationsComponent } from '../notifications/notifications.component';


@Component({
  selector: 'app-average-certificates',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  templateUrl: './average-certificates.component.html',
  styleUrl: './average-certificates.component.scss'
})
export class AverageCertificatesComponent implements OnInit {
// Attributes
dataCertificateAverages: CertificatesAverageModel[] = [];
token: string | null = '';


isNotificationWindow = false;
notificationMessage: string = '';

isLoading: Boolean = false;

isWindowOpen = true;
isWindowToggled = false;

parsedDatas: CertificatesNotesMedals[][] = [];



// Constructor
constructor(private certificateService: CertificateService,
 private notificationsService: NotificationsService,
 private router: Router) { }

  /**
  * Methode to get all articles
  * 
  */
 ngOnInit(): void {

  this.isLoading = true;
   this.certificateService.getAverage().subscribe({
     next: (data: any) => {
       this.dataCertificateAverages = data.body;

      // transfome notes field string to object
       this.parsedDatas = this.dataCertificateAverages.map((element) => {
        return JSON.parse(element.notes) as CertificatesNotesMedals[];
        });
        
       this.isLoading = false;
      
     },
     error: (error: any) => {
     this.isLoading = false;
     const message: string = error.error.message;
     this.notificationsService.displayNotification(this, message, 3000, null, 'server', false);

     }
   });
}


  /**
   * 
   * Method used to close the window
   */
  closeWindow() {
    this.isWindowOpen = !this.isWindowOpen;
    this.router.navigate(['/accueil']);
  }

  /**
   * 
   * Method used to toggle the window
   */
  toggleWindow() {
    this.isWindowToggled = !this.isWindowToggled;
  }


}
