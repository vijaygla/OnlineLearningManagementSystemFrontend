import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col font-sans">
      <!-- Main Header -->
      <header class="bg-sky-500 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <h1 class="text-xl font-bold tracking-tight">OLMS Platform</h1>
          <nav class="flex items-center space-x-6">
            <a routerLink="/" class="hover:text-sky-100 transition-colors font-semibold">Home</a>
            <a routerLink="/courses" class="hover:text-sky-100 transition-colors font-semibold">Courses</a>
            <a routerLink="/auth/login" class="bg-white text-sky-600 px-4 py-2 rounded-lg font-bold hover:bg-sky-50 transition-all active:scale-95 shadow-sm">Login</a>
          </nav>
        </div>
      </header>
      
      <main class="flex-grow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-outlet></router-outlet>
        </div>
      </main>

      <footer class="bg-slate-800 text-slate-400 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-sm">&copy; 2026 Online Learning Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `
})
export class App {}
