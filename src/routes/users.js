// ROUTE LAYER — pure URL → function mapping. No logic lives here.

import { Router } from "express";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

// GET    /users      → list all
// GET    /users/:id  → get one
// POST   /users      → create
// PUT    /users/:id  → update
// DELETE /users/:id  → delete
router.get("/", listUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
