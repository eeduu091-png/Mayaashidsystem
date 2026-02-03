# Admin Account Reset Documentation

## Overview
This document explains how to reset admin accounts to their default state, fixing the issue where users cannot log in due to locked accounts or incorrect passwords.

## Default Admin Credentials

The admin system has **2 default admin accounts** that can be reset:

1. **Admin 1**:
   - Email: `greencorairtime@gmail.com`
   - Password: `Mayaash@@123`

2. **Admin 2**:
   - Email: `Gatutunewton1@gmail.com`
   - Password: `Mayaash@@123`

## How to Reset Admin Account

### Option 1: Using Admin Login Page (Recommended)

1. **Navigate to Admin Login**:
   - Click the "Admin" button on the home page
   - Or go directly to `/admin/login`

2. **Open Reset Form**:
   - Click the **"Reset Admin Account"** button below the login form

3. **Fill Reset Form**:
   - Admin Email: Enter the email of the account you want to reset
   - Current Password: Enter the current password for verification

4. **Submit Reset**:
   - Click **"Reset Account"** button
   - Account will be reset to default state:
     * `failedAttempts`: 0
     * `lockedUntil`: null
     * `lastLoginAt`: null
   - Password remains: `Mayaash@@123` (cannot be changed through reset)

### Option 2: Using API Endpoint (Direct)

If you prefer to use the API directly, you can make a POST request to:

**Endpoint**: `/api/admin/reset`

**Request Body**:
```json
{
  "email": "greencorairtime@gmail.com",
  "password": "Mayaash@@123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Admin account reset to default state"
}
```

**Using curl**:
```bash
curl -X POST http://localhost:3000/api/admin/reset \
  -H "Content-Type: application/json" \
  -d '{"email":"greencorairtime@gmail.com","password":"Mayaash@@123"}'
```

**Using Postman/Fetch**:
```javascript
fetch('http://localhost:3000/api/admin/reset', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'greencorairtime@gmail.com',
    password: 'Mayaash@@123'
  })
})
```

## What Gets Reset

When an admin account is reset:
- ✅ **Failed Attempts**: Set to 0
- ✅ **Lockout**: Removed (account is not locked)
- ✅ **Last Login**: Cleared
- ✅ **Default Password**: Remains `Mayaash@@123` (cannot be changed)
- ✅ **Password Change Required**: Set to true (for next login)
- ✅ **Redirect Behavior**: User will be prompted to change password on next login

## Security Notes

1. **Account Lockout**:
   - After 5 failed login attempts, account is locked for 15 minutes
   - Resetting an account does NOT remove the lockout
   - User can immediately log in after reset

2. **Password Change**:
   - After reset, user MUST change password before accessing dashboard
   - This is enforced at the login level
   - User will be redirected to `/admin/change-password`

3. **Default Password**:
   - The default password `Mayaash@@123` should be kept secure
   - Do NOT share default passwords with unauthorized personnel
   - Consider changing default passwords after initial setup

## Files Modified

1. **Created**:
   - `/src/app/api/admin/reset/route.ts` - Reset API endpoint
   - `/src/app/admin/login/page.tsx` - Updated with reset functionality

2. **Fixed**:
   - `/src/app/api/admin/login/route.ts` - Removed SQLite incompatible `mode: 'insensitive'`

## Troubleshooting

### Issue: Account Locked
If you see "Account locked for X minutes" error:
1. Wait for 15 minutes
2. Try logging in again
3. If issue persists, use the reset function

### Issue: Wrong Password
If login fails with "Invalid credentials":
1. Verify email and password are correct
2. Check for typos
3. Use the reset function to restore access

### Issue: Cannot Log In After Reset
After reset, you're prompted to change password:
1. Set a new password (minimum 6 characters)
2. Complete password change
3. Log in with new password
4. Access dashboard

## Technical Details

### Database Schema
The `Admin` model includes:
- `id` - Primary key
- `email` - Admin email address (unique)
- `password` - Bcrypt hashed password
- `failedAttempts` - Counter for lockout
- `lockedUntil` - Timestamp when account unlocks
- `lastLoginAt` - Last successful login timestamp
- `requiresPasswordChange` - Boolean flag for first login

### Reset API Implementation
```typescript
// POST /api/admin/reset
// Validates admin credentials
// Resets failedAttempts to 0, lockedUntil to null, lastLoginAt to null
// Keeps password unchanged (uses bcrypt.compare to verify)
// Returns success/error response
```

## Support Contacts
For any issues with admin accounts:
- Email: serabsales@gmail.com
- Phone: 0747047555

## Summary

The reset functionality provides administrators with a secure way to restore access to their accounts without requiring database modifications or server restarts. The reset is immediate and can be performed through the admin login page UI or via direct API call.
