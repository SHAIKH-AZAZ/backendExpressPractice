// CONTROLLER LAYER — talks HTTP to the data layer.
// Note: instead of `return res.status(400).json(...)` at every check,
// we THROW an HttpError. The global error handler in app.js responds.

import * as store from "../data/users.js";
import HttpError from "../utils/HttpError.js";
import { validateUser } from "../utils/validate.js";

export function listUsers(req, res) {
  const users = store.findAll();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
}

export function getUser(req, res) {
  const id = Number(req.params.id);
  const user = store.findById(id);

  if (!user) throw new HttpError(404, `User with id ${id} not found`);

  res.status(200).json({ success: true, data: user });
}

export function createUser(req, res) {
  const errors = validateUser(req.body);
  if (errors.length) throw new HttpError(400, errors.join(", "));

  const { name, email } = req.body;

  if (store.findByEmail(email)) {
    throw new HttpError(409, "A user with this email already exists");
  }

  const user = store.create({ name: name.trim(), email: email.trim() });

  res.status(201).json({ success: true, data: user });
}

export function updateUser(req, res) {
  const id = Number(req.params.id);

  const errors = validateUser(req.body);
  if (errors.length) throw new HttpError(400, errors.join(", "));

  const user = store.update(id, {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
  });

  if (!user) throw new HttpError(404, `User with id ${id} not found`);

  res.status(200).json({ success: true, data: user });
}

export function deleteUser(req, res) {
  const id = Number(req.params.id);
  const deleted = store.remove(id);

  if (!deleted) throw new HttpError(404, `User with id ${id} not found`);

  res.status(200).json({ success: true, data: deleted });
}
