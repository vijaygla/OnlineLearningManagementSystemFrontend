import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, BookOpen, Award, Clock, ChevronRight, PlayCircle, ArrowRight, Loader2, Download } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { EnrollmentService } from '../../../core/services/enrollment';
import { ProgressService } from '../../../core/services/progress';
import { CertificateService } from '../../../core/services/certificate';
import { forkJoin, map, of, switchMap, catchError, shareReplay, tap, combineLatest } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.html'
})
export class StudentDashboardComponent {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private progressService = inject(ProgressService);
  private certificateService = inject(CertificateService);

  readonly BookOpen = BookOpen;
  readonly Award = Award;
  readonly Clock = Clock;
  readonly ChevronRight = ChevronRight;
  readonly PlayCircle = PlayCircle;
  readonly ArrowRight = ArrowRight;
  readonly Loader2 = Loader2;
  readonly Download = Download;
  
  downloadingCertId: string | null = null;

  enrolledCourses$ = this.enrollmentService.getMyEnrollments().pipe(
    switchMap(enrollments => {
      if (enrollments.length === 0) return of([]);
      
      const courseDetailsRequests = enrollments.map(enrol => 
        forkJoin({
          details: this.courseService.getCourseById(enrol.courseId),
          progress: this.progressService.getCourseProgress(enrol.courseId)
        }).pipe(
          map(({ details, progress }) => ({
            ...details,
            progress: progress?.completionPercentage || 0,
            enrollmentId: enrol.id
          })),
          catchError(() => of(null))
        )
      );
      
      return forkJoin(courseDetailsRequests).pipe(
        map(results => results.filter((r): r is any => r !== null))
      );
    }),
    shareReplay(1)
  );

  certificates$ = this.certificateService.getMyCertificates().pipe(shareReplay(1));

  stats$ = combineLatest([this.enrolledCourses$, this.certificates$]).pipe(
    map(([courses, certs]: [any[], any[]]) => {
      const completed = courses.filter(c => c.progress === 100).length;
      return [
        { label: 'Enrolled Courses', value: courses.length.toString(), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Completed', value: completed.toString(), icon: PlayCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Certificates', value: certs.length.toString(), icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Learning Points', value: (courses.length * 50).toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' }
      ];
    })
  );

  downloadCertificate(id: string, number: string) {
    this.downloadingCertId = id;
    this.certificateService.downloadCertificate(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificate-${number}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.downloadingCertId = null;
      },
      error: () => this.downloadingCertId = null
    });
  }
}
