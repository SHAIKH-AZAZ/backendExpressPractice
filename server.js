// ENTRY POINT — connect to the database, then start listening.

import app from "./src/app.js";
import { connectDb } from "./src/data/db.js";

const PORT = process.env.PORT ?? 3000;

try {
  await connectDb(); // top-level await: don't accept traffic until the DB is ready
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  console.error("Is the container running?  →  npm run db:up");
  process.exit(1); // fail fast instead of serving broken requests
}

app.listen(PORT, () => {
  console.log(`Server is running on :: http://localhost:${PORT}`);
});
