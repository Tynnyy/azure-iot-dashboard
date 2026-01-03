# Supabase Setup for IoT Dashboard

## Fix Row Level Security (RLS) Policies

If you're getting error: `"new row violates row-level security policy for table \"locations\""`, you need to set up RLS policies.

### Option 1: Run SQL in Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **ixhkqzuajyyzylbolsni**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `fix-rls-policies.sql`
6. Click **Run** or press `Ctrl+Enter`

### Option 2: Quick Fix - Disable RLS (For Development Only)

If you just want to test quickly, you can temporarily disable RLS:

```sql
-- WARNING: This makes your tables publicly accessible!
-- Only use for development/testing

ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensors DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data DISABLE ROW LEVEL SECURITY;
```

**Note:** This is NOT recommended for production. Use Option 1 instead.

### Verify the Fix

After running the SQL, try:
1. Go to `/register-sensor` on your dashboard
2. Fill out the form and submit
3. The sensor should register successfully

### What the Policies Do

The RLS policies allow:
- ✅ Authenticated users: Full access to all tables (read, insert, update, delete)
- ✅ Anonymous users: Read and insert access (for Python simulator to work without auth)

This matches the demo application requirements where all users have access to all sensors and data.
