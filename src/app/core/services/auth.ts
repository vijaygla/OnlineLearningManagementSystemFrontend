import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.models';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<User | null>(null);
  token = signal<string | null>(typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  constructor() {
    if (typeof window !== 'undefined' && this.token()) {
      // Decode token or fetch user info if needed
      // For the prototype, we'll set a mock student user
      this.currentUser.set({
        id: '1',
        name: 'John Student',
        email: 'student@example.com',
        role: 'Student'
      });
    }
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    this.token.set(res.token);
    // Ideally decode JWT to set currentUser
    // this.currentUser.set(decodedUser);
  }
}
