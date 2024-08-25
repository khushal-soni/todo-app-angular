import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../todo';
import { GuestService } from '../auth/guest.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private guestService: GuestService,
  ) { }

  getTodos(status: 'complete' | 'pending' | 'all'): Observable<Todo[]> {
    const guestId = this.guestService.getGuestId();
    let params = new HttpParams();

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Todo[]>(`${this.apiUrl}/todos?userId=${guestId}`, { params });
  }

  addTodo(todo: Todo): Observable<Todo> {
    const guestId = this.guestService.getGuestId();
    return this.http.post<Todo>(`${this.apiUrl}/todos?userId=${guestId}`, {
      userId: guestId,
      ...todo,
    });
  }

  updateTodo(todo: Todo): Observable<Todo> {
    const guestId = this.guestService.getGuestId();
    return this.http.patch<Todo>(`${this.apiUrl}/todos/${todo.id}?userId=${guestId}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    const guestId = this.guestService.getGuestId();
    return this.http.delete<void>(`${this.apiUrl}/todos/${id}?userId=${guestId}`);
  }

  deleteCompletedTodos(): Observable<void> {
    const guestId = this.guestService.getGuestId();
    return this.http.delete<void>(`${this.apiUrl}/todos/complete?userId=${guestId}`);
  }
}
