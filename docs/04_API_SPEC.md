# REST API Specification

## Auth Endpoints
* `POST /api/auth/register` - Create new user account.
* `POST /api/auth/login` - Authenticate user and issue JWT.
* `GET /api/auth/me` - Get current authenticated user session.

## Placement Drive Endpoints
* `GET /api/drives/published` - [Student] Fetch drives with `approvalStatus: 'published'`.
* `GET /api/drives/pending` - [Admin] Fetch drives requiring approval.
* `POST /api/drives` - [Recruiter] Create drive (Sets status to `pending_admin_approval`).
* `PATCH /api/drives/:id/status` - [Admin] Approve or Reject a drive.

## Application Endpoints
* `POST /api/applications/apply` - [Student] Submit 1-click application.
* `GET /api/applications/student` - [Student] View personal application history.
* `PATCH /api/applications/:id` - [Recruiter/Admin] Update application status.