import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';
import { Review, CreateReviewDto } from '../models/review.models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private mockReviews: Review[] = [
    {
      id: '1',
      studentId: 'u1',
      studentName: 'John Doe',
      courseId: '1',
      rating: 5,
      comment: 'Excellent course! Everything was explained very clearly.',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      studentId: 'u2',
      studentName: 'Jane Smith',
      courseId: '1',
      rating: 4,
      comment: 'Good content, but some sections were a bit fast.',
      createdAt: new Date().toISOString()
    }
  ];

  getReviewsByCourseId(courseId: string) {
    return of(this.mockReviews.filter(r => r.courseId === courseId)).pipe(delay(500));
  }

  addReview(review: CreateReviewDto) {
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: 'current-user',
      studentName: 'Current User',
      ...review,
      createdAt: new Date().toISOString()
    };
    this.mockReviews.unshift(newReview);
    return of(newReview).pipe(delay(500));
  }
}
