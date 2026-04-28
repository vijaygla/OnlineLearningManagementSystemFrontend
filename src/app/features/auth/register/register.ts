import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { LucideAngularModule, Mail, Lock, User, Loader2, ArrowRight, Shield } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly User = User;
  readonly Loader2 = Loader2;
  readonly ArrowRight = ArrowRight;
  readonly Shield = Shield;

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['Student', [Validators.required]]
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formData = this.registerForm.value;
      this.authService.register({
        name: formData.name!,
        email: formData.email!,
        password: formData.password!,
        role: formData.role!
      }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Registration failed. This email might already be in use.';
          console.error('Registration error', err);
        }
      });
    }
  }
}
