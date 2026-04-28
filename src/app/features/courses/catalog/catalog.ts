import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-angular';
import { CourseService } from '../../../core/services/course';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card';
import { BehaviorSubject, combineLatest, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CourseCardComponent],
  templateUrl: './catalog.html'
})
export class CatalogComponent {
  private courseService = inject(CourseService);

  readonly Search = Search;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly ChevronDown = ChevronDown;
  readonly Loader2 = Loader2;

  private categorySubject = new BehaviorSubject<string>('All');
  private searchSubject = new BehaviorSubject<string>('');

  categories = ['All', 'Development', 'Design', 'Marketing', 'Business', 'Data Science'];
  selectedCategory = 'All';
  searchQuery = '';

  allCourses$ = this.courseService.getCourses().pipe(
    shareReplay(1)
  );

  filteredCourses$ = combineLatest([
    this.allCourses$,
    this.categorySubject,
    this.searchSubject
  ]).pipe(
    map(([courses, category, search]) => {
      return courses.filter(course => {
        const matchesCategory = category === 'All' || course.category === category;
        const matchesSearch = !search || 
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.description.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    })
  );

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.categorySubject.next(category);
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }
}
