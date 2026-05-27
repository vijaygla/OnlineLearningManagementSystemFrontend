import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Lesson, Section } from '../models/content.models';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private http = inject(HttpClient);
  private lessonApiUrl = `${environment.apiUrl}/lessons`;
  private sectionApiUrl = `${environment.apiUrl}/sections`;

  // --- Section Operations ---

  getSectionsByCourseId(courseId: string): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.sectionApiUrl}/course/${courseId}`).pipe(
      catchError(err => {
        console.error(`Error fetching sections for course ${courseId}:`, err);
        return of([]);
      })
    );
  }

  createSection(section: Partial<Section>): Observable<Section> {
    return this.http.post<Section>(this.sectionApiUrl, section);
  }

  updateSection(id: string, section: Partial<Section>): Observable<void> {
    return this.http.put<void>(`${this.sectionApiUrl}/${id}`, section);
  }

  deleteSection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.sectionApiUrl}/${id}`);
  }

  // --- Lesson Operations ---

  getLessonsBySectionId(sectionId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.lessonApiUrl}/section/${sectionId}`).pipe(
      catchError(err => {
        console.error(`Error fetching lessons for section ${sectionId}:`, err);
        return of([]);
      })
    );
  }

  getLessonById(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.lessonApiUrl}/${id}`);
  }

  createLesson(lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.post<Lesson>(this.lessonApiUrl, lesson);
  }

  updateLesson(id: string, lesson: Partial<Lesson>): Observable<void> {
    return this.http.put<void>(`${this.lessonApiUrl}/${id}`, lesson);
  }

  deleteLesson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.lessonApiUrl}/${id}`);
  }
}
