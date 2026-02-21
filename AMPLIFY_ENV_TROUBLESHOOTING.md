# AWS Amplify Environment Variables Troubleshooting

## ❌ "MONGODB_URI not defined" Error Despite Adding Variables

If you're seeing this error even after adding environment variables in AWS Amplify Console, follow these steps:

---

## 🔧 Step 1: Verify Variable Names (Case-Sensitive!)

AWS Amplify environment variables are **case-sensitive**. Check for exact spelling:

### ✅ Correct Names:
```
MONGODB_URI       (not mongodb_uri or MONGODB_URL)
JWT_SECRET        (not JWT_TOKEN_SECRET or jwt_secret)
BUCKET            (not bucket or S3_BUCKET)
REGION            (not region or AWS_REGION)
ACCESS_KEY_ID     (not access_key_id or AWS_ACCESS_KEY_ID)
SECRET_ACCESS_KEY (not secret_access_key or AWS_SECRET_ACCESS_KEY)
```

### How to Check:
1. Go to: **AWS Amplify Console → Your App → Environment variables**
2. Click **"Manage variables"**
3. Verify each variable name **exactly** matches the list above

---

## 🔄 Step 2: Redeploy After Adding Variables

**CRITICAL**: Environment variables only apply to NEW builds, not existing ones!

### Option A - Redeploy from Console:
1. Go to: **AWS Amplify Console → Your App**
2. Find your branch (usually "main")
3. Click the **"Redeploy this version"** button

### Option B - Push a New Commit:
```bash
git add .
git commit -m "Trigger redeploy for env vars" --allow-empty
git push
```

---

## 🧹 Step 3: Clear Build Cache

Sometimes AWS Amplify caches old builds.

### In AWS Amplify Console:
1. Go to: **Build settings**
2. Scroll down to **"Build image"**
3. Click **"Edit"**
4. Toggle **"Clear build cache"** ON
5. Save and trigger a new build

---

## 🔍 Step 4: Check Build Logs

Verify variables are being detected:

1. Go to: **AWS Amplify Console → Your App**
2. Click on the **latest build**
3. Click **"Build logs"**
4. Look for this line in the logs:
   ```
   Environment variables: X detected
   ```
   Should show: **"Environment variables: 6 detected"**

If it shows less than 6, your variables weren't saved properly.

---

## 🚫 Step 5: Common Mistakes

### Mistake 1: Adding Quotes
**❌ Wrong:**
```
Variable: MONGODB_URI
Value: "mongodb+srv://user:pass@cluster..."
```

**✅ Correct:**
```
Variable: MONGODB_URI
Value: mongodb+srv://user:pass@cluster...
```

### Mistake 2: Extra Spaces
**❌ Wrong:**
```
Variable: MONGODB_URI 
Value:  mongodb+srv://...  
```
(Note the trailing spaces)

**✅ Correct:**
```
Variable: MONGODB_URI
Value: mongodb+srv://...
```
(No extra spaces)

### Mistake 3: Using Wrong Tab
Make sure you're adding variables in:
- ✅ **Environment variables** (App settings section)
- ❌ NOT in "Environment" or "Backend environment"

---

## 🔐 Step 6: Verify MongoDB Connection String

Your MongoDB URI might have special characters that need encoding:

### Check Your MongoDB URI Format:
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

### If password has special characters:
URL-encode them:
- `@` → `%40`
- `!` → `%21`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

**Example:**
```
Password: Pass@123!
Encoded:  Pass%40123%21
URI: mongodb+srv://user:Pass%40123%21@cluster...
```

---

## 📊 Step 7: Check CloudWatch Logs

For runtime errors (not build errors):

1. Go to: **AWS Amplify Console → Your App → Monitoring**
2. Click **"View logs in CloudWatch"**
3. Look for the error message
4. Check if it says "MONGODB_URI not defined" or shows connection errors

---

## 🧪 Step 8: Test with Diagnostic Route

I've created a diagnostic API route for you to check environment variables.

**Route created:** `src/app/api/debug-env/route.js`

### How to Use:

1. Make sure the route is deployed (commit and push if needed)
2. Visit: `https://your-app.amplifyapp.com/api/debug-env`
3. Check the JSON response

**Expected output if variables are set:**
```json
{
  "timestamp": "2026-02-20T...",
  "nodeEnv": "production",
  "envVarsPresent": {
    "MONGODB_URI": true,
    "JWT_SECRET": true,
    "BUCKET": true,
    "REGION": true,
    "ACCESS_KEY_ID": true,
    "SECRET_ACCESS_KEY": true
  },
  "envVarsPreviews": {
    "MONGODB_URI": "mongodb+srv://user:...",
    "JWT_SECRET": "your_super..._andom",
    "BUCKET": "my-bucket-name",
    "REGION": "us-east-1",
    "ACCESS_KEY_ID": "AKIAIOSFOD...",
    "SECRET_ACCESS_KEY": "wJalrXUtnF...PLEKEY"
  },
  "summary": "6 of 6 required environment variables are set",
  "status": "✅ All environment variables are set!"
}
```

**If variables are missing:**
```json
{
  "summary": "0 of 6 required environment variables are set",
  "status": "❌ Some environment variables are missing!",
  "missing": ["MONGODB_URI", "JWT_SECRET", "BUCKET", "REGION", "ACCESS_KEY_ID", "SECRET_ACCESS_KEY"],
  "envVarsPreviews": {
    "MONGODB_URI": "NOT SET",
    "JWT_SECRET": "NOT SET",
    ...
  }
}
```

### ⚠️ IMPORTANT: Delete This Route After Testing!

This route is for debugging only. Delete it after you've confirmed your environment variables are working:

```bash
rm src/app/api/debug-env/route.js
git add .
git commit -m "Remove diagnostic route"
git push
```

---

## ✅ Step 9: Complete Checklist

Go through this checklist:

- [ ] All 6 environment variables added in AWS Amplify Console
- [ ] Variable names are EXACTLY correct (case-sensitive)
- [ ] No quotes around values
- [ ] No extra spaces before/after values
- [ ] Clicked "Save" after adding variables
- [ ] Triggered a NEW deployment (old builds don't have new env vars)
- [ ] Build logs show "Environment variables: 6 detected"
- [ ] MongoDB Atlas allows connections from AWS (0.0.0.0/0 for testing)
- [ ] MongoDB URI uses correct format with encoded special characters
- [ ] Waited for build to complete successfully
- [ ] Tested the diagnostic route (optional)

---

## 🆘 Still Not Working?

### Last Resort Options:

1. **Delete and Re-add Variables:**
   - Delete all 6 variables
   - Save
   - Re-add them one by one
   - Save
   - Redeploy

2. **Check AWS Amplify Service Role:**
   - Go to: **AWS Amplify Console → App settings → General**
   - Verify the service role has proper permissions

3. **Try a Different Branch:**
   - Create a new branch
   - Add environment variables to that branch
   - Deploy the new branch

4. **Contact AWS Support:**
   - If nothing works, there might be an AWS Amplify issue
   - Check AWS Status page
   - Contact AWS Support with your build ID

---

## 📧 Need More Help?

If you've gone through all these steps and it still doesn't work, provide:

1. Screenshot of your environment variables page (hide values)
2. Build logs (copy the environment variables section)
3. CloudWatch logs showing the error
4. Output from the diagnostic route
