import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
  standalone: true
})
export class ProjectFormComponent {
  @Output() projectCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  project: Project = {
    name: '',
    description: ''
  };

  constructor(private projectService: ProjectService) {}

  onSubmit(): void {
    if (this.project.name.trim()) {
      this.projectService.createProject(this.project).subscribe({
        next: () => {
          this.projectCreated.emit();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating project:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  resetForm(): void {
    this.project = {
      name: '',
      description: ''
    };
  }
}
