///////////////////////////////////////////////////////
////////////////////  IMPORTATIONS   //////////////////
///////////////////////////////////////////////////////

// Modules
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


// Model
import { CertificatesListModel } from '../../models/certificate.models';

// Services
import { CertificateService } from '../../services/certificate.service';
import { NotificationsService } from '../../services/notifications.service';

import { NotificationsComponent } from '../notifications/notifications.component';



@Component({
  selector: 'app-last-certificates',
  standalone: true,
  imports: [CommonModule,NotificationsComponent],
  templateUrl: './last-certificates.component.html',
  styleUrl: './last-certificates.component.scss'
})
export class LastCertificatesComponent implements OnInit {
 // Attributes
 dataAllArticles: CertificatesListModel[] = [];
 token: string | null = '';


isNotificationWindow = false;
notificationMessage: string = '';

isLoading: Boolean = false;

isWindowOpen = true;
isWindowToggled = false;

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
     this.certificateService.getAll().subscribe({
       next: (data: any) => {
         this.dataAllArticles = data.body;
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
  * Methode to navigate to the article details
  * 
  * @param article 
  * @param key 
  * @returns 
  */
 getArticlePropertyValue(article: CertificatesListModel, key: string): any {
   return article[key as keyof CertificatesListModel];
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
