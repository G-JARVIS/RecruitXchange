# Deployment Guide

## Environment Variables Configuration

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/recruitxchange
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_URL=cloudinary://key:secret@cloud_name