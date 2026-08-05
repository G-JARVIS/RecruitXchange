# Product Requirement Document (PRD) - RecruitXchange

## 1. Project Overview
RecruitXchange is an enterprise-ready placement management platform connecting **Students**, **Recruiters**, and **TPOs (Admins)**.

## 2. Core User Roles & Responsibilities
* **Student:** Create profiles, upload resumes, track job applications, take practice aptitude tests, and view eligibility-filtered drives.
* **Recruiter:** Post placement drives/internships, review applicants, download student data, update application statuses.
* **Admin / TPO:** Verify student details, approve drives, broadcast notices, and generate NAAC/NIRF placement analytics.

## 3. Key Feature Modules
1. **Auth & Profile Engine:** Role-based JWT authentication, multi-step profile builder (CGPA, backlogs, skills).
2. **Drive Management:** Dynamic drive creation with rigid eligibility rules (Branch, CGPA cutoff, max backlogs).
3. **Application Lifecycle:** 1-Click apply, status timeline tracker (Applied -> Shortlisted -> OA -> Interview -> Offered).
4. **Practice Hub:** Interactive aptitude & company-specific practice test engine with timer and analytics.