import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronLeft, ChevronRight, Play, CheckCircle2, MessageSquare, FileText, HelpCircle, Trophy, Loader2, Send, User } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { AssessmentService } from '../../../core/services/assessment';
import { DiscussionService } from '../../../core/services/discussion';
import { map, switchMap, shareReplay } from 'rxjs';
import { QuizResult } from '../../../core/models/assessment.models';

@Component({
  selector: 'app-learning-player',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  templateUrl: './player.html'
})
export class LearningPlayerComponent {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private assessmentService = inject(AssessmentService);
  private discussionService = inject(DiscussionService);

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

  course$ = this.route.params.pipe(
    map(params => params['courseId']),
    switchMap(id => this.courseService.getCourseById(id)),
    shareReplay(1)
  );

  quiz$ = this.route.params.pipe(
    map(params => params['courseId']),
    switchMap(id => this.assessmentService.getQuizByCourseId(id))
  );

  threads$ = this.route.params.pipe(
    map(params => params['courseId']),
    switchMap(id => this.discussionService.getThreadsByCourseId(id))
  );

  activeTab: 'overview' | 'resources' | 'quiz' | 'discussion' = 'overview';
  activeModuleIndex = 0;
  activeLessonIndex = 0;

  // Quiz state
  selectedAnswers: number[] = [];
  quizResult: QuizResult | null = null;
  isSubmittingQuiz = false;

  // Discussion state
  newThreadTitle = '';
  newThreadContent = '';
  isCreatingThread = false;

  modules = [
    {
      title: 'Introduction',
      lessons: [
        { title: 'Welcome to the course', duration: '05:20', completed: true },
        { title: 'How to get help', duration: '03:45', completed: true },
        { title: 'Course Roadmap', duration: '10:15', completed: false }
      ]
    },
    {
      title: 'Environment Setup',
      lessons: [
        { title: 'Installing tools', duration: '15:20', completed: false },
        { title: 'Configuration basics', duration: '08:45', completed: false }
      ]
    },
    {
      title: 'Core Concepts',
      lessons: [
        { title: 'Variables and Data Types', duration: '25:10', completed: false },
        { title: 'Functions and Scope', duration: '35:20', completed: false },
        { title: 'Asynchronous Programming', duration: '45:00', completed: false }
      ]
    }
  ];

  get currentLesson() {
    return this.modules[this.activeModuleIndex].lessons[this.activeLessonIndex];
  }

  selectLesson(modIdx: number, lesIdx: number) {
    this.activeModuleIndex = modIdx;
    this.activeLessonIndex = lesIdx;
    this.activeTab = 'overview';
  }

  setTab(tab: 'overview' | 'resources' | 'quiz' | 'discussion') {
    this.activeTab = tab;
  }

  submitQuiz(quizId: string) {
    this.isSubmittingQuiz = true;
    this.assessmentService.submitQuiz({
      quizId,
      studentId: 'current-user',
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
}
