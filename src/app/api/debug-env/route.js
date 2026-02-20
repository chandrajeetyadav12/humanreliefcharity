import { NextResponse } from "next/server";

// DIAGNOSTIC ROUTE - Delete after troubleshooting!
// This route helps debug environment variable issues in AWS Amplify

export async function GET() {
  const envVars = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    BUCKET: process.env.BUCKET,
    REGION: process.env.REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  };

  const result = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    envVarsPresent: {},
    envVarsPreviews: {},
    totalEnvVars: Object.keys(process.env).length,
  };

  // Check which vars are present
  for (const [key, value] of Object.entries(envVars)) {
    result.envVarsPresent[key] = !!value;
    
    if (value) {
      // Show preview (safe - doesn't expose full value)
      if (key === "MONGODB_URI") {
        result.envVarsPreviews[key] = value.substring(0, 20) + "...";
      } else if (["JWT_SECRET", "SECRET_ACCESS_KEY"].includes(key)) {
        result.envVarsPreviews[key] = value.substring(0, 10) + "..." + value.substring(value.length - 5);
      } else {
        result.envVarsPreviews[key] = value;
      }
    } else {
      result.envVarsPreviews[key] = "NOT SET";
    }
  }

  // Count how many are set
  const setCount = Object.values(result.envVarsPresent).filter(Boolean).length;
  result.summary = `${setCount} of 6 required environment variables are set`;

  if (setCount === 6) {
    result.status = "✅ All environment variables are set!";
  } else {
    result.status = "❌ Some environment variables are missing!";
    result.missing = Object.entries(result.envVarsPresent)
      .filter(([_, isSet]) => !isSet)
      .map(([key]) => key);
  }

  return NextResponse.json(result, { status: 200 });
}
