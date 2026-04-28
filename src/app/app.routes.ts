import { Routes } from '@angular/router';
import { LandingComponent } from './features/home/landing/landing';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { CatalogComponent } from './features/courses/catalog/catalog';
import { CourseDetailsComponent } from './features/courses/details/details';
import { StudentDashboardComponent } from './features/student/dashboard/dashboard';
import { LearningPlayerComponent } from './features/learn/player/player';
import { CheckoutComponent } from './features/checkout/checkout';
import { InstructorDashboardComponent } from './features/instructor/dashboard/dashboard';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'courses', component: CatalogComponent },
  { path: 'courses/:id', component: CourseDetailsComponent },
  { path: 'student/dashboard', component: StudentDashboardComponent },
  { path: 'learn/:courseId', component: LearningPlayerComponent },
  { path: 'checkout/:courseId', component: CheckoutComponent },
  { path: 'instructor/dashboard', component: InstructorDashboardComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
