import { Component, OnInit, ViewChild } from '@angular/core';
import { Todo } from '../todo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastComponent } from '../toast/toast.component';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;

  THEMES: string[] = ['light', 'dark'];
  TODO_STATUS: string[] = ['pending', 'complete', 'deleted'];
  htmlElement!: HTMLElement;
  heroImg!: HTMLElement;
  themeToggleBtn!: HTMLButtonElement;
  themeToggleIcon!: HTMLImageElement;
  todoForm!: HTMLFormElement;
  todoItems!: HTMLElement;
  todoListContainer!: HTMLElement;
  listFilter: 'pending' | 'complete' | 'all' = 'all';
  selectedTodo: Todo | null = null;

  todos: Todo[] = [];

  addTodoForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private homeService: HomeService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // * --------------------------------------
    // * ELEMENTS
    // * --------------------------------------
    this.htmlElement = document.documentElement;
    this.heroImg = document.querySelector('.hero') as HTMLElement;
    this.themeToggleBtn = document.querySelector(
      '.btn-theme-toggle'
    ) as HTMLButtonElement;
    this.themeToggleIcon = this.themeToggleBtn
      ?.firstElementChild as HTMLImageElement;
    this.todoForm = document.querySelector('.todo-form') as HTMLFormElement;
    this.todoItems = document.querySelector('.todo-items') as HTMLElement;
    this.todoListContainer = document.querySelector(
      '.todo-list-container'
    ) as HTMLElement;

    this.loadTheme();

    // this.filteredTodos = this.todos.filter(todo => todo.status !== this.TODO_STATUS[2]);
    this.loadTodos();
  }

  loadTheme() {
    const theme = localStorage.getItem('theme') || this.THEMES[0];

    if (theme === this.THEMES[0]) {
      this.htmlElement.removeAttribute('data-theme');
      this.heroImg?.classList?.remove('hero-dark');
      this.heroImg?.classList?.add('hero-light');

      this.themeToggleIcon.src = 'assets/icon-moon.svg';
      localStorage.setItem('theme', this.THEMES[0]);
    } else {
      this.htmlElement.setAttribute('data-theme', 'dark');
      this.heroImg?.classList?.remove('hero-light');
      this.heroImg?.classList?.add('hero-dark');
      localStorage.setItem('theme', this.THEMES[1]);
      this.themeToggleIcon.src = 'assets/icon-sun.svg';
    }
  }

  toggleTheme() {
    const theme = localStorage.getItem('theme');

    if (theme === this.THEMES[0]) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  setLightTheme(): void {
    document.documentElement.removeAttribute('data-theme');
    this.heroImg.classList.remove('hero-dark');
    this.heroImg.classList.add('hero-light');
    this.updateThemeToggleIcon('assets/icon-moon.svg');
    localStorage.setItem('theme', this.THEMES[0]);
  }

  setDarkTheme(): void {
    document.documentElement.setAttribute('data-theme', 'dark');
    this.heroImg.classList.remove('hero-light');
    this.heroImg.classList.add('hero-dark');
    this.updateThemeToggleIcon('assets/icon-sun.svg');
    localStorage.setItem('theme', this.THEMES[1]);
  }

  updateThemeToggleIcon(src: string): void {
    if (this.themeToggleIcon) {
      this.themeToggleIcon.src = src;
    }
  }

  initForm() {
    this.addTodoForm = this.formBuilder.group({
      text: ['', Validators.required],
      status: 'pending',
    });
  }

  onCheckboxChange(todo: Todo, $event: Event) {
    let newStatus: any;
    let toastMessageSuccess: string;
    if (todo.status === this.TODO_STATUS[0]) {
      newStatus = this.TODO_STATUS[1];
      toastMessageSuccess = `Todo marked as complete!`;
    } else {
      newStatus = this.TODO_STATUS[0];
      toastMessageSuccess = `Todo marked as pending!`;
    }

    todo.status = newStatus;
    this.homeService.updateTodo(todo).subscribe({
      next: (result) => {
        this.loadTodos(this.listFilter);
        this.toast.showToast(toastMessageSuccess, 'success');
      },
      error: (error) => {
        console.error(`Error while updating todo`, error);
        this.toast.showToast(`Something went wrong`, 'error');
      }
    })
  }

  deleteTodo(todo: Todo, $event: Event) {
    this.homeService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.loadTodos();
        this.toast.showToast('Todo deleted successfully!', 'success');
      },
      error: (error) => {
        console.error('Error while deleting todo: ', error);
        this.toast.showToast('Something went wrong!', 'error');
      }
    })
  }

  clearAllTodos(): void {
    this.todos = [];
  }

  clearCompletedTodos(): void {
    this.homeService.deleteCompletedTodos().subscribe({
      next: () => {
        this.loadTodos();
        this.toast.showToast('Completed todos deleted!', 'success');
      },
      error: (error) => {
        console.error('Error while deleting completed todo: ', error);
        this.toast.showToast('Something went wrong!', 'error');
      }
    })
  }

  openTodoModal(todo: Todo) {
    this.selectedTodo = todo;
  }

  closeTodoModal() {
    this.selectedTodo = null;
  }

  loadTodos(status: 'complete' | 'pending' | 'all' = 'all'): void {
    this.homeService.getTodos(status).subscribe({
      next: (todos) => {
        this.todos = todos;
        this.listFilter = status;
      },
      error: (error) => {
        console.error(`Error fetching todos: `, error);
        this.toast.showToast(`Error fetching todos`, 'error');
      },
    });
  }

  addTodoHttp(): void {
    if (this.addTodoForm.invalid) return;
    if (!this.addTodoForm.get('text')?.value.trim().length) return;

    const newTodo: Todo = {
      ...this.addTodoForm.value,
    };

    this.homeService.addTodo(newTodo).subscribe({
      next: (todo) => {
        this.loadTodos();
        this.toast.showToast('Todo added successfully!', 'success');
        this.addTodoForm.reset();
      },
      error: (error) => {
        console.error(`Error adding todo: `, error);
        this.toast.showToast(`Something went wrong.`, 'error');
      }
    });
  }
}
