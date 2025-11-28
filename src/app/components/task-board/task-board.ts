import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { RefreshService } from '../../services/refresh.service';

@Component({
  selector: 'app-task-board',
  imports: [CommonModule],
  templateUrl: './task-board.html',
  styleUrl: './task-board.scss',
  standalone: true
})
export class TaskBoardComponent implements OnChanges, OnInit, OnDestroy {
  @Input() projectId: number | null = null;
  @Output() createTask = new EventEmitter<void>();

  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  TaskStatus = TaskStatus;

  private refreshSubscription?: Subscription;

  constructor(
    private taskService: TaskService,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    // Subscribe to refresh events
    this.refreshSubscription = this.refreshService.taskRefresh$.subscribe(() => {
      if (this.projectId) {
        this.loadTasks();
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] && this.projectId) {
      this.loadTasks();
    } else if (!this.projectId) {
      this.tasks = [];
      this.updateTaskColumns();
    }
  }

  loadTasks(): void {
    if (this.projectId) {
      this.taskService.getTasksByProjectId(this.projectId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.updateTaskColumns();
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
        }
      });
    }
  }

  updateTaskColumns(): void {
    this.todoTasks = this.tasks.filter(task => task.status === TaskStatus.TODO);
    this.inProgressTasks = this.tasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
    this.doneTasks = this.tasks.filter(task => task.status === TaskStatus.DONE);
  }

  onCreateTask(): void {
    this.createTask.emit();
  }

  deleteTask(taskId: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  changeTaskStatus(task: Task, newStatus: TaskStatus): void {
    const updatedTask = { ...task, status: newStatus };
    this.taskService.updateTask(task.id!, updatedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }
}
