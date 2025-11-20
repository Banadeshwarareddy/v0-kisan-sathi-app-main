# Login Authentication Fix

## Issue
Login was failing with "Login failed. Please check your credentials" error.

## Root Cause
The Django REST Framework default permission class was set to `IsAuthenticatedOrReadOnly`, which requires authentication for all POST requests. This prevented unauthenticated users from accessing the login and signup endpoints.

## Solution
Added `permission_classes = [AllowAny]` to the following views in `farmers/views.py`:
- `SignupAPIView`
- `LoginAPIView`
- `VerifyOTPView`

## Test Accounts
You can now login with either of these accounts:

### Account 1
- Phone: `+919876543210` or `9876543210`
- Password: `test123`

### Account 2
- Phone: `+916366673457` or `6366673457`
- Password: `test123`

## How to Login
1. Go to http://localhost:3000/login
2. Enter phone number (with or without +91 prefix)
3. Enter password: `test123`
4. Click Login

The frontend automatically normalizes phone numbers, so you can enter:
- `+919876543210`
- `919876543210`
- `9876543210`

All formats will work correctly.

## Changes Made
- Updated `farmers/views.py` to add `AllowAny` permission to authentication endpoints
- Restarted Django server to apply changes
- Reset password for both test accounts to `test123`
