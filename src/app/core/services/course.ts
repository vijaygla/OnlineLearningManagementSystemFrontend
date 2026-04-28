import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Course } from '../models/course.models';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  getCourses(): Observable<Course[]> {
    console.log(`Fetching courses from: ${this.apiUrl}`);
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(data => console.log('Raw data from API:', data)),
      map(courses => courses.map(c => this.mapToCourse(c))),
      catchError(err => {
        console.error('Error fetching courses:', err);
        return of([]); // Return empty array on error to stop spinner
      })
    );
  }

  getCourseById(id: string): Observable<Course | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(c => this.mapToCourse(c)),
      catchError(err => {
        console.error(`Error fetching course ${id}:`, err);
        return of(undefined);
      })
    );
  }

  private mapToCourse(apiCourse: any): Course {
    // Basic mapping from backend fields
    // We use placeholders for fields not currently returned by the Course entity
    
    const placeholderImages = [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800',
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
      'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800'
    ];
    const imageIndex = Math.abs(this.hashCode(apiCourse.id)) % placeholderImages.length;

    // Simple category mapping based on known IDs if possible, or fallback
    let categoryName = 'General';
    if (apiCourse.title.toLowerCase().includes('java') || apiCourse.title.toLowerCase().includes('programming')) {
      categoryName = 'Development';
    } else if (apiCourse.title.toLowerCase().includes('learning')) {
      categoryName = 'Data Science';
    }

    return {
      id: apiCourse.id,
      title: apiCourse.title,
      description: apiCourse.description,
      instructorName: apiCourse.instructorName || 'Expert Instructor',
      price: apiCourse.price,
      rating: 4.5 + (Math.random() * 0.4), // Pseudo-random for visual polish
      reviewCount: Math.floor(Math.random() * 500) + 50,
      thumbnailUrl: apiCourse.thumbnailUrl || placeholderImages[imageIndex],
      category: categoryName,
      level: 'Intermediate',
      duration: '12h 45m',
      lessonCount: 15
    };
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
