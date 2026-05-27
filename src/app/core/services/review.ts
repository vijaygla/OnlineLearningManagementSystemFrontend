import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Review, CourseRating, CreateReviewRequest, UpdateReviewRequest } from '../models/review.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  getCourseReviews(courseId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/course/${courseId}`);
  }

  getCourseRating(courseId: string): Observable<CourseRating> {
    return this.http.get<CourseRating>(`${this.apiUrl}/course/${courseId}/rating`);
  }

  createReview(request: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, request);
  }

  updateReview(id: string, request: UpdateReviewRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
