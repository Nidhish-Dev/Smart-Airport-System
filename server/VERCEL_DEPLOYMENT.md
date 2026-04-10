# Vercel Deployment Guide

## Prerequisites
- Vercel account
- MongoDB database (MongoDB Atlas recommended)

## Environment Variables
Set these in your Vercel project settings:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Deployment Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   cd server
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add the environment variables listed above

## Important Notes

⚠️ **Socket.io Limitation**: Vercel serverless functions don't fully support WebSocket connections required for real-time features. The Socket.io functionality may not work properly on Vercel.

Consider using:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

For full real-time functionality.

## API Endpoints
After deployment, your API will be available at:
`https://your-project-name.vercel.app/api/*`