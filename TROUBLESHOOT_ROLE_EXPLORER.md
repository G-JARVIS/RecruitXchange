# Role Explorer Troubleshooting Guide

## Issue: Blank Screen When Clicking Role Explorer

### Step 1: Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Click on Role Explorer
4. Look for any JavaScript errors

### Step 2: Test Basic Component
The app is currently using a simple test version. You should see:
- "Role Explorer (Simple)" heading
- Either role cards or a message about running seed script

### Step 3: Check Backend Connection
1. Verify backend is running:
   ```bash
   cd backend
   npm run dev
   ```

2. Test API directly:
   ```bash
   curl http://localhost:5001/api/roles
   ```

3. Should return JSON with roles array

### Step 4: Seed Database
If API returns empty roles array:
```bash
cd backend
npm run seed-roles
```

### Step 5: Check Network Tab
1. Open browser Network tab
2. Click Role Explorer
3. Look for failed API requests to `http://localhost:5001/api/roles`

### Step 6: Common Issues & Solutions

#### Issue: API_BASE_URL is undefined
- Check if AuthContext is properly configured
- Verify useAuth hook is working

#### Issue: CORS errors
- Make sure backend CORS is configured for frontend URL
- Check if ports match (frontend: 5173, backend: 5001)

#### Issue: Component crashes
- Check browser console for React errors
- Look for missing imports or syntax errors

#### Issue: Network connection failed
- Verify backend server is running
- Check if MongoDB is connected
- Verify port 5001 is not blocked

### Step 7: Switch Back to Full Component
Once simple version works, update App.jsx:
```javascript
<Route path="/roles" element={<RoleExplorer />} />
```

### Step 8: Debug Full Component
If full component still shows blank:
1. Check console for "RoleExplorer component rendering..." message
2. Look for any error messages
3. Check if useAuth hook returns valid API_BASE_URL

### Expected Behavior
Working Role Explorer should show:
- Header with "Explore Career Roles"
- Search and filter controls
- Grid of role cards with:
  - Role name
  - Average package
  - Tech stack badges
  - "Learn More" button

### API Endpoints Used
- `GET /api/roles` - Main roles data
- `GET /api/roles/stats/overview` - Statistics (optional)

### Sample Role Data
After seeding, you should have 6 roles:
1. Full Stack Developer
2. Data Scientist
3. DevOps Engineer
4. UI/UX Designer
5. Mobile App Developer
6. Cybersecurity Analyst