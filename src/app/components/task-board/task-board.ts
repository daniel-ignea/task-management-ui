import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { RefreshService } from '../../services/refresh.service';

@Component({
  selector: 'app-task-board',
  imports: [CommonModule, CdkDrag, CdkDropList],
  templateUrl: './task-board.html',
  styleUrl: './task-board.scss',
  standalone: true
})
export class TaskBoardComponent implements OnChanges, OnInit, OnDestroy {
  private _projectId: number | null = null;

  @Input()
  set projectId(value: number | null) {
    console.log('projectId setter called - old value:', this._projectId, 'new value:', value);
    const oldValue = this._projectId;
    this._projectId = value;

    // Only load tasks if the value actually changed and is not null/undefined
    if (oldValue !== value && value !== null && value !== undefined) {
      console.log('projectId changed, loading tasks for:', value);
      this.loadTasks();
    } else if (value === null || value === undefined) {
      console.log('projectId is null/undefined, clearing tasks');
      this.tasks = [];
      this.updateTaskColumns();
    }
  }

  get projectId(): number | null {
    return this._projectId;
  }

  @Output() createTask = new EventEmitter<void>();

  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  TaskStatus = TaskStatus;

  private refreshSubscription?: Subscription;

  constructor(
    private taskService: TaskService,
    private refreshService: RefreshService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('TaskBoard ngOnInit - projectId:', this.projectId);

    // Subscribe to refresh events
    this.refreshSubscription = this.refreshService.taskRefresh$.subscribe(() => {
      if (this.projectId !== null && this.projectId !== undefined) {
        this.loadTasks();
      }
    });

    // No need to load tasks here - the setter already handled it
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('TaskBoard ngOnChanges:', changes);
    // The setter handles the logic now, but we keep this for logging
  }

  loadTasks(): void {
    if (this.projectId) {
      this.taskService.getTasksByProjectId(this.projectId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.updateTaskColumns();
          // Trigger change detection to ensure the view updates
          this.cdr.detectChanges();
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

  onDrop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving to a different column
      const task = event.previousContainer.data[event.previousIndex];

      // Transfer the item between arrays
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update task status in the backend
      const updatedTask = { ...task, status: targetStatus };
      this.taskService.updateTask(task.id!, updatedTask).subscribe({
        next: () => {
          console.log('Task status updated successfully');
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          // Revert the change on error
          this.loadTasks();
        }
      });
    }
  }
}
