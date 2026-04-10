# Smart Airport System - Deployment Guide

## Overview
This guide covers deploying the Smart Airport System to Vercel with both client and server components.

## Prerequisites
- Vercel account
- MongoDB database (MongoDB Atlas recommended)
- GitHub repository

## Environment Variables

### Server Environment Variables (Vercel)
Set these in your Vercel server project:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/airport_db
JWT_SECRET=your_jwt_secret_here
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-client-domain.vercel.app
```

### Client Environment Variables (Vercel)
Set these in your Vercel client project:

```
NEXT_PUBLIC_API_URL=https://your-server-domain.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://your-server-domain.vercel.app
```

## Deployment Steps

### 1. Deploy Server to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Root Directory**: `server`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add environment variables
6. Deploy

### 2. Deploy Client to Vercel

1. In Vercel Dashboard, click "New Project"
2. Import the same GitHub repository
3. Configure the project:
   - **Root Directory**: `client`
   - **Framework Preset**: Next.js
4. Add environment variables (NEXT_PUBLIC_API_URL and NEXT_PUBLIC_SOCKET_URL)
5. Update the API URLs to point to your deployed server
6. Deploy

### 3. Update CORS Settings

After both are deployed, update the server's CORS_ORIGIN environment variable with the client's deployed URL.

## Post-Deployment Configuration

### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Create database `airport_db`
3. Create collections: `flights`, `tickets`, `users`
4. Update MONGODB_URI in server environment variables

### Testing Deployment
1. Test passenger registration/login
2. Test flight booking
3. Test QR code generation
4. Test admin panel
5. Test check-in operations

## Troubleshooting

### Build Failures
- Ensure all dependencies are listed in package.json
- Check TypeScript compilation errors
- Verify environment variables are set correctly

### Runtime Errors
- Check server logs in Vercel dashboard
- Verify MongoDB connection string
- Ensure CORS settings allow client domain

### Socket.io Issues
- Vercel has limitations with WebSockets
- Consider using Vercel's serverless functions for real-time features
- Socket.io may not work reliably on Vercel's free tier

## Production Considerations

- Set up monitoring and logging
- Configure backup strategies for MongoDB
- Implement rate limiting
- Set up error tracking (Sentry, etc.)
- Configure domain and SSL certificates</content>
<parameter name="filePath">/Users/nidhish/Work/DBMS/Project/DEPLOYMENT.md