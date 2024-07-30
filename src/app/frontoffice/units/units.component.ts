
///////////////////////////////////////////////////////
////////////////////  IMPORTATIONS   //////////////////
///////////////////////////////////////////////////////

// Modules
import { CommonModule } from '@angular/common';

// Decorator
import { Component } from '@angular/core';

// Initialisation component method
import { OnInit } from '@angular/core';

// Type model
import { UnitModel } from '../../models/unit.model';

// Service
import { UnitService } from '../../services/unit.service';
import { UnitComponent } from '../unit/unit.component';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationsComponent } from '../../frontoffice/notifications/notifications.component';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [UnitComponent, CommonModule, NotificationsComponent],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss'
})
export class UnitsComponent implements OnInit {

// Attributes
dataInterface: UnitModel[] = [];
isNotificationWindow: Boolean = false;
notificationMessage: string = '';

isLoading: Boolean = false;

// Constructor
constructor(
  private unitService: UnitService,
  private notificationsService: NotificationsService) { }


/**
 * 
 * Method used to fetch the data menu. Initialized after the creation of the component
 */
ngOnInit(): void {
  this.isLoading = true;
  this.unitService.getAll().subscribe({
    next: (data: any) => {
      this.dataInterface = data.body;
      // console.log(this.dataInterface);
      this.isLoading = false;
    },
    error: (error: any) => {

      const message: string = error.error.message || 'An error occurred';

      this.notificationsService.displayNotification(this, message, 2000, null, 'server', false);

    this.isLoading = false;
    }
  });
}


}