# 🚀 Quick Start Guide - Task Management UI

## ⚠️ Important: Node.js Version

**Current Issue:** Your Node.js version (v22.6.0) needs to be updated.

**Required:** Node.js v22.12+ or v20.19+

### Update Node.js Now:

```bash
# Using nvm (recommended)
nvm install 22.12
nvm use 22.12

# Verify
node --version  # Should show v22.12.x or higher
```

## 🎯 Run the Application (2 Steps)

### Prerequisites
Make sure your backend service is running on `http://localhost:8080` with CORS enabled for `http://localhost:4200`

(See BACKEND_CORS_CONFIG.java for the required CORS configuration)

### Step 1: Install & Start Frontend

```bash
cd /Users/danielig/aiHackaton/task-management-ui/task-management-ui

# Install dependencies (if needed)
npm install

# Start the dev server
npm start
```

### Step 2: Open Browser
Navigate to: **http://localhost:4200**

## 📋 What You'll See

### Left Sidebar - Projects
- List of all projects
- Click a project to select it
- "New Project" button at top
- Delete (×) button on each project

### Main Area - Task Board
- Three columns: To Do, In Progress, Done
- Tasks grouped by status
- "New Task" button at top
- Each task has:
  - Title and description
  - Status dropdown to change status
  - Delete (×) button

### Creating Items
- Click "New Project" → Modal form opens
- Click "New Task" → Modal form opens (only when project selected)
- Fill in details and click Create

## ✅ Features Checklist

- [x] List all projects
- [x] List all tasks by project
- [x] Create new projects
- [x] Create new tasks for a project
- [x] Delete projects
- [x] Delete tasks
- [x] Change task status (To Do ↔ In Progress ↔ Done)
- [x] Visual Kanban board layout
- [x] No authentication required
- [x] Works with localhost:8080 backend

## 🛠️ Tech Stack

- **Angular 18** (latest stable)
- **TypeScript** (strict mode)
- **SCSS** for styling
- **HttpClient** for API calls
- **Standalone Components** (no NgModules)
- **Reactive Forms** with two-way binding

## 📁 Project Structure

```
src/app/
├── models/              # TypeScript interfaces
│   ├── project.model.ts
│   └── task.model.ts
├── services/            # API services
│   ├── project.service.ts
│   └── task.service.ts
├── components/          # UI components
│   ├── project-list/
│   ├── project-form/
│   ├── task-board/
│   └── task-form/
├── app.ts              # Main app component
├── app.html            # Main template
├── app.scss            # Main styles
└── app.config.ts       # App configuration
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
ng serve --port 4300
```

### Cannot Connect to Backend
1. Verify backend is running: `curl http://localhost:8080/api/projects`
2. Check browser console for CORS errors
3. Ensure CORS is configured in backend (see Step 1)

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Documentation

- `README_SETUP.md` - Detailed setup instructions
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- `BACKEND_CORS_CONFIG.java` - Backend CORS configuration

## 🎨 Color Scheme

- **Header**: Dark Gray (#343a40)
- **To Do**: Gray (#6c757d)
- **In Progress**: Blue (#007bff)
- **Done**: Green (#28a745)
- **Create Buttons**: Green (#28a745)
- **Delete Buttons**: Red (#dc3545)

## 💡 Tips

1. **Select a project first** before creating tasks
2. **Use status dropdowns** on task cards to change status quickly
3. **Delete confirmations** prevent accidental deletions
4. **Responsive design** works on mobile and tablet too

---

**Ready to go!** Once Node.js is updated, just run `npm start` and open http://localhost:4200 🎉

