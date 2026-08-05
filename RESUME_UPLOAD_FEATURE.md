# Resume Upload Feature

## Overview
Added resume upload functionality to the RecruitXchange platform that allows students to upload, update, and manage their resumes in PDF format.

## Features Added

### Backend Changes
1. **File Upload Utility** (`backend/utils/fileUpload.js`)
   - Multer configuration for handling PDF file uploads
   - File validation (PDF only, 5MB max size)
   - Automatic file naming with user ID and timestamp
   - Helper function to delete old resume files

2. **Database Schema Update** (`backend/models/User.js`)
   - Added `resumePath` field to store file system path
   - Existing `resume` field now stores filename

3. **API Endpoints** (`backend/routes/profile.js`)
   - `POST /api/profile/resume` - Upload new resume
   - `GET /api/profile/resume/:userId` - Download resume
   - `DELETE /api/profile/resume` - Delete current resume

4. **Static File Serving** (`backend/server.js`)
   - Added `/uploads` route to serve uploaded files

### Frontend Changes
1. **Student Profile Page** (`frontend/src/pages/Profile.jsx`)
   - Resume upload section in Personal Information tab
   - Upload, download, and delete functionality
   - File validation and progress indicators
   - Responsive UI with proper error handling

2. **Admin Student Profile** (`frontend/src/pages/admin/StudentProfile.jsx`)
   - Display student's resume information
   - Download button for admin to access student resumes

3. **Drive Applications Page** (`frontend/src/pages/admin/DriveApplications.jsx`)
   - Made student names clickable links
   - Links navigate to individual student profile pages

## File Structure
```
backend/
├── uploads/
│   └── resumes/          # PDF files stored here
├── utils/
│   └── fileUpload.js     # Multer configuration
├── routes/
│   └── profile.js        # Resume API endpoints
└── models/
    └── User.js           # Updated schema

frontend/src/pages/
├── Profile.jsx           # Student resume upload
├── admin/
│   ├── StudentProfile.jsx    # Admin view with resume
│   └── DriveApplications.jsx # Clickable student names
```

## Usage

### For Students
1. Navigate to Profile page
2. Go to "Personal Info" tab
3. Find the "Resume" section
4. Upload PDF file (max 5MB)
5. Update or delete as needed

### For Admins
1. View student profiles from "Manage Students"
2. Click student names in drive applications to view profiles
3. Download student resumes from profile pages

## Security Features
- File type validation (PDF only)
- File size limits (5MB)
- Unique file naming prevents conflicts
- Old files automatically deleted on update
- Protected routes require authentication

## Technical Details
- Uses Multer for file handling
- Files stored in `backend/uploads/resumes/`
- Filename format: `{userId}_{timestamp}_{originalname}`
- Automatic cleanup of old files
- Error handling for all operations
- Manual fetch for file uploads to avoid JSON content-type conflicts

## Important Notes
- File uploads use manual `fetch` instead of `authenticatedFetch` to prevent JSON content-type headers
- Multer middleware handles multipart form data before JSON body parser
- Browser automatically sets correct `multipart/form-data` content-type