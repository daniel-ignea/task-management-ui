# Component Architecture & Data Flow

## Component Hierarchy

```
App (Main Container)
├── ProjectList (Sidebar)
│   └── Emits: projectSelected, createProject
├── TaskBoard (Main Content)
│   └── Emits: createTask
├── ProjectForm (Modal - Conditional)
│   └── Emits: projectCreated, cancel
└── TaskForm (Modal - Conditional)
    └── Emits: taskCreated, cancel
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         App Component                        │
│  State: selectedProjectId, showProjectForm, showTaskForm    │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  ProjectList     │  │   TaskBoard      │  │  Modal Forms     │
│  (Sidebar)       │  │  (Main Area)     │  │  (Overlays)      │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ • List projects  │  │ • Show tasks     │  │ • ProjectForm    │
│ • Select project │  │ • 3 columns      │  │ • TaskForm       │
│ • Delete project │  │ • Change status  │  │                  │
│ • Create button  │  │ • Delete task    │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                    │                    │
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ ProjectService   │  │  TaskService     │  │  HTTP Requests   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                    │                    │
         └────────────────────┴────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Backend API     │
                    │  localhost:8080  │
                    └──────────────────┘
```

## Event Flow Examples

### 1. Creating a Project

```
User clicks "New Project" button
         │
         ▼
ProjectList emits createProject event
         │
         ▼
App sets showProjectForm = true
         │
         ▼
ProjectForm modal appears
         │
         ▼
User fills form and clicks "Create"
         │
         ▼
ProjectForm calls ProjectService.createProject()
         │
         ▼
HTTP POST to /api/projects
         │
         ▼
Backend creates project and returns data
         │
         ▼
ProjectForm emits projectCreated event
         │
         ▼
App sets showProjectForm = false
         │
         ▼
ProjectList automatically refreshes (on init)
         │
         ▼
New project appears in sidebar
```

### 2. Selecting a Project and Creating a Task

```
User clicks on a project in sidebar
         │
         ▼
ProjectList emits projectSelected(projectId)
         │
         ▼
App sets selectedProjectId = projectId
         │
         ▼
TaskBoard receives new projectId via @Input
         │
         ▼
TaskBoard loads tasks via TaskService.getTasksByProjectId()
         │
         ▼
HTTP GET to /api/projects/{projectId}/tasks
         │
         ▼
Tasks displayed in 3 columns by status
         │
         ▼
User clicks "New Task" button
         │
         ▼
TaskBoard emits createTask event
         │
         ▼
App sets showTaskForm = true
         │
         ▼
TaskForm modal appears
         │
         ▼
User fills form and clicks "Create"
         │
         ▼
TaskForm calls TaskService.createTask(projectId, task)
         │
         ▼
HTTP POST to /api/projects/{projectId}/tasks
         │
         ▼
Backend creates task and returns data
         │
         ▼
TaskForm emits taskCreated event
         │
         ▼
App sets showTaskForm = false
         │
         ▼
TaskBoard automatically refreshes
         │
         ▼
New task appears in appropriate column
```

### 3. Changing Task Status

```
User selects new status from dropdown on task card
         │
         ▼
TaskBoard.changeTaskStatus(task, newStatus) called
         │
         ▼
TaskService.updateTask(taskId, updatedTask)
         │
         ▼
HTTP PUT to /api/tasks/{id}
         │
         ▼
Backend updates task and returns data
         │
         ▼
TaskBoard reloads tasks
         │
         ▼
Task moves to new column
```

### 4. Deleting a Project

```
User clicks delete (×) button on project
         │
         ▼
Browser shows confirmation dialog
         │
         ▼
User confirms deletion
         │
         ▼
ProjectList.deleteProject(projectId) called
         │
         ▼
ProjectService.deleteProject(projectId)
         │
         ▼
HTTP DELETE to /api/projects/{id}
         │
         ▼
Backend deletes project
         │
         ▼
ProjectList reloads projects
         │
         ▼
If deleted project was selected:
  │
  ├─ selectedProjectId = null
  └─ TaskBoard clears (empty state)
```

## Service Methods

### ProjectService
```typescript
getAllProjects(): Observable<Project[]>
getProjectById(id: number): Observable<Project>
createProject(project: Project): Observable<Project>
updateProject(id: number, project: Project): Observable<Project>
deleteProject(id: number): Observable<void>
```

### TaskService
```typescript
getTasksByProjectId(projectId: number): Observable<Task[]>
getTaskById(id: number): Observable<Task>
createTask(projectId: number, task: Task): Observable<Task>
updateTask(id: number, task: Task): Observable<Task>
deleteTask(id: number): Observable<void>
```

## Component Communication Patterns

### Parent → Child (Input)
- App → TaskBoard: `[projectId]="selectedProjectId"`
- App → TaskForm: `[projectId]="selectedProjectId"`

### Child → Parent (Output)
- ProjectList → App: `(projectSelected)="onProjectSelected($event)"`
- ProjectList → App: `(createProject)="onCreateProject()"`
- TaskBoard → App: `(createTask)="onCreateTask()"`
- ProjectForm → App: `(projectCreated)="onProjectCreated()"`
- ProjectForm → App: `(cancel)="onCancelProjectForm()"`
- TaskForm → App: `(taskCreated)="onTaskCreated()"`
- TaskForm → App: `(cancel)="onCancelTaskForm()"`

### Component → Service → Backend
- All HTTP communication goes through services
- Services return Observables
- Components subscribe to Observables
- Error handling in subscribe block

## State Management

### App Component State
```typescript
selectedProjectId: number | null = null;  // Currently selected project
showProjectForm: boolean = false;          // Show/hide project form modal
showTaskForm: boolean = false;             // Show/hide task form modal
```

### Component Local State
- ProjectList: `projects: Project[]`, `selectedProjectId: number | null`
- TaskBoard: `tasks: Task[]`, `todoTasks`, `inProgressTasks`, `doneTasks`
- ProjectForm: `project: Project` (form model)
- TaskForm: `task: Task` (form model)

All state is managed reactively through Angular's change detection.

