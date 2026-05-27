export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface CourseProgress {
  courseId: string;
  completionPercentage: number;
  completedLessons: LessonProgress[];
}

export interface ProgressRequest {
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
}
