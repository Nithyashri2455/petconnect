# Google OAuth Setup Guide

## Overview
This guide explains how to set up Google Sign-In for PawConnect. The implementation is complete, but you need to configure your Google OAuth credentials.

## What's Been Implemented

### Database Changes ✅
- Added `google_id` column (VARCHAR 255, UNIQUE)
- Added `auth_provider` column (ENUM: 'local', 'google')
- Added `avatar_url` column (TEXT)
- Made `password` column nullable (for OAuth users)

### Backend Changes ✅
- **POST /api/auth/google** - New endpoint for Google OAuth
- Handles both new user registration and existing user login via Google
- Stores Google credential and profile picture
- Returns JWT token like regular login

### Frontend Changes ✅
- **RegisterScreen.jsx** - New registration component with Google Sign-In
- **LoginScreen.jsx** - Updated to include "Create Account" option
- **main.jsx** - Wrapped with GoogleOAuthProvider
- Installed packages: `@react-oauth/google`, `jwt-decode`, `axios`

## Setup Instructions

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if not done:
   - User Type: External
   - App name: PawConnect
   - User support email: your email
   - Developer contact: your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: PawConnect Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173` (Vite dev server)
     - `http://localhost:3000` (if you change port)
   - Authorized redirect URIs:
     - `http://localhost:5173`
7. Copy the **Client ID** (looks like: `123456789-abc123def456.apps.googleusercontent.com`)

### Step 2: Configure Frontend

Open `src/main.jsx` and replace the placeholder:

```javascript
// Replace this line:
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

// With your actual Client ID:
const GOOGLE_CLIENT_ID = '123456789-abc123def456.apps.googleusercontent.com';
```

### Step 3: Test the Implementation

1. **Start backend** (if not already running):
   ```bash
   cd backend
   npm start
   ```

2. **Start frontend** (if not already running):
   ```bash
   npm run dev
   ```

3. **Test Registration Flow**:
   - Open http://localhost:5173
   - Click "Create Account" at the bottom
   - Try filling the form manually OR
   - Click "Sign up with Google" button
   - Select your Google account
   - You should be logged in automatically

4. **Test Login Flow**:
   - If you created an account with Google, log out
   - Click "Create Account" → "Sign up with Google"
   - It should recognize you and log you in

## How It Works

### Google Sign-In Flow

1. User clicks "Sign up with Google" button
2. Google OAuth popup appears
3. User selects their Google account
4. Google returns a JWT credential with user info
5. Frontend decodes the JWT to get name, email, picture
6. Frontend sends this to `POST /api/auth/google`
7. Backend checks if user exists:
   - **New user**: Creates account with `auth_provider='google'`, no password
   - **Existing user**: Updates their account to OAuth if needed
8. Backend returns JWT token
9. Frontend stores token and logs user in

### Security Features

- Passwords are hashed with bcrypt for local accounts
- Google OAuth users don't have passwords in the database
- JWT tokens expire after 7 days
- Email uniqueness is enforced at database level
- Google credentials are validated on the backend

## Current User Database

After running `enhanceDatabase.js`, you now have **13 users**:

### Original 5 Users
| Email | Password | Premium |
|-------|----------|---------|
| alex@pawpremium.com | premium123 | ✅ |
| sam@petlover.com | free123 | ❌ |
| emma@premium.com | premium123 | ✅ |
| mike@user.com | free123 | ❌ |
| sarah@premium.com | premium123 | ✅ |

### New 8 Users
| Email | Password | Premium |
|-------|----------|---------|
| jessica@pawconnect.com | user123 | ✅ |
| david@petcare.com | demo123 | ❌ |
| rachel@doglovers.com | user123 | ✅ |
| tom@catowner.com | test123 | ❌ |
| lisa@premium.pet | user123 | ✅ |
| james@user.pet | demo123 | ❌ |
| maria@pawpremium.com | paw123 | ✅ |
| chris@freeuser.com | pet123 | ❌ |

## New API Endpoints

### POST /api/auth/google
**Purpose**: Authenticate or register user via Google OAuth

**Request Body**:
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIs...", // Google JWT token
  "name": "John Doe",
  "email": "john@gmail.com",
  "picture": "https://lh3.googleusercontent.com/..."
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Google authentication successful",
  "data": {
    "user": {
      "id": 14,
      "name": "John Doe",
      "email": "john@gmail.com",
      "isPremium": false,
      "avatarUrl": "https://lh3.googleusercontent.com/..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Email is required for Google authentication"
}
```

## Troubleshooting

### Google Button Not Appearing
- Check that `GOOGLE_CLIENT_ID` is set correctly in `src/main.jsx`
- Verify you're running on `http://localhost:5173` (authorized origin)
- Check browser console for errors

### "Invalid Client" Error
- Your Client ID is incorrect
- The origin (localhost:5173) is not authorized in Google Console
- OAuth consent screen is not configured

### Users Can't Register
- Check backend is running on port 5000
- Verify MySQL database is running
- Check that `users` table has OAuth columns (google_id, auth_provider, avatar_url)

### Database Schema Issues
Run the database enhancement script again:
```bash
cd backend
node enhanceDatabase.js
```

## Files Modified

### Frontend
- ✅ `src/components/Auth/RegisterScreen.jsx` - New file
- ✅ `src/components/Auth/LoginScreen.jsx` - Updated
- ✅ `src/main.jsx` - Wrapped with GoogleOAuthProvider
- ✅ `package.json` - Added dependencies

### Backend
- ✅ `backend/controllers/authController.js` - Added googleAuth()
- ✅ `backend/routes/authRoutes.js` - Added POST /google route
- ✅ `backend/enhanceDatabase.js` - Database migration script

### Database
- ✅ `users` table - Added google_id, auth_provider, avatar_url columns
- ✅ `users` table - Made password column nullable
- ✅ Inserted 8 new sample users

## Next Steps

1. ✅ Get Google OAuth Client ID
2. ✅ Update `src/main.jsx` with your Client ID
3. ✅ Test registration with Google
4. ✅ Test manual registration (email/password)
5. ✅ Test login with both methods

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify all environment variables are set
4. Make sure both frontend and backend are running
5. Check that MySQL database is accessible

## Security Notes

- Never commit your Google Client ID to public repositories
- Use environment variables in production
- Keep your JWT_SECRET secure
- Enable CORS properly for production domains
- Use HTTPS in production (required by Google OAuth)
