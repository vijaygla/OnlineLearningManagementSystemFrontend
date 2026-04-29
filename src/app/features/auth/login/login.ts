import { Component, inject, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';
import { LucideAngularModule, Mail, Lock, Loader2, ArrowRight } from 'lucide-angular';
import { environment } from '../../../../environments/environment';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Loader2 = Loader2;
  readonly ArrowRight = ArrowRight;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.initializeGoogleLogin();
  }

  private initializeGoogleLogin() {
    if (typeof google !== 'undefined') {
      // Sign out first to ensure we can re-initialize if needed
      google.accounts.id.disableAutoSelect();
      
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleGoogleLogin(response),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme: 'outline', size: 'large', width: '100%', text: 'continue_with', shape: 'pill' }
      );
    }
  }

  private handleGoogleLogin(response: any) {
    this.ngZone.run(() => {
      this.isLoading = true;
      this.authService.googleLogin(response.credential).subscribe({
        next: (res) => {
          this.toastService.success(`Welcome back, ${res.name}!`);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastService.error('Google login failed. Please try again.');
          console.error('Google login error', err);
        }
      });
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: (res) => {
          this.toastService.success(`Welcome back, ${res.name}!`);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Invalid email or password.';
          this.toastService.error(this.errorMessage);
        }
      });
    }
  }
}
