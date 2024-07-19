/////////////////////////////////////////
////////////    Importations  ///////////
/////////////////////////////////////////

// Angular Core
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Models
import { FileModel } from '../../models/unit-files.model';

// Services
import { UnitService } from '../../services/unit.service';
import { NotificationsService } from '../../services/notifications.service';

import { NotificationsComponent } from '../../frontoffice/notifications/notifications.component';

// Config
import { CONFIG } from '../../../config';


@Component({
  selector: 'app-unit-files',
  standalone: true,
  imports: [CommonModule,NotificationsComponent],
  templateUrl: './unit-files.component.html',
  styleUrl: './unit-files.component.scss'
})
export class UnitFilesComponent implements OnInit {

// Input & Output Props
@Input() diskId?: any;                                    // Props reveived from the parent component
@Input() isParentWindowOpened: boolean | undefined;       // Props content state of the parent component
@Output() parentWindowStateSend = new EventEmitter<boolean>();      // Props sent to the parent component  


// Attributes
baseUrl = CONFIG.baseUrl;             // Base url of the API
dataFiles: FileModel[] = [];          // Data files of the disk unit

isChildWindowOpened: boolean = false;   // Window state of the child component
isContentToggled: boolean = false;    // Content state of the child component

isNotificationWindow: Boolean = false;
notificationMessage: string = '';

isLoading: Boolean = false;


// Constructor
constructor(
  private fileService: UnitService,
  private notificationsService: NotificationsService) { }


  // Methods
  /**
   * 
   * Method used to fetch the data menu. Initialized after the creation of the component
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.fileService.getFile(this.diskId).subscribe({
      next: (data: any) => {
        this.dataFiles = data.body;
        
        // The state of the parent component is now the state of the child component
        if (this.isParentWindowOpened !== undefined) {
          this.isChildWindowOpened = this.isParentWindowOpened;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        const message = error.error?.message || 'An error occurred';
        // Display error notification
        this.notificationsService.displayNotification(this, message, 2000, null, 'server', false);
        this.isLoading = false;
      }
      
    });
  }
  /**
 * 
 * Method used to close the window
 */
  closeWindow() {
    // toggle the state of the window
    this.isChildWindowOpened = false;

    // change the state of the parent component
    this.parentWindowStateSend.emit(false);
  }

  /**
   * 
   * Method used to toggle the window
   */
  hideContent() {
    this.isContentToggled = !this.isContentToggled;
  }
}
