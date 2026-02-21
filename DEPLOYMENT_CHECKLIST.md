# 🚀 AWS Amplify Deployment Checklist

## ⚠️ BEFORE DEPLOYING - Set Environment Variables

Go to: **AWS Amplify Console → Your App → Environment variables → Manage variables**

Add these 6 variables (click "Add variable" for each):

```
✅ MONGODB_URI
   Example: mongodb+srv://username:password@cluster.mongodb.net/database

✅ JWT_SECRET
   Example: your-super-secret-random-string-minimum-32-characters-long

✅ BUCKET
   Example: my-s3-bucket-name

✅ REGION
   Example: us-east-1

✅ ACCESS_KEY_ID
   Example: AKIAIOSFODNN7EXAMPLE

✅ SECRET_ACCESS_KEY
   Example: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

## ⚠️ Common Mistakes to Avoid:

- ❌ Adding quotes around values: `"mongodb://..."` 
- ✅ Correct: `mongodb://...`

- ❌ Adding spaces: ` my-value `
- ✅ Correct: `my-value`

- ❌ Wrong variable names: `MONGODB_URL`, `JWT_TOKEN`
- ✅ Correct: `MONGODB_URI`, `JWT_SECRET`

- ❌ Wrong region format: `US-EAST-1`
- ✅ Correct: `us-east-1`

## 📋 Deployment Steps:

1. ✅ Set all 6 environment variables in AWS Amplify Console
2. ✅ Click "Save" after adding variables
3. ✅ Trigger a new deployment (push commit or click "Redeploy")
4. ✅ Check build logs for "Environment variables: 6 detected"
5. ✅ Test your app

## 🔍 If Build Fails:

### Check 1: Build Logs
- Go to: AWS Amplify → App → Latest Build → Build logs
- Look for: "Environment variables: X detected"
- Should show: 6 variables

### Check 2: CloudWatch Logs (Runtime Errors)
- Go to: AWS Amplify → App → Monitoring → View logs
- Look for: "CRITICAL:" messages
- Shows: Which env var is missing

### Check 3: Verify MongoDB Connection
- Whitelist AWS IP range in MongoDB Atlas
- For testing: Allow connections from anywhere (0.0.0.0/0)
- Go to: MongoDB Atlas → Network Access → Add IP Address

### Check 4: Verify S3 Bucket
- Bucket exists in specified region
- IAM user has S3 permissions:
  - `s3:PutObject`
  - `s3:GetObject`
  - `s3:DeleteObject`

## 🎯 Quick Test:

After deployment, test these endpoints:

1. **Health check** (should work without auth):
   ```
   GET https://your-app.amplifyapp.com/api/members
   ```

2. **Login** (tests JWT_SECRET and MONGODB_URI):
   ```
   POST https://your-app.amplifyapp.com/api/auth/login
   Body: { "identifier": "your-aadhaar-or-email", "password": "your-password" }
   ```

3. **Upload test** (tests S3 config):
   - Try uploading an image through your app

## 📞 Still Having Issues?

1. Check [AWS_AMPLIFY_FIX.md](AWS_AMPLIFY_FIX.md) for detailed troubleshooting
2. Verify all environment variables are set correctly (no typos!)
3. Check MongoDB Atlas allows connections from AWS
4. Ensure S3 bucket and IAM credentials are valid
5. Review CloudWatch logs for specific error messages

## ✅ Success Indicators:

- ✅ Build completes without errors
- ✅ "Environment variables: 6 detected" in build logs
- ✅ App loads in browser
- ✅ Can log in successfully
- ✅ Can create/upload data
- ✅ No "CRITICAL:" errors in CloudWatch logs
