import { S3Client } from "@aws-sdk/client-s3";

// Validate S3 environment variables (lazy - only when accessed)
function validateS3Env() {
  if (!process.env.REGION || !process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY) {
    console.error("CRITICAL: S3 environment variables not set in AWS Amplify");
    console.error("Missing:", {
      REGION: !process.env.REGION,
      ACCESS_KEY_ID: !process.env.ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: !process.env.SECRET_ACCESS_KEY,
    });
    throw new Error(
      "S3 configuration incomplete. Please set REGION, ACCESS_KEY_ID, and SECRET_ACCESS_KEY in AWS Amplify Environment Variables."
    );
  }
}

let s3Instance = null;

function getS3Client() {
  if (!s3Instance) {
    validateS3Env();
    s3Instance = new S3Client({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Instance;
}

// Export a proxy that validates on first use
const s3 = new Proxy({}, {
  get(target, prop) {
    const client = getS3Client();
    const value = client[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

export default s3;
