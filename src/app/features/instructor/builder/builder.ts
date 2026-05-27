import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LucideAngularModule, ChevronLeft, ChevronRight, Save, Plus, Trash2, Upload, FileVideo, FileText, Image as ImageIcon, Loader2, CheckCircle2, BookOpen, GripVertical } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { ContentService } from '../../../core/services/content';
import { MediaService } from '../../../core/services/media';
import { CategoryService } from '../../../core/services/category';
import { AssessmentService } from '../../../core/services/assessment';
import { ToastService } from '../../../core/services/toast';
import { Lesson, Section } from '../../../core/models/content.models';
import { Category } from '../../../core/models/category.models';
import { Quiz, Question } from '../../../core/models/assessment.models';

@Component({
  selector: 'app-course-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './builder.html'
})
export class CourseBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private contentService = inject(ContentService);
  private mediaService = inject(MediaService);
  private categoryService = inject(CategoryService);
  private assessmentService = inject(AssessmentService);
  private toastService = inject(ToastService);

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Save = Save;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Upload = Upload;
  readonly FileVideo = FileVideo;
  readonly FileText = FileText;
  readonly ImageIcon = ImageIcon;
  readonly Loader2 = Loader2;
  readonly CheckCircle2 = CheckCircle2;
  readonly BookOpen = BookOpen;
  readonly GripVertical = GripVertical;

  currentStep = 1;
  courseId: string | null = null;
  isEditMode = false;
  isSaving = false;
  isUploading = false;
  errorMessage: string | null = null;
  showCategoryModal = false;
  newCategory = { name: '', description: '' };
  isCreatingCategory = false;

  courseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    categoryId: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    thumbnailUrl: ['']
  });

  sections: Section[] = [];
  categories: Category[] = [];
  
  // Quiz management
  quiz: Quiz | null = null;
  isCreatingQuiz = false;

  ngOnInit() {
    this.loadCategories();
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEditMode = true;
      this.loadCourseData();
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      if (this.categories.length > 0 && !this.isEditMode) {
        this.courseForm.patchValue({ categoryId: this.categories[0].id });
      }
    });
  }

  loadCourseData() {
    if (!this.courseId) return;
    this.courseService.getCourseById(this.courseId).subscribe(course => {
      if (course) {
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          price: course.price,
          thumbnailUrl: course.thumbnailUrl,
        });
      }
    });

    this.contentService.getSectionsByCourseId(this.courseId).subscribe(sections => {
      this.sections = (sections || []).map(s => ({
        ...s,
        lessons: s.lessons || []
      })).sort((a, b) => a.order - b.order);
    });

    this.assessmentService.getQuizByCourseId(this.courseId).subscribe(quiz => {
      this.quiz = quiz;
    });
  }

  nextStep() {
    if (this.currentStep === 1 && this.courseForm.invalid) return;
    this.currentStep++;
    this.errorMessage = null;
  }

  prevStep() {
    this.currentStep--;
    this.errorMessage = null;
  }

  saveCourse() {
    if (this.courseForm.invalid) return;
    this.isSaving = true;
    this.errorMessage = null;

    const courseData = this.courseForm.value;

    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, courseData).subscribe({
        next: () => {
          this.isSaving = false;
          if (this.currentStep === 1) {
            this.nextStep();
          }
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = 'Failed to update course. Please check your data and try again.';
          console.error('Update course error:', err);
        }
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: (createdCourse) => {
          this.courseId = createdCourse.id;
          this.isEditMode = true;
          this.isSaving = false;
          this.nextStep();
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = 'Failed to create course. Ensure all fields are valid.';
          console.error('Create course error:', err);
        }
      });
    }
  }

  onThumbnailUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploading = true;
    this.mediaService.upload(file).subscribe({
      next: (res) => {
        this.courseForm.patchValue({ thumbnailUrl: res.url });
        this.isUploading = false;
      },
      error: () => this.isUploading = false
    });
  }

  // --- Curriculum Actions ---

  addSection() {
    if (!this.courseId) {
      this.toastService.error('Course ID is missing. Please save course details first.');
      return;
    }
    const newSection: Partial<Section> = {
      courseId: this.courseId,
      title: 'New Module',
      order: this.sections.length + 1
    };

    this.contentService.createSection(newSection).subscribe({
      next: (section) => {
        this.sections = [...this.sections, { ...section, lessons: [] }];
        this.toastService.success('Module added successfully');
      },
      error: (err) => {
        console.error('Failed to create section', err);
        this.toastService.error('Failed to create module. Backend service may be offline.');
      }
    });
  }

  updateSection(section: Section) {
    this.contentService.updateSection(section.id, section).subscribe({
      next: () => this.toastService.info('Module title updated'),
      error: () => this.toastService.error('Failed to update module title')
    });
  }

  deleteSection(sectionId: string) {
    if (!confirm('Are you sure you want to delete this module and all its lessons?')) return;
    this.contentService.deleteSection(sectionId).subscribe({
      next: () => {
        this.sections = this.sections.filter(s => s.id !== sectionId);
        this.toastService.success('Module deleted');
      },
      error: () => this.toastService.error('Failed to delete module')
    });
  }

  addLesson(section: Section) {
    if (!this.courseId) return;
    const newLesson: Partial<Lesson> = {
      courseId: this.courseId,
      sectionId: section.id,
      title: 'New Lesson',
      description: 'Lesson description',
      contentType: 'Video',
      order: section.lessons.length + 1,
      contentUrl: ''
    };

    this.contentService.createLesson(newLesson).subscribe({
      next: (lesson) => {
        section.lessons = [...section.lessons, lesson];
        this.toastService.success('Lesson added successfully');
      },
      error: () => this.toastService.error('Failed to add lesson')
    });
  }

  updateLesson(lesson: Lesson) {
    this.contentService.updateLesson(lesson.id, lesson).subscribe({
      next: () => this.toastService.info('Lesson updated'),
      error: () => this.toastService.error('Failed to update lesson')
    });
  }

  deleteLesson(section: Section, lessonId: string) {
    this.contentService.deleteLesson(lessonId).subscribe({
      next: () => {
        section.lessons = section.lessons.filter(l => l.id !== lessonId);
        this.toastService.success('Lesson deleted');
      },
      error: () => this.toastService.error('Failed to delete lesson')
    });
  }

  onLessonFileUpload(event: any, lesson: Lesson) {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploading = true;
    this.mediaService.upload(file).subscribe({
      next: (res) => {
        lesson.contentUrl = res.url;
        this.updateLesson(lesson);
        this.isUploading = false;
      },
      error: () => this.isUploading = false
    });
  }

  // --- Quiz Actions ---

  createQuiz() {
    if (!this.courseId) return;
    this.isCreatingQuiz = true;
    this.assessmentService.createQuiz({
      courseId: this.courseId,
      title: 'Course Final Quiz',
      description: 'Test your understanding of the course material.',
      passingScore: 70
    }).subscribe(quiz => {
      this.quiz = quiz;
      this.isCreatingQuiz = false;
    });
  }

  addQuestion() {
    if (!this.quiz) return;
    const newQuestion = {
      text: 'New Question',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctOptionIndex: 0
    };

    this.assessmentService.addQuestion(this.quiz.id, newQuestion).subscribe(() => {
      // Re-fetch quiz to get updated questions list
      if (this.quiz) {
        this.assessmentService.getQuizById(this.quiz.id).subscribe(updated => {
          this.quiz = updated;
        });
      }
    });
  }

  updateQuestion(question: Question) {
    this.assessmentService.updateQuestion(question.id, {
      text: question.text,
      options: question.options,
      correctOptionIndex: question.correctOptionIndex
    }).subscribe();
  }

  deleteQuestion(questionId: string) {
    this.assessmentService.deleteQuestion(questionId).subscribe(() => {
      if (this.quiz) {
        this.quiz.questions = this.quiz.questions.filter(q => q.id !== questionId);
      }
    });
  }

  updateQuizInfo() {
    if (!this.quiz) return;
    this.assessmentService.updateQuiz(this.quiz.id, {
      title: this.quiz.title,
      description: this.quiz.description,
      passingScore: this.quiz.passingScore
    }).subscribe();
  }

  createCategory() {
    if (!this.newCategory.name) return;
    this.isCreatingCategory = true;
    this.categoryService.createCategory(this.newCategory.name, this.newCategory.description).subscribe({
      next: (category) => {
        this.categories.push(category);
        this.courseForm.patchValue({ categoryId: category.id });
        this.showCategoryModal = false;
        this.newCategory = { name: '', description: '' };
        this.isCreatingCategory = false;
      },
      error: (err) => {
        this.isCreatingCategory = false;
        console.error('Failed to create category', err);
      }
    });
  }
}
