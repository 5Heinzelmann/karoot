# GitHub OAuth Setup Guide

This application uses GitHub OAuth for authentication instead of email/password. Follow these steps to set up GitHub OAuth:

## 1. Create a GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/auth/callback`

## 2. Configure Supabase

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Find GitHub and click to configure
4. Enable GitHub provider
5. Add your GitHub OAuth App credentials:
   - **Client ID**: From your GitHub OAuth App
   - **Client Secret**: From your GitHub OAuth App
6. Add the callback URL to your redirect allow list:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

## 3. Environment Variables

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Production Setup

For production deployment:

1. Update your GitHub OAuth App settings:
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://yourdomain.com/auth/callback`

2. Update Supabase redirect allow list with your production URL

## Authentication Flow

1. User clicks "Continue with GitHub" button
2. User is redirected to GitHub for authorization
3. GitHub redirects back to `/auth/callback` with authorization code
4. The callback route exchanges the code for a session
5. User is redirected to the protected area

## Removed Features

The following email-based authentication features have been removed:
- Email/password login and signup
- Forgot password functionality
- Email confirmation
- Password update functionality

All authentication now goes through GitHub OAuth.