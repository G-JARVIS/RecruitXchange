### `docs/03_DATABASE.md`
```markdown
# Database Schemas (Mongoose ODM)

## 1. User Schema (`User.js`)
* `name`: String (Required)
* `email`: String (Unique, Required)
* `password`: String (Hashed with bcrypt)
* `role`: Enum ['student', 'recruiter', 'admin']
* `status`: Enum ['pending_approval', 'active', 'suspended'] (Default: 'active' for students, 'pending_approval' for recruiters)

## 2. Student Profile Schema (`StudentProfile.js`)
* `userId`: ObjectId (Ref: User)
* `rollNumber`: String (Unique)
* `department`: String (e.g., 'Computer Engineering', 'Data Science & Algorithms')
* `cgpa`: Number
* `activeBacklogs`: Number (Default: 0)
* `skills`: [String]
* `isVerified`: Boolean (Default: false, verified by TPO)
* `resumeUrl`: String

## 3. Drive Schema (`Drive.js`)
* `companyId`: ObjectId (Ref: User)
* `companyName`: String
* `role`: String
* `package`: String (CTC details)
* `minCgpa`: Number
* `allowedBranches`: [String]
* `maxBacklogs`: Number
* `approvalStatus`: Enum ['draft', 'pending_admin_approval', 'published', 'rejected']
* `deadline`: Date

## 4. Application Schema (`Application.js`)
* `driveId`: ObjectId (Ref: Drive)
* `studentId`: ObjectId (Ref: User)
* `status`: Enum ['applied', 'shortlisted', 'interview_scheduled', 'offered', 'rejected']
* `appliedAt`: Date (Default: Date.now)