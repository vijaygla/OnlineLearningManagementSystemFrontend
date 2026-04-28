import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ShieldCheck, Users, BookOpen, AlertCircle, Check, X, Search } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.html'
})
export class AdminDashboardComponent {
  private courseService = inject(CourseService);

  readonly ShieldCheck = ShieldCheck;
  readonly Users = Users;
  readonly BookOpen = BookOpen;
  readonly AlertCircle = AlertCircle;
  readonly Check = Check;
  readonly X = X;
  readonly Search = Search;

  pendingCourses$ = this.courseService.getCourses().pipe(
    map(courses => courses.slice(0, 3).map(c => ({
      ...c,
      submittedDate: '2 hours ago'
    })))
  );

  stats = [
    { label: 'Total Users', value: '15,420', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Courses', value: '450', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Approval', value: '12', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'System Health', value: 'Optimal', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];
}
