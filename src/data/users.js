// DATA LAYER — MongoDB queries.
// Same 6 exported functions as before (findAll, findById, ...), but now
// they're async because the database lives in another process.
// No controller knows anything about MongoDB.

import { ObjectId } from "mongodb";
import { getDb } from "./db.js";

const users = () => getDb().collection("users");

// ---------- Shape translation ----------
// Database docs look like { _id: ObjectId, name, email, createdAt }
// Our API answers look like { id, name, email }.
// This is the ONLY place that knows both shapes.

function toApi(doc) {
  if (!doc) return null;
  return { id: doc._id.toString(), name: doc.name, email: doc.email };
}

// A URL param is a string; Mongo needs an ObjectId.
// Garbage in the URL → null → controller replies 404 (not a crash).
function toOid(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

// ---------- Queries ----------

export async function findAll() {
  const docs = await users().find().sort({ _id: 1 }).toArray();
  return docs.map(toApi);
}

export async function findById(id) {
  const oid = toOid(id);
  if (!oid) return null;
  return toApi(await users().findOne({ _id: oid }));
}

export async function findByEmail(email) {
  return toApi(await users().findOne({ email }));
}

// ---------- Mutations ----------

export async function create({ name, email }) {
  const { insertedId } = await users().insertOne({
    name,
    email,
    createdAt: new Date(),
  });
  return toApi(await users().findOne({ _id: insertedId }));
}

export async function update(id, { name, email }) {
  const oid = toOid(id);
  if (!oid) return null;

  const doc = await users().findOneAndUpdate(
    { _id: oid },
    { $set: { name, email, updatedAt: new Date() } },
    { returnDocument: "after" } // return the NEW doc, not the old one
  );
  return toApi(doc);
}

export async function remove(id) {
  const oid = toOid(id);
  if (!oid) return null;
  return toApi(await users().findOneAndDelete({ _id: oid }));
}
