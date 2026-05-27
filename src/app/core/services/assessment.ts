import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Quiz, QuizSubmission, QuizResult } from '../models/assessment.models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/assessments`;

  getQuizByCourseId(courseId: string): Observable<Quiz | null> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/course/${courseId}`).pipe(
      map(quizzes => quizzes.length > 0 ? quizzes[0] : null)
    );
  }

  getQuizById(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  createQuiz(data: any): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, data);
  }

  updateQuiz(id: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addQuestion(quizId: string, data: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${quizId}/questions`, data);
  }

  updateQuestion(questionId: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/questions/${questionId}`, data);
  }

  deleteQuestion(questionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${questionId}`);
  }

  submitQuiz(submission: QuizSubmission): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.apiUrl}/${submission.quizId}/submit`, { 
      answers: submission.answers 
    });
  }

  getMySubmissions(): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${this.apiUrl}/my-submissions`);
  }
}
