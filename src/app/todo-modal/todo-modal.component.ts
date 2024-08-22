import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../todo';


@Component({
  selector: 'app-todo-modal',
  templateUrl: './todo-modal.component.html',
  styleUrls: ['./todo-modal.component.scss']
})
export class TodoModalComponent {
  @Input() todo!: Todo;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
