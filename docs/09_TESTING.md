# Testing Strategy

## 1. Access Control Testing (RBAC)
* Verify that Students attempting to reach `/api/admin` endpoints receive a `403 Forbidden` response.
* Verify that unapproved Recruiter drives do NOT appear in the Student `/api/drives/published` feed.

## 2. UI Component Testing
* Verify dynamic eligibility badges compute accurately (e.g., student with CGPA 7.0 marked "Ineligible" for a drive requiring 7.5 CGPA).