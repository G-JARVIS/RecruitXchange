# System Architecture - RecruitXchange

## 1. Technical Stack
* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Shadcn UI primitives.
* **Backend:** Node.js, Express.js (ES Modules syntax), JSON Web Tokens (JWT), Bcrypt.js.
* **Database:** MongoDB Atlas with Mongoose ODM.
* **Storage:** Cloudinary / AWS S3 (for PDF resume hosting).

## 2. Directory Structure Blueprint

### Frontend (`/frontend`)
```text
frontend/
├── src/
│   ├── assets/          # Logos and university graphics
│   ├── components/      # UI components (Layout, UI primitives, Motion wrappers)
│   ├── context/         # AuthContext.tsx, ThemeContext.tsx
│   ├── mocks/           # mockData.ts (Simulated data state)
│   ├── pages/           # Views (Student, Recruiter, Admin pages)
│   ├── services/        # Axios API client setup
│   └── types/           # index.ts (TypeScript Interfaces)

### Backtend (`/backend`)
backend/
├── src/
│   ├── config/          # db.js, cloudinary.js
│   ├── controllers/     # authController.js, driveController.js, studentController.js
│   ├── middlewares/     # authMiddleware.js (JWT & RBAC), errorMiddleware.js
│   ├── models/          # User.js, StudentProfile.js, Drive.js, Application.js
│   ├── routes/          # Express Routers
│   └── utils/           # tokenGenerator.js, apiResponse.js
└── server.js