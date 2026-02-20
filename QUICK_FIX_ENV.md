# 🚨 QUICK FIX: Environment Variables Not Working in AWS Amplify

## The Problem
You added environment variables in AWS Amplify Console, but still getting:
```
"MONGODB_URI not defined. Please set it in AWS Amplify Environment Variables."
```

---

## ⚡ QUICK FIX (Most Common Causes)

### 1️⃣ DID YOU REDEPLOY? (Most Common Issue!)

**Environment variables only work on NEW builds**, not existing ones.

**Fix:**
1. Go to AWS Amplify Console → Your App
2. Click **"Redeploy this version"** button

OR push any commit:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

### 2️⃣ CHECK VARIABLE NAMES (Case-Sensitive!)

Wrong:
- ❌ `mongodb_uri` or `MONGODB_URL`
- ❌ `jwt_secret` or `JWT_TOKEN`
- ❌ `bucket` or `S3_BUCKET`

Correct:
- ✅ `MONGODB_URI` (exactly this!)
- ✅ `JWT_SECRET` (exactly this!)
- ✅ `BUCKET` (exactly this!)
- ✅ `REGION` (exactly this!)
- ✅ `ACCESS_KEY_ID` (exactly this!)
- ✅ `SECRET_ACCESS_KEY` (exactly this!)

---

### 3️⃣ NO QUOTES OR SPACES!

**In AWS Amplify Console, when entering values:**

❌ **WRONG:**
```
Value: "mongodb+srv://user:pass@..."
```

✅ **CORRECT:**
```
Value: mongodb+srv://user:pass@...
```

(No quotes, no spaces before/after)

---

### 4️⃣ USE THE DIAGNOSTIC TOOL

I've created a diagnostic route for you.

**Step 1:** Commit and push the new route:
```bash
git add .
git commit -m "Add diagnostic route"
git push
```

**Step 2:** Wait for deployment to complete

**Step 3:** Visit this URL:
```
https://YOUR-APP-NAME.amplifyapp.com/api/debug-env
```

**Step 4:** Check the response:

✅ **If variables ARE set (GOOD!):**
```json
{
  "status": "✅ All environment variables are set!",
  "summary": "6 of 6 required environment variables are set"
}
```
→ If you see this but still get errors, there's a MongoDB connection issue (see below)

❌ **If variables are NOT set (PROBLEM!):**
```json
{
  "status": "❌ Some environment variables are missing!",
  "missing": ["MONGODB_URI", "JWT_SECRET", ...],
  "summary": "0 of 6 required environment variables are set"
}
```
→ Variables aren't being detected. Go to Step 5.

---

### 5️⃣ VERIFY IN AWS CONSOLE

1. Go to: https://console.aws.amazon.com/amplify/
2. Click your app
3. Click **"Environment variables"** (left sidebar)
4. Click **"Manage variables"**

**You should see exactly this:**

| Variable name | Value |
|--------------|-------|
| `MONGODB_URI` | `mongodb+srv://...` (your connection string) |
| `JWT_SECRET` | `your-secret...` (your secret) |
| `BUCKET` | `your-bucket-name` |
| `REGION` | `us-east-1` (or your region) |
| `ACCESS_KEY_ID` | `AKIAI...` (your key) |
| `SECRET_ACCESS_KEY` | `wJalr...` (your secret) |

**Check:**
- [ ] All 6 variables present?
- [ ] Names spelled EXACTLY as shown?
- [ ] No quotes in values?
- [ ] No extra spaces?

If anything is wrong, **FIX IT**, click **"Save"**, then **REDEPLOY**.

---

### 6️⃣ CHECK BUILD LOGS

1. Go to AWS Amplify Console → Your App
2. Click the latest build
3. Look for this line in the logs:

```
Environment variables: 6 detected
```

**If you see less than 6:**
- Your variables weren't saved properly
- Go back to Step 5 and fix them

---

### 7️⃣ MONGODB CONNECTION STRING ISSUES

Even if environment variables are set, MongoDB connection might fail if:

#### Check MongoDB Atlas Network Access:
1. Go to: MongoDB Atlas → Network Access
2. **For testing**: Add IP `0.0.0.0/0` (allows all connections)
3. **For production**: Get AWS Amplify IP ranges and whitelist them

#### Check Special Characters in Password:
If your MongoDBpassword has special characters, encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |

**Example:**
```
Password: Pass@123!
Encoded:  Pass%40123%21
URI: mongodb+srv://user:Pass%40123%21@cluster.mongodb.net/db
```

---

## 🎯 STEP-BY-STEP CHECKLIST

Follow this in order:

1. [ ] Verify all 6 variables in AWS Amplify Console (Step 5)
2. [ ] Fixed any typos/quotes/spaces
3. [ ] Clicked "Save"
4. [ ] Triggered a NEW deployment (Step 1)
5. [ ] Waited for build to complete
6. [ ] Checked build logs show "Environment variables: 6 detected" (Step 6)
7. [ ] Visited `/api/debug-env` to verify (Step 4)
8. [ ] If all vars are set but still errors, check MongoDB Atlas network access (Step 7)
9. [ ] Encoded special characters in MongoDB password if needed (Step 7)

---

## 📞 STILL NOT WORKING?

See the detailed troubleshooting guide: [AMPLIFY_ENV_TROUBLESHOOTING.md](AMPLIFY_ENV_TROUBLESHOOTING.md)

Or check:
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- [AWS_AMPLIFY_FIX.md](AWS_AMPLIFY_FIX.md)
