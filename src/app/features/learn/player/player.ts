import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule, ChevronLeft, ChevronRight, Play, CheckCircle2, MessageSquare, FileText, HelpCircle, Trophy, Loader2, Send, User, Star, Award, Download } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { ContentService } from '../../../core/services/content';
import { AssessmentService } from '../../../core/services/assessment';
import { DiscussionService } from '../../../core/services/discussion';
import { ProgressService } from '../../../core/services/progress';
import { ReviewService } from '../../../core/services/review';
import { CertificateService } from '../../../core/services/certificate';
import { AuthService } from '../../../core/services/auth';
import { map, switchMap, shareReplay, tap, combineLatest, of, BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { QuizResult } from '../../../core/models/assessment.models';
import { Section } from '../../../core/models/content.models';
import { CourseProgress } from '../../../core/models/progress.models';
import { Review } from '../../../core/models/review.models';

@Component({
  selector: 'app-learning-player',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  templateUrl: './player.html'
})
export class LearningPlayerComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private contentService = inject(ContentService);
  private assessmentService = inject(AssessmentService);
  private discussionService = inject(DiscussionService);
  private progressService = inject(ProgressService);
  private reviewService = inject(ReviewService);
  private certificateService = inject(CertificateService);
  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer);
  private destroy$ = new Subject<void>();

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Play = Play;
  readonly CheckCircle2 = CheckCircle2;
  readonly MessageSquare = MessageSquare;
  readonly FileText = FileText;
  readonly HelpCircle = HelpCircle;
  readonly Trophy = Trophy;
  readonly Loader2 = Loader2;
  readonly Send = Send;
  readonly User = User;
  readonly Star = Star;
  readonly Award = Award;
  readonly Download = Download;

  courseId$ = this.route.params.pipe(map(p => p['courseId'] as string));
  
  course$ = this.courseId$.pipe(
    switchMap(id => this.courseService.getCourseById(id)),
    shareReplay(1)
  );

  sections$ = this.courseId$.pipe(
    switchMap(id => this.contentService.getSectionsByCourseId(id)),
    tap(sections => {
      this.currentSections = sections.sort((a, b) => a.order - b.order);
      if (this.currentSections.length > 0 && !this.currentLesson) {
         this.activeModuleIndex = 0;
         this.activeLessonIndex = 0;
      }
    }),
    shareReplay(1)
  );

  private progressRefresh$ = new BehaviorSubject<void>(undefined);
  progress$ = combineLatest([this.courseId$, this.progressRefresh$]).pipe(
    switchMap(([id]) => this.progressService.getCourseProgress(id)),
    tap(p => this.currentProgress = p),
    shareReplay(1)
  );

  quiz$ = this.courseId$.pipe(
    switchMap(id => this.assessmentService.getQuizByCourseId(id))
  );

  threads$ = this.courseId$.pipe(
    switchMap(id => this.discussionService.getThreadsByCourseId(id))
  );

  private reviewRefresh$ = new BehaviorSubject<void>(undefined);
  reviews$ = combineLatest([this.courseId$, this.reviewRefresh$]).pipe(
    switchMap(([id]) => this.reviewService.getCourseReviews(id)),
    shareReplay(1)
  );

  activeTab: 'overview' | 'resources' | 'quiz' | 'discussion' | 'reviews' = 'overview';
  activeModuleIndex = 0;
  activeLessonIndex = 0;
  currentSections: Section[] = [];
  currentProgress: CourseProgress | null = null;

  // Quiz state
  selectedAnswers: number[] = [];
  quizResult: QuizResult | null = null;
  isSubmittingQuiz = false;

  // Discussion state
  newThreadTitle = '';
  newThreadContent = '';
  isCreatingThread = false;

  // Review state
  newReviewRating = 5;
  newReviewComment = '';
  isSubmittingReview = false;

  // Certificate state
  isClaimingCertificate = false;
  isDownloadingCertificate = false;

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get currentLesson() {
    if (this.currentSections.length > 0 && 
        this.currentSections[this.activeModuleIndex] && 
        this.currentSections[this.activeModuleIndex].lessons) {
      const sortedLessons = [...this.currentSections[this.activeModuleIndex].lessons].sort((a,b) => a.order - b.order);
      return sortedLessons[this.activeLessonIndex];
    }
    return null;
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.currentProgress?.completedLessons.some(l => l.lessonId === lessonId && l.isCompleted) ?? false;
  }

  get overallProgress(): number {
    if (!this.currentSections.length) return 0;
    const totalLessons = this.currentSections.reduce((acc, s) => acc + s.lessons.length, 0);
    if (totalLessons === 0) return 0;
    
    const completedCount = this.currentProgress?.completedLessons.filter(l => l.isCompleted).length ?? 0;
    return Math.round((completedCount / totalLessons) * 100);
  }

  markAsComplete() {
    const lesson = this.currentLesson;
    const courseId = this.route.snapshot.params['courseId'];
    if (!lesson || !courseId) return;

    this.progressService.markComplete({
      courseId,
      lessonId: lesson.id,
      isCompleted: true
    }).subscribe(() => {
      this.progressRefresh$.next();
    });
  }

  claimCertificate(course: any) {
    const user = this.authService.currentUser();
    if (!user || !user.id || !course) return;

    this.isClaimingCertificate = true;
    this.certificateService.issueCertificate({
      studentId: user.id,
      courseId: course.id,
      studentName: user.name,
      courseTitle: course.title
    }).subscribe({
      next: (cert) => {
        this.isClaimingCertificate = false;
        this.downloadCertificate(cert.id, cert.certificateNumber);
      },
      error: () => this.isClaimingCertificate = false
    });
  }

  downloadCertificate(id: string, number: string) {
    this.isDownloadingCertificate = true;
    this.certificateService.downloadCertificate(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificate-${number}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isDownloadingCertificate = false;
      },
      error: () => this.isDownloadingCertificate = false
    });
  }

  getSafeUrl(url: string | undefined): SafeResourceUrl | null {
    if (!url) return null;
    let finalUrl = url;
    
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      finalUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      finalUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  selectLesson(modIdx: number, lesIdx: number) {
    this.activeModuleIndex = modIdx;
    this.activeLessonIndex = lesIdx;
    this.activeTab = 'overview';
  }

  nextLesson() {
    if (!this.currentSections.length) return;
    
    const currentModule = this.currentSections[this.activeModuleIndex];
    if (this.activeLessonIndex < currentModule.lessons.length - 1) {
      this.activeLessonIndex++;
    } else if (this.activeModuleIndex < this.currentSections.length - 1) {
      this.activeModuleIndex++;
      this.activeLessonIndex = 0;
    }
    this.activeTab = 'overview';
  }

  previousLesson() {
    if (!this.currentSections.length) return;

    if (this.activeLessonIndex > 0) {
      this.activeLessonIndex--;
    } else if (this.activeModuleIndex > 0) {
      this.activeModuleIndex--;
      this.activeLessonIndex = this.currentSections[this.activeModuleIndex].lessons.length - 1;
    }
    this.activeTab = 'overview';
  }

  setTab(tab: 'overview' | 'resources' | 'quiz' | 'discussion' | 'reviews') {
    this.activeTab = tab;
  }

  submitQuiz(quizId: string) {
    this.isSubmittingQuiz = true;
    this.assessmentService.submitQuiz({
      quizId,
      answers: this.selectedAnswers
    }).subscribe(result => {
      this.quizResult = result;
      this.isSubmittingQuiz = false;
    });
  }

  resetQuiz() {
    this.selectedAnswers = [];
    this.quizResult = null;
  }

  createThread(courseId: string) {
    if (!this.newThreadTitle || !this.newThreadContent) return;
    this.isCreatingThread = true;
    this.discussionService.createThread({
      courseId,
      title: this.newThreadTitle,
      content: this.newThreadContent
    }).subscribe(() => {
      this.newThreadTitle = '';
      this.newThreadContent = '';
      this.isCreatingThread = false;
      // Re-fetch threads
      this.threads$ = this.discussionService.getThreadsByCourseId(courseId);
    });
  }

  submitReview(courseId: string) {
    if (!this.newReviewComment) return;
    this.isSubmittingReview = true;
    this.reviewService.createReview({
      courseId,
      rating: this.newReviewRating,
      comment: this.newReviewComment
    }).subscribe({
      next: () => {
        this.newReviewComment = '';
        this.newReviewRating = 5;
        this.isSubmittingReview = false;
        this.reviewRefresh$.next();
      },
      error: () => {
        this.isSubmittingReview = false;
      }
    });
  }
}
