import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(users => console.log('Raw users from Identity API:', users)),
      map((users: any[]) => users.map((u: any) => ({
        id: u.id || u.Id,
        name: u.name || u.Name,
        email: u.email || u.Email,
        role: u.role || u.Role
      }))),
      catchError(err => {
        console.error('Error fetching users:', err);
        return of([]);
      })
    );
  }

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`).pipe(
      catchError(err => {
        console.error('Error fetching user count:', err);
        return of(0);
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
