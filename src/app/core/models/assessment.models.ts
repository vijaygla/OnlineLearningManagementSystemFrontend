export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  passingScore: number;
  questions: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface QuizSubmission {
  quizId: string;
  studentId?: string;
  answers: number[];
}

export interface QuizResult {
  submissionId: string;
  score: number;
  isPassed: boolean;
  totalQuestions: number;
  submittedAt?: string;
}
