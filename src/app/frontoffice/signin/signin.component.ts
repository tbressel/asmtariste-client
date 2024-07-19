import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationsService } from '../../services/notifications.service';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificationsComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  signinForm: FormGroup;
  hidePassword = true;
  hidePasswordCheck = true;
  passwordStrength: any;

  isNotificationWindow = false;
  notificationMessage: string = '';

  isLoading: Boolean = false;

      // Window Attributes
      isWindowOpen = true;      // default value for the window
      isWindowToggled = false;  // default value for the window's content

            // Error Attributes
  totalError: number = 0;   // total error count initiaized to zero

  constructor(private formBuilder: FormBuilder,
    private notificationsService: NotificationsService,
    private registrationService: RegistrationService,
    private router: Router
  ) {
    this.signinForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      passwordCheck: ['', [Validators.required, Validators.minLength(8), this.passwordMatchValidator.bind(this)]]
    });

    this.signinForm.get('password')?.valueChanges.subscribe(value => this.updatePasswordStrength(value));

  }

  // Custom validator for password strength
  passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialChar = /[-+!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && value.length >= 8;
    return isValid ? null : { weakPassword: true };
  }

  // Validator to check if password and passwordCheck match
  passwordMatchValidator(control: any) {
    if (this.signinForm) {
      return control.value === this.signinForm.get('password')?.value ? null : { mismatch: true };
    }
    return null;
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  togglePasswordCheckVisibility() {
    this.hidePasswordCheck = !this.hidePasswordCheck;
  }

  // Update password strength
  updatePasswordStrength(password: string) {
    if (!password) {
      this.passwordStrength = '';
      return;
    }

    const lengthCriteria = password.length >= 8;
    const upperCaseCriteria = /[A-Z]/.test(password);
    const lowerCaseCriteria = /[a-z]/.test(password);
    const digitCriteria = /\d/.test(password);
    const specialCharCriteria = /[-+!@#$%^&*(),.?":{}|<>]/.test(password);

    if (lengthCriteria && upperCaseCriteria && lowerCaseCriteria && digitCriteria && specialCharCriteria) {
      this.passwordStrength = 'strong';
    } else if (lengthCriteria && (upperCaseCriteria || lowerCaseCriteria) && digitCriteria) {
      this.passwordStrength = 'medium';
    } else if (lengthCriteria) {
      this.passwordStrength = 'weak';
    } else {
      this.passwordStrength = '';
    }
  }


  
  // Form submission
  onSubmit() {
    if (this.signinForm.valid) {
      // console.log('Form Submitted!', this.signinForm.value);

      const { username, email, password } = this.signinForm.value;
      this.isLoading = true;

      this.registrationService.signin(username, password, email).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.notificationsService.displayNotification(this, 'signin-success', 4000, '/login', 'client', false);
        },
        error: (error) => {
          const message: string = error.error.message;

          this.isLoading = false;

          // Display a notification with the error message
          this.notificationsService.displayNotification(this, message, 4000, '/login', 'server', false);

          // Reset the form
          this.signinForm.reset();

             // Increment the total error count
        this.totalError = this.totalError + 1;

        // Redirect to the home page if the total error count is greater than or equal to 4
        if (this.totalError >= 4) {
          this.notificationsService.displayNotification(this, 'max-attempt-reached', 2000, '/accueil', 'client', false);
        }

        }
      });
    } else {
      console.error('Form is invalid');
    }
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
