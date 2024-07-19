import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { NavigationService } from '../../services/navigation.service';
import { NotificationsComponent } from '../../frontoffice/notifications/notifications.component';
import { NotificationsService } from '../../services/notifications.service';
import { switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificationsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Attributs
  loginForm: FormGroup;
  errorMessage: string | null = null;

  isNotificationWindow: Boolean = false;
  notificationMessage: string = '';

  isLoading: Boolean = false;

  showPassword: Boolean = false;

    // Window Attributes
    isWindowOpen = true;      // default value for the window
    isWindowToggled = false;  // default value for the window's content

      // Error Attributes
  totalError: number = 0;   // total error count initiaized to zero


  // Constructor
  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private navigationService: NavigationService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  /**
   * Method to submit the login form
   */
  onSubmit(): void {
    this.isLoading = true;
  
    // Check if the form is valid
    if (this.loginForm.valid) {
      // Get the username and password from the form
      const { username, password } = this.loginForm.value;
  
      this.registrationService.login(username, password).pipe(
        switchMap((data: any) => {
          // Store the token in the local storage if present
          if (data.sessionToken?.sessionToken) {
            localStorage.setItem('token', data.sessionToken.sessionToken);
            // Proceed to check if the user is an admin
            return this.registrationService.isAdmin();
          } else {
            throw new Error('Session token is missing');
          }
        }),
        tap((isAdminData: any) => {
          // Update the menu state with the value of isAdmin
          this.updateMenuState(isAdminData.state);

          if (isAdminData.state) {
            // Display success notification and navigate to the admin page
            this.notificationsService.displayNotification(this, 'login-success', 2000, '/admin', 'client', false);
          } else {
          // Display success notification and navigate to the home page
          this.notificationsService.displayNotification(this, 'login-success', 2000, '/accueil', 'client', false);
          }
        }),
        catchError((error: any) => {
          const message = error.error?.message || 'An error occurred';
          // Display error notification
          this.notificationsService.displayNotification(this, message, 2000, null, 'server', false);

          // Increment the total error count
        this.totalError = this.totalError + 1;

        // Reset the form
        this.loginForm.reset();

        // Redirect to the home page if the total error count is greater than or equal to 4
        if (this.totalError >= 4) {
          this.notificationsService.displayNotification(this, 'max-attempt-reached', 2000, '/accueil', 'client', false);
        }


          return of(null); // Return a safe fallback
        }),
        finalize(() => {
          // Ensure loading state is set to false regardless of the outcome
          this.isLoading = false;
        })
      ).subscribe();
    }
  }

  /**
   * 
   * Method to update the menu state
   * 
   * @param isAdmin 
   */
  private updateMenuState(isAdmin: boolean): void {

    // define the news states of the menu
    const menuStates: any = {
      isLogin: false,
      isSignin: false,
      isLogout: true,
      isAdmin: isAdmin
    };

    // send the new states to the navigation service
    this.navigationService.updateMenuRightStates(menuStates);
  }


  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }



  /**
   * Closing the window and redirecting to the home page whant clicking on the close button
   */
  closeWindow() {
    this.isWindowOpen = !this.isWindowOpen;
    this.router.navigate(['/accueil']);
  }

/**
 * Hide or show the window content
 */
  toggleWindow() {
    this.isWindowToggled = !this.isWindowToggled;
  }
}

