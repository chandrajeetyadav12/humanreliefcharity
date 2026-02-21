# Human Relief Charity Management System

A Next.js-based charity management system for managing donations, applications (Avedans), and user registrations.

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual values
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open in browser:** [http://localhost:3000](http://localhost:3000)

## 🔐 Required Environment Variables

⚠️ **CRITICAL**: These MUST be set before deployment!

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | ✅ Yes |
| `BUCKET` | AWS S3 bucket name | ✅ Yes |
| `REGION` | AWS region (e.g., us-east-1) | ✅ Yes |
| `ACCESS_KEY_ID` | AWS IAM access key | ✅ Yes |
| `SECRET_ACCESS_KEY` | AWS IAM secret key | ✅ Yes |

📄 See [.env.example](.env.example) for detailed setup instructions

## 🌐 Deploy to AWS Amplify

### Before Deployment:

1. **Set Environment Variables** in AWS Amplify Console:
   - Go to: AWS Amplify → Your App → Environment variables
   - Add all 6 required variables (see table above)
   - ⚠️ **DO NOT use quotes** around values!

2. **Follow the deployment checklist:**
   - 📋 [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step guide
   - 📖 [AWS_AMPLIFY_FIX.md](AWS_AMPLIFY_FIX.md) - Complete troubleshooting guide

### Quick Deploy:

```bash
# Build locally to test
npm run build

# Commit and push to trigger deployment
git add .
git commit -m "Deploy to AWS Amplify"
git push
```

### If You See "env not found" Error:

1. ✅ Verify all 6 environment variables are set in AWS Amplify Console
2. ✅ Check for typos (variable names are case-sensitive)
3. ✅ Remove any quotes or spaces from values
4. ✅ Trigger a new deployment after setting variables
5. 📖 See [AWS_AMPLIFY_FIX.md](AWS_AMPLIFY_FIX.md) for detailed solutions

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes (31 endpoints)
│   │   ├── auth/         # Authentication (login, register, logout)
│   │   ├── admin/        # Admin management
│   │   ├── founder/      # Founder management
│   │   ├── avedan/       # Application management
│   │   └── donation/     # Donation handling
│   ├── dashboard/        # User dashboards (admin, founder, user)
│   └── components/       # Shared components
├── lib/
│   ├── dbConnect.js      # MongoDB connection
│   ├── auth.js           # Authentication utilities
│   ├── s3.js             # AWS S3 client
│   └── validateEnv.js    # Environment validation
└── models/               # Mongoose models
```

## 🔧 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run check-env   # Validate environment variables ⭐ NEW
```

### Check Environment Variables:

Before deploying, validate your environment setup:

```bash
# For local development (checks .env.local)
npm run check-env

# Expected output:
# ✅ MONGODB_URI - mongodb+srv://...
# ✅ JWT_SECRET - your_super_...
# ✅ All environment variables are set correctly!
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
