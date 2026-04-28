import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, Star, Clock, BookOpen, User, Play, CheckCircle2, Globe, Calendar, Award, MessageSquare } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { ReviewService } from '../../../core/services/review';
import { map, switchMap, shareReplay } from 'rxjs';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './details.html'
})
export class CourseDetailsComponent {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private reviewService = inject(ReviewService);

  readonly Star = Star;
  readonly Clock = Clock;
  readonly BookOpen = BookOpen;
  readonly User = User;
  readonly Play = Play;
  readonly CheckCircle2 = CheckCircle2;
  readonly Globe = Globe;
  readonly Calendar = Calendar;
  readonly Award = Award;
  readonly MessageSquare = MessageSquare;

  course$ = this.route.params.pipe(
    map(params => params['id']),
    switchMap(id => this.courseService.getCourseById(id)),
    shareReplay(1)
  );

  reviews$ = this.route.params.pipe(
    map(params => params['id']),
    switchMap(id => this.reviewService.getReviewsByCourseId(id))
  );

  syllabus = [
    { title: 'Introduction to the Course', duration: '15:00', lessons: 3 },
    { title: 'Getting Started with the Basics', duration: '45:00', lessons: 8 },
    { title: 'Advanced Concepts and Techniques', duration: '1:20:00', lessons: 12 },
    { title: 'Real-world Projects', duration: '3:45:00', lessons: 15 },
    { title: 'Final Assessment and Certification', duration: '30:00', lessons: 2 }
  ];

  learningOutcomes = [
    'Master the fundamental concepts of the subject',
    'Build real-world projects from scratch',
    'Learn industry best practices and workflows',
    'Gain hands-on experience with modern tools',
    'Prepare for professional certification',
    'Join a global community of expert practitioners'
  ];
}
