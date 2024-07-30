import { Component, ElementRef, ViewChild, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { CertificateService } from '../../services/certificate.service';
import { NotificationsService } from '../../services/notifications.service';
import { ActivatedRoute } from '@angular/router';


import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { NotificationsComponent } from '../notifications/notifications.component';


@Component({
  selector: 'app-view-certificate',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  templateUrl: './view-certificate.component.html',
  styleUrl: './view-certificate.component.scss'
})
export class ViewCertificateComponent implements OnInit  {

  @ViewChild('certificateElement') certificateElement!: ElementRef;
  token: string | null = null;
  username: string | null = null;
  date: string | null = null;
  title: string | null = null;

  isLoading: Boolean = false;
  // Notification Attributes
  isNotificationWindow = false;         // default value for the notification window
  notificationMessage: string = '';     // default value for the notification message

  isWindowOpen = true;
isWindowToggled = false;

  constructor(
    private certificateService: CertificateService, 
    private notificationService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


ngOnInit(): void {
  
  if (isPlatformBrowser(this.platformId)) {
    // Accès à localStorage uniquement si le code s'exécute dans le navigateur
    this.token = localStorage.getItem('token');
  }
  if (!this.token) {
    this.notificationService.displayNotification(this, 'login-need', 2000, '/login', 'client', false);
    return;
  }

  // Correction de la déclaration de la variable
  const idParam: string | null = this.route.snapshot.paramMap.get('id');
  const id: number | null = idParam !== null ? parseInt(idParam, 10) : null; // Ajout de la base 10 pour parseInt

  if (id === null) {
    this.notificationService.displayNotification(this, 'login-need', 2000, '/login', 'client', false);
    return;
  }

  this.isLoading = true;
  this.certificateService.viewCertificate(id, this.token).subscribe({
    next: (data: any) => {
      this.username = data.username.toUpperCase();
      this.date = data.creationdate;
      this.title = data.title;
      this.isLoading = false;
    }, 
    error: (error: any) => {
      const message: string = error.error.message;
      this.isLoading = false;
      this.notificationService.displayNotification(this, message, 2000, null, 'server', false);
    }
    
  });
}
  
public downloadPDF(): void {
  html2canvas(this.certificateElement.nativeElement, {scale: 6}).then(canvas => {
    
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF({
      orientation: 'portrait', // Modifier ici pour portrait
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210; // Largeur de A4 en portrait
    const pageHeight = 300; // Hauteur de A4 en portrait

    // Ajuster l'image pour qu'elle prenne toute la largeur et toute la hauteur du A4 en portrait
    doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    doc.save('certificate.pdf');
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