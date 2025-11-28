import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './components/project-list/project-list';
import { TaskBoardComponent } from './components/task-board/task-board';
import { ProjectFormComponent } from './components/project-form/project-form';
import { TaskFormComponent } from './components/task-form/task-form';
import { RefreshService } from './services/refresh.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ProjectListComponent, TaskBoardComponent, ProjectFormComponent, TaskFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  title = 'Task Management';
  selectedProjectId: number | null = null;
  showProjectForm = false;
  showTaskForm = false;

  constructor(
    private refreshService: RefreshService,
    private cdr: ChangeDetectorRef
  ) {}

  onProjectSelected(projectId: number): void {
    if (projectId === 0) {
      this.selectedProjectId = null;
    } else {
      this.selectedProjectId = projectId;
    }
    // Manually trigger change detection to ensure the binding updates
    this.cdr.detectChanges();
  }

  onCreateProject(): void {
    this.showProjectForm = true;
  }

  onProjectCreated(): void {
    this.showProjectForm = false;
    // Trigger project list refresh via service
    this.refreshService.refreshProjects();
  }

  onCancelProjectForm(): void {
    this.showProjectForm = false;
  }

  onCreateTask(): void {
    this.showTaskForm = true;
  }

  onTaskCreated(): void {
    this.showTaskForm = false;
    // Trigger task board refresh via service
    this.refreshService.refreshTasks();
  }

  onCancelTaskForm(): void {
    this.showTaskForm = false;
  }
}
