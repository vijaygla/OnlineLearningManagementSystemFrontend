import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Plus, Users, DollarSign, BookOpen, Star, TrendingUp, MoreVertical } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { map } from 'rxjs';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.html'
})
export class InstructorDashboardComponent {
  private courseService = inject(CourseService);

  readonly Plus = Plus;
  readonly Users = Users;
  readonly DollarSign = DollarSign;
  readonly BookOpen = BookOpen;
  readonly Star = Star;
  readonly TrendingUp = TrendingUp;
  readonly MoreVertical = MoreVertical;

  myCourses$ = this.courseService.getCourses().pipe(
    map(courses => courses.slice(0, 4))
  );

  stats = [
    { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Students', value: '1,240', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Courses', value: '6', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];
}
