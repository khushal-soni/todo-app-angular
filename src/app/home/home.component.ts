import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  THEMES: string[] = ['light', 'dark'];
  TODO_STATUS: string[] = ['pending', 'complete', 'deleted'];
  htmlElement!: HTMLElement;
  heroImg!: HTMLElement;
  themeToggleBtn!: HTMLButtonElement;
  themeToggleIcon!: HTMLImageElement;
  todoForm!: HTMLFormElement;
  todoItems!: HTMLElement;
  todoListContainer!: HTMLElement;
  listFilter: string | 'pending' | 'complete' | 'all' = 'all';

  todos: Todo[] = [{
    id: '1',
    text: 'Hello world',
    status: 'complete',
  }, {
    id: '2',
    text: 'Hello Universe',
    status: 'pending',
  }, {
    id: '3',
    text: 'Deleted Todo',
    status: 'deleted',
  }];
  
  filteredTodos!: Todo[];

  addTodoForm!: FormGroup;

  constructor (private formBuilder: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    // * --------------------------------------
    // * ELEMENTS
    // * --------------------------------------
    this.htmlElement = document.documentElement;
    this.heroImg = document.querySelector('.hero') as HTMLElement;
    this.themeToggleBtn = document.querySelector('.btn-theme-toggle') as HTMLButtonElement;
    this.themeToggleIcon = this.themeToggleBtn?.firstElementChild as HTMLImageElement;
    this.todoForm = document.querySelector('.todo-form') as HTMLFormElement;
    this.todoItems = document.querySelector('.todo-items') as HTMLElement;
    this.todoListContainer = document.querySelector('.todo-list-container') as HTMLElement;

    this.loadTheme();
    
    this.filteredTodos = this.todos.filter(todo => todo.status !== this.TODO_STATUS[2]);
  }

  loadTheme() {
    const theme = localStorage.getItem('theme') || this.THEMES[0];

    if (theme === this.THEMES[0]) {
      this.htmlElement.removeAttribute('data-theme');
      this.heroImg?.classList?.remove('hero-dark');
      this.heroImg?.classList?.add('hero-light');

      this.themeToggleIcon.src = 'assets/icon-moon.svg';
    } else {
      this.htmlElement.setAttribute('data-theme', 'dark');
      this.heroImg?.classList?.remove('hero-light');
      this.heroImg?.classList?.add('hero-dark');

    }
    this.themeToggleIcon.src = 'assets/icon-sun.svg';
  }

  setLightTheme(): void {
    document.documentElement.removeAttribute('data-theme');
    this.heroImg.classList.remove('hero-dark');
    this.heroImg.classList.add('hero-light');
    this.updateThemeToggleIcon('assets/icon-moon.svg');
  }

  setDarkTheme(): void {
    document.documentElement.setAttribute('data-theme', 'dark');
    this.heroImg.classList.remove('hero-light');
    this.heroImg.classList.add('hero-dark');
    this.updateThemeToggleIcon('assets/icon-sun.svg');
  }

  updateThemeToggleIcon(src: string): void {
    const icon = this.themeToggleBtn.firstElementChild as HTMLImageElement;
    if (icon) {
      icon.src = src;
    }
  }

  toggleTheme() {
    const theme = localStorage.getItem('theme');

    if (theme === this.THEMES[0]) {
      this.htmlElement.setAttribute('data-theme', this.THEMES[1]);
      this.heroImg.classList.remove('hero-light');
      this.heroImg.classList.add('hero-dark');

      this.themeToggleIcon.src = 'assets/icon-moon.svg';
      localStorage.setItem('theme', this.THEMES[1]);
    } else {
      this.htmlElement.removeAttribute('data-theme');
      this.heroImg.classList.remove('hero-dark');
      this.heroImg.classList.add('hero-light');

      this.themeToggleIcon.src = 'assets/icon-sun.svg';
      localStorage.setItem('theme', this.THEMES[0]);
    }
  }

  initForm () {
    this.addTodoForm = this.formBuilder.group({
      text: '',
      status: 'pending',
    });
  }

  addTodo(): void {
    const newTodo: Todo = { 
      id: this.generateId(), 
      ...this.addTodoForm.value 
    };
    this.todos.push(newTodo);
    this.updateFilteredTodos();
  }

  updateFilteredTodos(): void {
    if (this.listFilter === 'all') {
      this.filteredTodos = this.todos.filter(todo => todo.status !== this.TODO_STATUS[2]);
    } else {
      this.filteredTodos = this.todos.filter(todo => todo.status === this.listFilter);
    }
  }

  generateId(): string {
    return 'id' + Math.random().toString(16).slice(2);
  }
  
  onCheckboxChange(todo: Todo, $event: Event) {
    const todoExists = this.todos.find((t) => t.id === todo.id);
    
    if (!todoExists) {
      throw new Error('todo not found');
    }

    if (todo.status === this.TODO_STATUS[0]) {
      todoExists.status = this.TODO_STATUS[1];
    } else {
      todoExists.status = this.TODO_STATUS[0];
    }

    this.updateFilteredTodos();
  }
  
  deleteTodo(todo: Todo, $event: Event) {
    const todoExists = this.todos.find((t) => t.id === todo.id);
    
    if (todoExists) {
      todoExists.status = this.TODO_STATUS[2];
    }

    this.updateFilteredTodos();
  }

  clearAllTodos(): void {
    this.todos = [];
    this.updateFilteredTodos();
  }

  clearCompletedTodos(): void {
    this.todos = this.todos.filter(todo => todo.status !== this.TODO_STATUS[1]);
    this.updateFilteredTodos();
  }

  filterTodos(status: string): void {
    this.listFilter = status;

    if (status === 'all') {
      this.updateFilteredTodos();
    } else {
      this.filteredTodos = this.todos.filter(todo => todo.status === status);
    }
  }
}
