#!/bin/bash

# Kill any existing Angular dev servers
pkill -f "ng serve" 2>/dev/null
sleep 2

# Navigate to project directory
cd /Users/danielig/aiHackaton/task-management-ui/task-management-ui

# Start the Angular development server
echo "Starting Angular development server..."
echo "The application will be available at: http://localhost:4200"
echo "Press Ctrl+C to stop the server"
echo ""

npm start

