// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// export default async function dbConnect() {
//   if (mongoose.connection.readyState >= 1) return;
//   return mongoose.connect(MONGODB_URI);
// }
import mongoose from "mongoose";
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("CRITICAL: MONGODB_URI environment variable is not set in AWS Amplify");
    console.error("Go to: AWS Amplify Console → Your App → Environment Variables");
    throw new Error(
      "MONGODB_URI not defined. Please set it in AWS Amplify Environment Variables."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, //  prevents buffering timeout
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

