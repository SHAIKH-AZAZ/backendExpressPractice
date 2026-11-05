// APP LAYER — builds the Express app (middleware + routes).
// It does NOT start a server — that's server.js's job.

import express from "express";
import usersRouter from "./routes/users.js";

const app = express();

// ---------- Middleware ----------
app.use(express.json());

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Server is running !!!",
  });
});

app.use("/users", usersRouter);

// Demo: proves the error handler catches anything thrown in a route.
app.get("/boom", () => {
  throw new Error("intentional explosion"); // no status code → 500
});

// ---------- 404: no route matched ----------
// Registered AFTER all routes, so it only fires when nothing above matched.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
});

// ---------- Global error handler ----------
// Must be LAST, and must declare all 4 params (err, req, res, next) —
// Express identifies error handlers by arity.
// Any `throw` in a controller lands here automatically.
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;

  // Never leak internal details to the client
  const message = status === 500 ? "Internal server error" : err.message;

  if (status === 500) console.error(err); // log it for ourselves

  res.status(status).json({ success: false, message });
});

export default app;
