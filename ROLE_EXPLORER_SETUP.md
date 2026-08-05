# Role Explorer Setup Guide

The Role Explorer is not working because there's no role data in the database. Here's how to fix it:

## Step 1: Start the Backend Server
Make sure your backend server is running:
```bash
cd backend
npm run dev
```

## Step 2: Seed Role Data
Run the role seeder to populate the database with sample roles:
```bash
cd backend
npm run seed-roles
```

This will create 6 sample roles:
- Full Stack Developer
- Data Scientist  
- DevOps Engineer
- UI/UX Designer
- Mobile App Developer
- Cybersecurity Analyst

## Step 3: Test the API (Optional)
You can test if the API is working by running:
```bash
node test-roles-api.js
```

## Step 4: Access Role Explorer
Now you can access the Role Explorer in the frontend and it should display the roles.

## Troubleshooting

### If roles still don't appear:
1. Check browser console for errors
2. Verify API_BASE_URL is correct (should be http://localhost:5001/api)
3. Make sure backend server is running on port 5001
4. Check if MongoDB is connected

### If you want to add more roles:
1. Login as admin
2. Go to Admin Dashboard → Job Roles
3. Click "Add Role" to create new roles

### API Endpoints:
- `GET /api/roles` - Get all roles
- `GET /api/roles/stats/overview` - Get role statistics
- `GET /api/roles/:id` - Get single role details

## Features:
- Search by role name, tech stack, or companies
- Filter by experience level and industry demand
- Detailed role information including:
  - Tech stack requirements
  - Average salary packages
  - Major hiring companies
  - Career progression paths
  - Work environment details
  - Required skills and education