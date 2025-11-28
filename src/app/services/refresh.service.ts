import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private projectRefreshSource = new Subject<void>();
  private taskRefreshSource = new Subject<void>();

  projectRefresh$ = this.projectRefreshSource.asObservable();
  taskRefresh$ = this.taskRefreshSource.asObservable();

  refreshProjects(): void {
    this.projectRefreshSource.next();
  }

  refreshTasks(): void {
    this.taskRefreshSource.next();
  }
}

