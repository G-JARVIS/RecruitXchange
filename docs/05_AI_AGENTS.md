# AI Agent Integration Specifications

## 1. Resume Parsing Agent
* **Purpose:** Automatically extract skills, CGPA, and project links from uploaded PDF resumes during student profile setup.
* **Input:** PDF Binary Stream.
* **Output:** JSON object populating `skills[]`, `githubUrl`, and `projects[]`.

## 2. Adaptive Aptitude Question Generator
* **Purpose:** Dynamically generate company-specific mock aptitude test questions based on historical hiring patterns (e.g., TCS NQT, Infosys).
* **Input:** Target Company Name, Category ('Quantitative' | 'Logical' | 'Verbal'), Difficulty level.