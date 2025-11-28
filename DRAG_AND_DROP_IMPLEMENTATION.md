# Drag & Drop Implementation

## Summary
Implemented drag & drop functionality for task cards to replace the dropdown-based status change. Tasks can now be dragged from anywhere on the card (not just a handle icon) and dropped into any status column.

## Changes Made

### 1. Dependencies Added
- **Installed**: `@angular/cdk` package for Angular CDK drag-drop functionality
- **Command**: `npm install @angular/cdk`

### 2. TypeScript Component (`task-board.ts`)

#### Imports Added:
```typescript
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
```

#### Modules Added to Component:
```typescript
imports: [CommonModule, CdkDrag, CdkDropList]
```

#### New Method Added:
```typescript
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
```

### 3. HTML Template (`task-board.html`)

#### Changes:
- **Removed**: All `<select>` dropdowns for status change
- **Removed**: All `cdkDragHandle` elements (drag handles)
- **Added**: `cdkDropList` directive to each `.tasks` container
- **Added**: `cdkDrag` directive to each `.task-card`
- **Added**: Connected drop lists so tasks can move between columns
- **Added**: Drop event handler `(cdkDropListDropped)="onDrop($event, TaskStatus.XXX)"`

#### Example Structure:
```html
<div class="tasks" cdkDropList
     #todoList="cdkDropList"
     [cdkDropListData]="todoTasks"
     [cdkDropListConnectedTo]="[inProgressList, doneList]"
     (cdkDropListDropped)="onDrop($event, TaskStatus.TODO)">
  <div *ngFor="let task of todoTasks" class="task-card" cdkDrag>
    <div class="task-content">
      <h4>{{ task.title }}</h4>
      <p>{{ task.description }}</p>
    </div>
    <div class="task-actions">
      <button class="btn-delete-task" (click)="deleteTask(task.id!, $event)">×</button>
    </div>
  </div>
</div>
```

### 4. Styles (`task-board.scss`)

#### Changes:
- **Removed**: `.status-select` styles (dropdown)
- **Removed**: `.drag-handle` styles
- **Updated**: `.task-card` to use `flex-direction: column` instead of horizontal layout
- **Added**: CDK drag & drop animation styles
  - `.cdk-drag-preview` - Styling for the dragging preview
  - `.cdk-drag-animating` - Animation transitions
  - `.cdk-drag-placeholder` - Placeholder where item will be dropped
  - `.cdk-drop-list-dragging` - Style for lists during drag

#### Key CSS Properties:
```scss
.task-card {
  cursor: grab;
  display: flex;
  flex-direction: column;
  
  &:active {
    cursor: grabbing;
  }
  
  &.cdk-drag-preview {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    opacity: 0.9;
    cursor: grabbing;
  }
}

.cdk-drag-placeholder {
  background: #e9ecef;
  border: 2px dashed #adb5bd;
  min-height: 80px;
  border-radius: 6px;
}
```

## Features

### ✅ Full Card Dragging
- Users can click and drag from anywhere on the task card
- No need to target a specific drag handle
- More intuitive user experience

### ✅ Visual Feedback
- **Grab Cursor**: Shows when hovering over draggable cards
- **Grabbing Cursor**: Shows while actively dragging
- **Placeholder**: Dashed box shows where the card will be dropped
- **Preview**: Semi-transparent copy of the card follows the cursor
- **Smooth Animations**: Cards animate into their new positions

### ✅ Cross-Column Drag & Drop
- Drag tasks from "To Do" to "In Progress"
- Drag tasks from "In Progress" to "Done"
- Drag tasks to any column (fully connected)

### ✅ Backend Synchronization
- Task status is automatically updated in the backend when dropped
- If the update fails, the UI reverts to the previous state
- Error handling with console logging

### ✅ Delete Button Protection
- Delete button (×) still works independently
- Click events are properly isolated from drag events

## User Experience

### Before:
- User had to click on the dropdown
- Select new status from the list
- Dropdown took up space in the UI

### After:
- User clicks anywhere on the task card
- Drags it to the desired column
- Drops it to change status
- Cleaner, more visual interface

## Testing

To test the drag & drop functionality:

1. Navigate to your application at http://localhost:4200
2. Select a project from the left sidebar
3. Click and hold on any task card
4. Drag it to another column
5. Release to drop
6. Verify the task moves to the new column
7. Check the browser console for success/error messages

## Browser Compatibility

Angular CDK drag-drop works on:
- ✅ Chrome, Edge, Safari (latest versions)
- ✅ Firefox (latest version)
- ✅ Mobile browsers (touch support included)

---
**Implementation Date**: November 28, 2025
**Status**: ✅ Complete - Full card dragging enabled
**Replaced**: Dropdown-based status change system

