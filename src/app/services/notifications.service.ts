///////////////////////////////////////////////////////
////////////////////  IMPORTATIONS   //////////////////
///////////////////////////////////////////////////////

// Angular Importations
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

// Type model for async data
import { NotificationsModel } from '../models/notifications.model';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  // Attributs
  notificationMessages: NotificationsModel =
    {
      'alert-success': 'Notification de succès OK',
      'alert-failure': 'Notification d\'erreur OK',
      'login-success': 'Connexion réussie',
      'is-logout': 'Souhaitez-vous vous déconnecter ?',
      'logout-success': 'Déconnexion réussie',
      'login-need': 'Vous devez être connecté pour accéder à cette page',
      'max-attempt-reached': 'Nombre maximum de tentatives atteint'    
    }

  // Constructor
  constructor(
    private router: Router
  ) { }


  /**
   * 
   * Method to get the notification message
   * 
   * @param type the key of the notification message to get
   * @returns 
   */
  getNotificationMessage(type: string): string {
    return this.notificationMessages[type];
  }


  /**
   * 
   * @param display set to true to display the message
   * @param key the key of the message to show
   * @param timer  duration of the message
   * @param redirect choose or not to redirect to a page '/accueil' for example or null
   * @param origin  if it is from the 'client' or the 'server'
   */
  displayNotification(component: any, key: string, timer: number = 0, redirect: string | null, origin: string, choice: Boolean) {

    // Define if the notification is a choice notification
    component.isChoiceButtons = choice;

    // Most of time set to true to display the notification
    component.isNotificationWindow = true;

    if (origin === 'client' || origin === undefined) {
      component.notificationMessage = this.getNotificationMessage(key);
    } else if (origin === 'server') {
      component.notificationMessage = key;
    }

    if (timer > 0) {
      setTimeout(() => {
        component.isNotificationWindow = false;

        if (redirect !== null) {
          this.router.navigate([redirect]);
        }
      }, timer);
    }
  }

}