import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  show = false;
  message = '';
  toastClass = '';

  showToast(message: string, type: 'success' | 'error') {
    this.message = message;
    this.toastClass = type;
    this.show = true;
    setTimeout(() => this.show = false, 5000);
  }
}
