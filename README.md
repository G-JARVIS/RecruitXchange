# RecruitXchange

## Project Intro

RecruitXchange is a **full-stack MERN application** designed to streamline student placement and career growth. The platform combines an AI-powered approach with structured learning paths, interactive practice hubs, and career counseling to help students land the right opportunities. RecruitXchange empowers students to:

- Explore **career roles and pathways** with detailed role information.  
- Access a **Learning Hub** with curated courses, resources, and progress tracking.  
- Practice real-world scenarios in the **Practice Hub** for skill reinforcement.  
- Participate in **drives and events**, manage applications, and track performance.  
- Schedule and manage tasks with the **Calendar** and receive **personalized guidance**.  
- Customize the platform with a **settings panel**, including themes and color palettes.

RecruitXchange combines a **React frontend**, **Node.js + Express backend**, and **MongoDB database**, providing a modern, fast, and interactive experience for students and educational institutions.

---

## How to Run the Project Locally

Follow these steps to get the project running on your machine:

```bash
# Step 1: Clone the repository
git clone https://github.com/gauravmatolia/RecruitXchange.git

# Step 2: Navigate to the project directory
cd RecruitXchange

# Step 3: Install frontend dependencies
cd frontend
npm install

# Step 4: Install backend dependencies
cd ../backend
npm install

# Step 5: Install backend dependencies
create a .env file and fill the following details
NODE_ENV=development
PORT=<Your Port Number>
MONGODB_URI=<your mongoDB url>

JWT_SECRET=<generate a long secret key >
JWT_EXPIRE=30d
ACCESS_TOKEN_SECRET=<your secret key>
REFRESH_TOKEN_SECRET=<your secret key>

FRONTEND_URL=http://localhost:5173

# Step 6: Start the backend server
npm run dev

# Step 7: Start the frontend development server
cd ../frontend
npm run dev
