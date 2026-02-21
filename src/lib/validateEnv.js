// Environment variable validation utility
// This ensures all required env vars are set before the app starts

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'BUCKET',
  'REGION',
  'ACCESS_KEY_ID',
  'SECRET_ACCESS_KEY',
];

export function validateEnvVars() {
  const missing = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please set these in your AWS Amplify Console under Environment Variables.`
    );
  }

  return true;
}

// For quick checks in API routes
export function checkRequiredEnv(...vars) {
  const missing = vars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing environment variables: ${missing.join(', ')}`
    );
  }
  
  return true;
}
