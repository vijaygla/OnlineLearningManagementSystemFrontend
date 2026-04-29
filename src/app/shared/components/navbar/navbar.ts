import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Search, Menu, X, User, Bell, LogOut, ChevronDown } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  
  readonly Search = Search;
  readonly Menu = Menu;
  readonly X = X;
  readonly User = User;
  readonly Bell = Bell;
  readonly LogOut = LogOut;
  readonly ChevronDown = ChevronDown;

  isMenuOpen = false;
  isScrolled = false;
  isProfileOpen = signal(false);
  imageError = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 20;
      });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfile() {
    this.isProfileOpen.update(v => !v);
  }

  handleImageError() {
    this.imageError.set(true);
  }

  logout() {
    this.authService.logout();
    this.toastService.success('Logged out successfully');
    this.isProfileOpen.set(false);
    this.imageError.set(false);
  }

  getInitials(name: string | undefined): string {
    if (!name || name.trim() === '') return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
