# AWS Amplify Deployment Fix Guide

## 🔍 API RECHECK COMPLETED ✅ (All Issues Fixed)

**Status**: ✅ All 31 API routes verified and production-ready

### Critical Issues Found and Fixed in API Routes:

#### 1. Missing Error Handling (try-catch blocks) ✅
**Routes Fixed:**
- `/api/me/route.js` - Added try-catch
- `/api/admin/donation/pending/route.js` - Added try-catch
- `/api/users/donation/my/route.js` - Added try-catch
- `/api/founder/donation/verify/[id]/route.js` - Added try-catch
- `/api/donation/create/route.js` - Added try-catch

#### 2. Wrong Response Method ✅
- `/api/admin/dashboard/donationinfo/route.js` - Fixed `Response.json` → `NextResponse.json` + added try-catch

#### 3. Console.error Statements Removed ✅
**Files cleaned (15 console statements removed):**
- `/api/users/[id]/route.js` (2 instances)
- `/api/donation/by-type/route.js`
- `/api/members/route.js`
- `/api/contact/route.js`
- `/api/founder/register/route.js` (2 instances)
- `/api/founder/avedan/pending/route.js`
- `/api/avedan/[id]/route.js`
- `/api/avedan/apply/route.js` (2 instances - 1 console.error, 1 commented console.log)
- `/api/auth/register/route.js`
- `/api/auth/login/route.js`
- `/api/admin/register/route.js`
- `/api/admin/avedan/pending/route.js`

### API Routes Statistics:
- **Total API Routes**: 31
- **All routes have try-catch**: ✅
- **All routes use NextResponse**: ✅
- **No console.log/error in production code**: ✅ (only 1 commented line remaining)
- **Proper authentication checks**: ✅
- **Consistent error responses**: ✅

---

## 🔍 PREVIOUS RECHECK SUMMARY

### Additional Issues Found and Fixed:
1. **Security Issue**: Removed console.log statements exposing JWT_SECRET and MONGODB_URI in production
2. **Performance**: Cleaned up debug logs that create unnecessary CloudWatch log entries
3. **Documentation**: Created `.env.example` file for easier setup
4. **Verification**: Confirmed all Mongoose models are correctly configured for serverless

### Files Modified During Previous Recheck:
- ✅ `src/app/api/auth/login/route.js` - Removed sensitive environment variable logging
- ✅ `src/app/api/founder/donation/pending/route.js` - Removed debug log
- ✅ `src/app/dashboard/admin/profile/page.js` - Removed console.log
- ✅ `src/app/dashboard/components/avedan/FounderApprovedAvedans.js` - Removed console.log
- ✅ `src/app/dashboard/components/AvedanInformations/AvedanInfo.js` - Removed console.log
- ✅ `.env.example` - Created with all required variables

---

## ✅ Issues Identified and Fixed (RECHECK COMPLETED)

### 1. Missing amplify.yml Configuration ✅
**Problem**: AWS Amplify didn't know how to build your Next.js application.
**Fix**: Created `amplify.yml` with proper build configuration.

### 2. Next.js Configuration ✅
**Problem**: Default Next.js config wasn't optimized for AWS Amplify.
**Fix**: Updated `next.config.mjs` with:
- Image optimization settings
- Server actions body size limit
- Proper experimental features

### 3. Middleware Issues ✅
**Problem**: Middleware matcher was incorrect and missing error handling.
**Fix**: Updated `middleware.js` with:
- Better error logging for CloudWatch
- JWT_SECRET validation
- Correct path matchers for `/dashboard/admin` and `/dashboard/founder`

### 4. Security: Sensitive Console.log Statements Removed ✅
**Problem**: `console.log` statements in production code exposing sensitive environment variables and creating excessive CloudWatch logs.
**Fix**: Removed console.log statements from:
- `/api/auth/login/route.js` - Was exposing JWT_SECRET and MONGODB_URI
- `/api/founder/donation/pending/route.js` - Removed debug log
- Dashboard components - Cleaned up unnecessary debug logs

### 5. Environment Variables Template Created ✅
**Problem**: No example file for developers to know which variables are required.
**Fix**: Created `.env.example` file with all required environment variables documented.

### 6. MongoDB Model Configuration ✅
**Verified**: All Mongoose models use the correct pattern:
```javascript
mongoose.models.ModelName || mongoose.model("ModelName", schema)
```
This prevents model recompilation errors in serverless environments.

## Required Environment Variables in AWS Amplify

⚠️ **CRITICAL**: You MUST set these environment variables in AWS Amplify Console or the app will fail!

### Step-by-Step: How to Set Environment Variables in AWS Amplify

1. **Go to AWS Amplify Console**: https://console.aws.amazon.com/amplify/
2. **Select your app** from the list
3. **Click "Environment variables"** in the left sidebar (under "App settings")
4. **Click "Manage variables"** button
5. **Add each variable below** by clicking "Add variable"

### Required Variables (Copy these EXACTLY):

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | Your MongoDB connection string |
| `JWT_SECRET` | `your-super-secret-random-string-here-minimum-32-chars` | Secret key for JWT tokens |
| `BUCKET` | `my-charity-bucket` | Your AWS S3 bucket name |
| `REGION` | `us-east-1` | AWS region for S3 |
| `ACCESS_KEY_ID` | `AKIAIOSFODNN7EXAMPLE` | AWS IAM access key |
| `SECRET_ACCESS_KEY` | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | AWS IAM secret key |

### ⚠️ Important Notes:

