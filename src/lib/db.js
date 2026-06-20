import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Don't throw at import time so the build doesn't fail; throw on first use.
  console.warn("[db] MONGODB_URI is not set");
}

// Reuse the connection across hot reloads / serverless invocations.
let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default connectDB;
