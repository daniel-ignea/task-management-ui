import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
  standalone: true
})
export class TaskFormComponent {
  @Input() projectId!: number;
  @Output() taskCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  task: Task = {
    title: '',
    description: '',
    status: TaskStatus.TODO
  };

  TaskStatus = TaskStatus;
  statusOptions = [
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.DONE, label: 'Done' }
  ];

  constructor(private taskService: TaskService) {}

  onSubmit(): void {
    if (this.task.title.trim() && this.projectId) {
      this.taskService.createTask(this.projectId, this.task).subscribe({
        next: () => {
          this.taskCreated.emit();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  resetForm(): void {
    this.task = {
      title: '',
      description: '',
      status: TaskStatus.TODO
    };
  }
}