1. **No quotes needed**: Enter values directly without quotes
   - ✅ Correct: `mongodb+srv://user:pass@cluster...`
   - ❌ Wrong: `"mongodb+srv://user:pass@cluster..."`

2. **No spaces**: Make sure there are no leading/trailing spaces
   - ✅ Correct: `my-bucket-name`
   - ❌ Wrong: ` my-bucket-name ` (has spaces)

3. **Case sensitive**: Variable names must be EXACTLY as shown above

4. **After adding variables**: Click "Save" and then **trigger a new deployment**

### How to Trigger a New Deployment:

**Option 1 - From Amplify Console:**
- Go to your app in Amplify Console
- Click the branch name (usually "main")
- Click "Redeploy this version" button

**Option 2 - Push a commit:**
```bash
git add .
git commit -m "Add environment variables"
git push
```

### Verify Environment Variables are Set:

After deployment, check the build logs:
1. Go to AWS Amplify Console → Your App
2. Click on the latest build
3. Look for "Environment variables" section in the build logs
4. It should show your variables (values will be hidden for security)

### If You See "env not found" Error:

1. **Check CloudWatch Logs**:
   - AWS Amplify Console → Your App → Monitoring → View logs
   - Look for error messages about missing env vars

2. **Verify Variable Names**: Make sure they match EXACTLY (case-sensitive)

3. **Re-save Variables**: Sometimes AWS needs you to re-save
   - Go to Environment variables
   - Edit each variable (don't change, just click Save)
   - Trigger new deployment

4. **Check for Typos**: Common mistakes:
   - `MONGODB_URL` instead of `MONGODB_URI`
   - Extra spaces in values
   - Missing variables
   - Wrong region format (use `us-east-1` not `US-EAST-1`)

## Steps to Deploy

1. **Set Environment Variables**
   - Go to AWS Amplify Console
   - Select your app
   - Go to "Environment variables" in the left sidebar
   - Add all the required variables listed above

2. **Verify Build Settings**
   - Go to "Build settings" in AWS Amplify Console
   - The `amplify.yml` file should be automatically detected
   - If not, you can copy the content from the repository

3. **Redeploy**
   - Trigger a new deployment from AWS Amplify Console
   - Or push a new commit to your connected repository

4. **Check Build Logs**
   - Monitor the build logs in AWS Amplify Console
   - Look for any errors related to missing environment variables
   - Verify that API routes are being deployed

## Common Issues & Solutions

### Issue: "MONGODB_URI not defined" or "env not found" error
**Solutions**:
1. **Verify variables are set in AWS Amplify Console**:
   - Go to: AWS Amplify → Your App → Environment variables
   - Check all 6 required variables are listed
   - Click "Manage variables" and verify no typos

2. **Check variable names are exact** (case-sensitive):
   - ✅ `MONGODB_URI` not `MONGODB_URL` or `mongodb_uri`
   - ✅ `JWT_SECRET` not `JWT_TOKEN_SECRET`
   - ✅ `BUCKET` not `bucket` or `S3_BUCKET`

3. **Remove quotes/spaces from values**:
   - ❌ Wrong: `"mongodb+srv://..."`
   - ✅ Correct: `mongodb+srv://...`

4. **Trigger a redeploy after setting variables**:
   - Environment variables only apply to NEW builds
   - Click "Redeploy this version" in Amplify Console

5. **Check Build Logs**:
   - AWS Amplify → Your App → Latest Build → Build logs
   - Look for "Environment variables: X detected" message
   - Should show all 6 variables (values hidden)

6. **If still failing, check CloudWatch logs**:
   - You'll see the exact error message
   - Look for "CRITICAL:" messages showing which env var is missing

### Issue: "Unauthorized" responses from API
**Solutions**:
- Verify JWT_SECRET is set correctly
- Check that cookies are being sent with requests
- Ensure your MongoDB connection is whitelisted for AWS IP ranges

### Issue: S3 Upload Failures
**Solutions**:
- Verify BUCKET, REGION, ACCESS_KEY_ID, and SECRET_ACCESS_KEY are set
- Ensure the IAM user has proper S3 permissions
- Check bucket CORS configuration

### Issue: 500 Internal Server Error
**Solutions**:
- Check CloudWatch logs in AWS Amplify Console
- Verify all environment variables are set
- Check MongoDB connection string format
- Ensure MongoDB Atlas allows connections from AWS IPs (0.0.0.0/0 for testing)

## Testing API Routes Locally

Before deploying, test locally:

```bash
# Create a .env.local file with your environment variables
npm run dev

# Test API endpoints
curl http://localhost:3000/api/auth/login
```

## Additional Notes

- API routes in Next.js on AWS Amplify run as serverless functions
- Cold starts may cause initial requests to be slower
- MongoDB connections are cached to improve performance
- Ensure your MongoDB cluster allows connections from AWS IP ranges

## Debugging Tips

1. **Check Build Logs**: AWS Amplify Console → Your App → Build → View logs
2. **Check Function Logs**: Use CloudWatch Logs to see runtime errors
3. **Test Environment Variables**: Add console.log in your API routes temporarily
4. **Verify Network**: Ensure MongoDB Atlas/cluster allows AWS connections

## Support

If issues persist:
1. Check AWS Amplify CloudWatch logs
2. Verify MongoDB connection string works from AWS (test with MongoDB Compass)
3. Ensure all environment variables are correctly typed (no extra spaces)
4. Check if your S3 bucket exists and has proper permissions
