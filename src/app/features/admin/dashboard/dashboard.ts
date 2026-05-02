import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ShieldCheck, Users, BookOpen, AlertCircle, Check, X, Search, Loader2, Trash2 } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { UserService } from '../../../core/services/user';
import { ToastService } from '../../../core/services/toast';
import { map, forkJoin, of, switchMap, shareReplay, BehaviorSubject, combineLatest, startWith, catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../core/models/course.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class AdminDashboardComponent {
  private courseService = inject(CourseService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  readonly ShieldCheck = ShieldCheck;
  readonly Users = Users;
  readonly BookOpen = BookOpen;
  readonly AlertCircle = AlertCircle;
  readonly Check = Check;
  readonly X = X;
  readonly Search = Search;
  readonly Loader2 = Loader2;
  readonly Trash2 = Trash2;

  public refreshSubject = new BehaviorSubject<void>(undefined);
  userSearchQuery = '';
  private userSearchSubject = new BehaviorSubject<string>('');

  pendingCourses$ = this.refreshSubject.pipe(
    switchMap(() => this.courseService.getCoursesByStatus(0)), // 0 = Pending
    map(courses => courses.map(c => ({
      ...c,
      submittedDate: 'Just now'
    }))),
    shareReplay(1)
  );

  users$ = combineLatest([
    this.refreshSubject.pipe(switchMap(() => this.userService.getAllUsers())),
    this.userSearchSubject.pipe(startWith(''))
  ]).pipe(
    map(([users, query]) => {
      if (!query.trim()) return users;
      const lowerQuery = query.toLowerCase();
      return users.filter(u => 
        u.name.toLowerCase().includes(lowerQuery) || 
        u.email.toLowerCase().includes(lowerQuery)
      );
    }),
    shareReplay(1)
  );

  stats$ = this.refreshSubject.pipe(
    switchMap(() => forkJoin({
      totalUsers: this.userService.getUserCount().pipe(catchError(() => of(0))),
      activeCourses: this.courseService.getCoursesByStatus(1).pipe(catchError(() => of([]))), // 1 = Approved
      pendingCourses: this.courseService.getCoursesByStatus(0).pipe(catchError(() => of([]))) // 0 = Pending
    })),
    map(({ totalUsers, activeCourses, pendingCourses }: { totalUsers: number, activeCourses: Course[], pendingCourses: Course[] }) => [
      { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Active Courses', value: activeCourses.length.toString(), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Pending Approval', value: pendingCourses.length.toString(), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'System Health', value: 'Optimal', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' }
    ])
  );

  allCourses$ = this.refreshSubject.pipe(
    switchMap(() => this.courseService.getCourses()),
    shareReplay(1)
  );

  onUserSearchChange() {
    this.userSearchSubject.next(this.userSearchQuery);
  }

  approveCourse(id: string) {
    this.courseService.updateCourseStatus(id, 1).subscribe({ // 1 = Approved
      next: () => {
        this.toastService.success('Course approved successfully');
        this.refreshSubject.next();
      },
      error: () => this.toastService.error('Failed to approve course')
    });
  }

  rejectCourse(id: string) {
    this.courseService.updateCourseStatus(id, 2).subscribe({ // 2 = Rejected
      next: () => {
        this.toastService.success('Course rejected');
        this.refreshSubject.next();
      },
      error: () => this.toastService.error('Failed to reject course')
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.toastService.success('User deleted successfully');
          this.refreshSubject.next();
        },
        error: () => this.toastService.error('Failed to delete user')
      });
    }
  }
}
