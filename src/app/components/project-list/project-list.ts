import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { RefreshService } from '../../services/refresh.service';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
  standalone: true
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  selectedProjectId: number | null = null;
  @Output() projectSelected = new EventEmitter<number>();
  @Output() createProject = new EventEmitter<void>();

  private refreshSubscription?: Subscription;

  constructor(
    private projectService: ProjectService,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    this.loadProjects();

    // Subscribe to refresh events
    this.refreshSubscription = this.refreshService.projectRefresh$.subscribe(() => {
      this.loadProjects();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  selectProject(projectId: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.selectedProjectId = projectId;
    this.projectSelected.emit(projectId);
  }

  onCreateProject(): void {
    this.createProject.emit();
  }

  deleteProject(projectId: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.loadProjects();
          if (this.selectedProjectId === projectId) {
            this.selectedProjectId = null;
            this.projectSelected.emit(0);
          }
        },
        error: (error) => {
          console.error('Error deleting project:', error);
        }
      });
    }
  }
}
