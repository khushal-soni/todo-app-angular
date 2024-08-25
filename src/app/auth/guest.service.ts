import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private readonly localStorageKey = 'guest_user_id';

  constructor() {
    this.ensureGuestId();
  }

  private ensureGuestId(): void {
    if (!localStorage.getItem(this.localStorageKey)) {
      localStorage.setItem(this.localStorageKey, uuidv4());
    }
  }

  getGuestId(): string {
    return localStorage.getItem(this.localStorageKey) || '';
  }
}
