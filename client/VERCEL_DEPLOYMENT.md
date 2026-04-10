# Vercel Deployment Guide for Client

## Environment Variables
Set these in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-server-domain.vercel.app
```

## Deployment Steps

1. **Deploy to Vercel**:
   ```bash
   cd client
   vercel --prod
   ```

2. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add `NEXT_PUBLIC_API_URL` pointing to your deployed server

## Build Configuration
The `vercel.json` and `next.config.ts` are configured to:
- Ignore TypeScript errors during build
- Enable static optimization
- Support Next.js 16

## API URL Configuration
Update all API calls in the client to use `process.env.NEXT_PUBLIC_API_URL` instead of localhost.

Example:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```