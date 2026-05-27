export interface Review {
  id: string;
  studentId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CourseRating {
  courseId: string;
  averageRating: number;
  totalReviews: number;
}

export interface CreateReviewRequest {
  courseId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}
