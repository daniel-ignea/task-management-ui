# Task Management UI - Setup Guide

This is an Angular 18 application that provides a user interface for the Task Management Service.

## Prerequisites

- Node.js v22.12 or later (or v20.19 or later)
- npm (comes with Node.js)

## Current Node Version Issue

Your current Node.js version (v22.6.0) needs to be updated to v22.12 or later.

### To Update Node.js:

**Using nvm (recommended):**
```bash
nvm install 22.12
nvm use 22.12
```

**Or download from:**
https://nodejs.org/

## Installation & Running

Once Node.js is updated, follow these steps:

1. **Install dependencies:**
   ```bash
   cd /Users/danielig/aiHackaton/task-management-ui/task-management-ui
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   Open your browser and navigate to: `http://localhost:4200`

## Backend API Configuration

The application is configured to connect to the backend API at:
- **Base URL:** `http://localhost:8080`

### API Endpoints Used:

**Projects:**
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

**Tasks:**
- `GET /api/projects/{projectId}/tasks` - List tasks for a project
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/projects/{projectId}/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Features

### Project Management
- ✅ View all projects in a sidebar
- ✅ Create new projects
- ✅ Delete projects
- ✅ Select a project to view its tasks

### Task Management
- ✅ View tasks organized by status columns (To Do, In Progress, Done)
- ✅ Create new tasks for a project
- ✅ Change task status using dropdown
- ✅ Delete tasks
- ✅ Task details include title and description

### UI Layout
- **Left Sidebar:** Project list with create button
- **Main Area:** Kanban-style board with three columns (To Do, In Progress, Done)
- **Modal Forms:** For creating projects and tasks

## Project Structure

```
src/app/
├── models/
│   ├── project.model.ts      # Project interface
│   └── task.model.ts          # Task interface and Status enum
├── services/
│   ├── project.service.ts    # Project API service
│   └── task.service.ts        # Task API service
├── components/
│   ├── project-list/         # Project sidebar component
│   ├── task-board/           # Kanban board component
│   ├── project-form/         # Project creation modal
│   └── task-form/            # Task creation modal
├── app.ts                    # Main app component
├── app.html                  # Main app template
├── app.scss                  # Main app styles
└── app.config.ts             # App configuration with HttpClient
```

## Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Run tests
```bash
npm test
```

## Notes

- No authentication is implemented as per requirements
- The backend service must be running on `localhost:8080` for the application to work
- All HTTP communication uses Angular's HttpClient with observables
- Uses Angular 18 standalone components (no NgModules)
- Responsive design with mobile support

## Troubleshooting

1. **Cannot connect to backend:**
   - Ensure the backend service is running on `http://localhost:8080`
   - Check browser console for CORS errors
   - Verify the backend has CORS enabled for `http://localhost:4200`

2. **Port 4200 already in use:**
   ```bash
   ng serve --port 4300
   ```

3. **Node version errors:**
   - Make sure you're using Node.js v22.12+ or v20.19+
   - Run `node --version` to check your current version

