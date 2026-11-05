// DATA LAYER — the "database".
// This file knows NOTHING about HTTP, req, res, or status codes.
// Its only job: store and manipulate data.

export const users = [
  { id: 1, name: "Azaz", email: "azaz@example.com" },
  { id: 2, name: "Rahul", email: "rahul@example.com" },
];

// ---------- Queries ----------

export function findAll() {
  return users;
}

export function findById(id) {
  return users.find((u) => u.id === id);
}

export function findByEmail(email) {
  return users.find((u) => u.email === email);
}

// ---------- Mutations ----------

export function create({ name, email }) {
  // Math.max over every existing id + 1 → never produces a duplicate id
  const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const user = { id, name, email };
  users.push(user);
  return user;
}

export function update(id, { name, email }) {
  const user = findById(id);
  if (!user) return null;

  user.name = name;
  user.email = email;
  return user;
}

export function remove(id) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const [deleted] = users.splice(index, 1);
  return deleted;
}
