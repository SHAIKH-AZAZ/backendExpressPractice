// DATABASE LAYER — connection + schema setup.
// Reads the connection string from .env (Bun loads .env automatically).

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is missing — check your .env file");
}

const client = new MongoClient(uri);
let db = null;

export async function connectDb() {
  await client.connect(); // throws if the container isn't running
  db = client.db(); // database name comes from the URI path (/backend_basics)
  await db.command({ ping: 1 }); // proves we really can talk to the server

  await ensureSchema(db);
  return db;
}

async function ensureSchema(db) {
  const users = db.collection("users");

  // MongoDB enforces this itself → no duplicate emails, ever,
  // even if two requests arrive at the exact same millisecond.
  await users.createIndex({ email: 1 }, { unique: true });

  // Seed only on the very first run
  if ((await users.countDocuments()) === 0) {
    await users.insertMany([
      { name: "Azaz", email: "azaz@example.com", createdAt: new Date() },
      { name: "Rahul", email: "rahul@example.com", createdAt: new Date() },
    ]);
    console.log("Seeded 2 users into MongoDB");
  }
}

export function getDb() {
  if (!db) throw new Error("Database not connected — call connectDb() first");
  return db;
}
