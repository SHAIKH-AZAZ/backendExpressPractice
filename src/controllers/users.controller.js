// CONTROLLER LAYER — talks HTTP to the data layer.
// Two changes from Step 4:
//   1. Handlers are `async` (the database is async) — no try/catch needed,
//      Express 5 forwards rejected promises to the global error handler.
//   2. Ids are STRINGS now ("66f1c..."), not numbers — MongoDB ids.

import * as store from "../data/users.js";
import HttpError from "../utils/HttpError.js";
import { validateUser } from "../utils/validate.js";

export async function listUsers(req, res) {
  const users = await store.findAll();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
}

export async function getUser(req, res) {
  const user = await store.findById(req.params.id);

  if (!user) throw new HttpError(404, `User with id ${req.params.id} not found`);

  res.status(200).json({ success: true, data: user });
}

export async function createUser(req, res) {
  const errors = validateUser(req.body);
  if (errors.length) throw new HttpError(400, errors.join(", "));

  const { name, email } = req.body;

  if (await store.findByEmail(email)) {
    throw new HttpError(409, "A user with this email already exists");
  }

  const user = await store.create({ name: name.trim(), email: email.trim() });

  res.status(201).json({ success: true, data: user });
}

export async function updateUser(req, res) {
  const errors = validateUser(req.body);
  if (errors.length) throw new HttpError(400, errors.join(", "));

  const user = await store.update(req.params.id, {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
  });

  if (!user) throw new HttpError(404, `User with id ${req.params.id} not found`);

  res.status(200).json({ success: true, data: user });
}

export async function deleteUser(req, res) {
  const deleted = await store.remove(req.params.id);

  if (!deleted) throw new HttpError(404, `User with id ${req.params.id} not found`);

  res.status(200).json({ success: true, data: deleted });
}
