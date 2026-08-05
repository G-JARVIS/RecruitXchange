# Admin Interface Features

This document outlines the admin interface features added to the RecruitXchange platform.

## Overview

The admin interface provides comprehensive management capabilities for administrators to oversee the platform's operations, manage users, and control content.

## Features Implemented

### 1. Role-Based Authentication
- **Login Role Selection**: Users can now select whether they're logging in as a Student or Admin
- **Role-Based Routing**: Different navigation and access based on user role
- **Admin-Only Routes**: Protected routes that only admin users can access

### 2. Admin Dashboard
- **Central Hub**: Overview of platform statistics and quick access to management features
- **Quick Stats**: Display of total students, active drives, and quizzes
- **Navigation Cards**: Easy access to different admin functions

### 3. Student Management
- **Student Directory**: View all registered students with search functionality
- **Student Profiles**: Detailed view of individual student information including:
  - Basic information (name, email, contact details)
  - Academic details (college, branch, year of study, CGPA)
  - Skills and projects
  - Application history
  - Profile statistics (readiness score, level, XP)
- **Search Functionality**: Search students by name or email

### 4. Quiz Management (Practice Hub)
- **Quiz Library**: View all practice hub quizzes
- **Create Quizzes**: Add new quizzes with:
  - Multiple choice questions
  - Difficulty levels (Easy, Medium, Hard)
  - Categories
  - Time limits
  - Passing scores
  - Question explanations
- **Edit Quizzes**: Modify existing quiz content and settings
- **Delete Quizzes**: Remove quizzes from the platform
- **Quiz Status**: Activate/deactivate quizzes

### 5. Company Drive Management
- **Drive Directory**: View all company recruitment drives
- **Create Drives**: Add new company drives with:
  - Company and role information
  - Location and package details
  - Application deadlines
  - Job descriptions
  - Requirements and eligibility criteria
  - Selection process stages
- **Edit Drives**: Modify existing drive information
- **Delete Drives**: Remove drives from the platform
- **Drive Status**: Activate/deactivate drives

### 6. Application Management
- **Drive Applications**: View all student applications for specific drives
- **Student Information**: See applicant details including:
  - Name, branch, and year of study
  - Current application stage
  - Application status
  - Application date
- **Streamlined Stage Management**: Two-action system for managing applications:
  - **Move to Next Stage**: Automatically advances application to the next stage in the process
    - Increases process stage index by 1
    - Updates current stage and next step automatically
    - Updates status based on stage (eligible → shortlisted → interview → selected)
  - **Reject Application**: Marks application as rejected
    - Sets status to 'rejected'
    - Updates next step to indicate rejection
    - Prevents further stage progression
- **Smart Stage Progression**: Uses the actual process stages defined in each company drive
  - Automatically progresses through the drive's process array
  - Updates current stage and next step based on drive-specific stages
  - Only updates status to 'selected' when reaching the final stage
- **Search Applications**: Search applications by student name
- **Real-time Updates**: Track application progress through different stages
- **Action States**: Visual feedback with loading states for actions

## Technical Implementation

### Backend Features
- **Admin Routes**: `/api/admin/*` endpoints for all admin operations
- **Role-Based Middleware**: `adminOnly` middleware for route protection
- **CRUD Operations**: Full create, read, update, delete operations for all entities
- **Data Validation**: Comprehensive input validation and error handling

### Frontend Features
- **Role-Based Navigation**: Different sidebar navigation for admin users
- **Protected Routes**: `RoleBasedRoute` component for access control
- **Admin Pages**: Dedicated admin interface with modern UI components
- **Form Management**: Complex forms for creating and editing content
- **Search and Filtering**: Real-time search and filtering capabilities
- **Responsive Design**: Mobile-friendly admin interface

## Getting Started

### 1. Create Admin User
Run the following command to create an admin user:
```bash
cd backend
npm run create-admin
```

This creates an admin user with:
- **Email**: admin@recruitxchange.com
- **Password**: admin123
- **Role**: admin

### 2. Login as Admin
1. Go to the login page
2. Select "Admin" from the login type dropdown
3. Enter the admin credentials
4. You'll be redirected to the admin dashboard

