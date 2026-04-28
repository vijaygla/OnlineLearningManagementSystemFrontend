import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, BookOpen, Award, Clock, ChevronRight, PlayCircle, ArrowRight } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { CertificateService } from '../../../core/services/certificate';
import { map } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.html'
})
export class StudentDashboardComponent {
  private courseService = inject(CourseService);
  private certificateService = inject(CertificateService);

  readonly BookOpen = BookOpen;
  readonly Award = Award;
  readonly Clock = Clock;
  readonly ChevronRight = ChevronRight;
  readonly PlayCircle = PlayCircle;
  readonly ArrowRight = ArrowRight;

  enrolledCourses$ = this.courseService.getCourses().pipe(
    map(courses => courses.slice(0, 3).map(c => ({
      ...c,
      progress: Math.floor(Math.random() * 100)
    })))
  );

  certificates$ = this.certificateService.getStudentCertificates();

  stats = [
    { label: 'Enrolled Courses', value: '12', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: '4', icon: PlayCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Certificates', value: '3', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Hours Learned', value: '156', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];
}