### 3. Admin Navigation
The admin interface includes:
- **Admin Dashboard**: Overview and quick access
- **Manage Students**: Student directory and profiles
- **Manage Quizzes**: Practice hub quiz management
- **Company Drives**: Recruitment drive management

## Security Features
- **Role-Based Access Control**: Only admin users can access admin routes
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all admin operations
- **Error Handling**: Comprehensive error handling and user feedback

## Improved Application Management Workflow

The application management system has been streamlined for better usability:

### **Two-Action System**
Instead of complex manual updates, admins now have two simple actions:

1. **Move to Next Stage** 🟢
   - One-click progression through predefined stages
   - Automatic status updates based on current stage
   - Smart next-step generation
   - Disabled for completed/rejected applications

2. **Reject Application** 🔴
   - Immediate rejection with confirmation
   - Prevents further stage progression
   - Clear rejection status indication

### **Smart Stage Progression**
The system automatically handles stage progression using each drive's specific process:
- **Dynamic Stages**: Uses the actual process stages defined in the company drive
- **Stage Index**: Increments the processStageIndex by 1 with each progression
- **Current Stage**: Updates to the next stage from the drive's process array
- **Next Step**: Automatically generates next step based on upcoming stage
- **Status Management**: Only changes status to 'selected' when reaching the final stage
- **Drive-Specific**: Each company drive can have its own unique process stages

### **Visual Feedback**
- Loading states during actions
- Color-coded buttons (green for progression, red for rejection)
- Status badges for completed applications
- Confirmation dialogs for irreversible actions

## Automatic Calendar Integration

### **Smart Calendar Event Creation** 📅
When students apply for company drives, the system automatically:

1. **Creates Calendar Events**: Generates events for all process schedule items
   - Uses the drive's `processSchedule` array
   - Sets proper date, time, and venue information
   - Links events to the specific application

2. **Event Details**:
   - **Title**: `{Company Name} - {Stage Name}`
   - **Type**: Placement Drive
   - **Description**: Includes role, company, and stage details
   - **Attendees**: Automatically registers the applicant
   - **Metadata**: Links to application and drive for tracking

3. **Dynamic Event Updates**:
   - **Stage Progression**: Marks past events as `[COMPLETED]` and current as `[CURRENT]`
   - **Application Rejection**: Marks all related events as `[CANCELLED]`
   - **Status Sync**: Event status updates with application progress

### **Calendar Features**:
- **Personal Calendar**: Students see only their placement-related events
- **Automatic Registration**: No manual event registration needed
- **Status Indicators**: Visual indicators for event status
- **Integrated Workflow**: Events update automatically with application changes

### **API Endpoints**:
- `GET /api/events/my-events` - Get user's personal calendar events
- Events are automatically created during drive application
- Events are automatically updated during admin stage management

## Future Enhancements
- **Google Calendar Sync**: Sync placement events with personal Google Calendar
- **Email Reminders**: Automated email reminders for upcoming events
- **Analytics Dashboard**: Detailed platform analytics and reports
- **Bulk Operations**: Bulk import/export of students and drives
- **Advanced Filtering**: More sophisticated filtering and sorting options
- **Audit Logs**: Track all admin actions for accountability
- **Custom Stage Definitions**: Allow admins to define custom recruitment stages per drive

## API Endpoints

### Student Management
- `GET /api/admin/students` - Get all students
- `GET /api/admin/students/:id` - Get student by ID
- `GET /api/admin/students?search=query` - Search students

### Quiz Management
- `GET /api/admin/quizzes` - Get all quizzes
- `POST /api/admin/quizzes` - Create new quiz
- `PUT /api/admin/quizzes/:id` - Update quiz
- `DELETE /api/admin/quizzes/:id` - Delete quiz

### Drive Management
- `GET /api/admin/drives` - Get all drives
- `POST /api/admin/drives` - Create new drive
- `PUT /api/admin/drives/:id` - Update drive
- `DELETE /api/admin/drives/:id` - Delete drive

### Application Management
- `GET /api/admin/drives/:id/applications` - Get drive applications
- `PUT /api/admin/applications/:id/next-stage` - Move application to next stage
- `PUT /api/admin/applications/:id/reject` - Reject application
- `PUT /api/admin/applications/:id/stage` - Manual stage update (legacy)

All admin endpoints require authentication and admin role authorization.