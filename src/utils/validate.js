// VALIDATION LAYER — returns a list of problems.
// [] means "valid". Never touches req/res, so it's reusable
// and unit-testable without a server.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUser(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return ["Request body must be a JSON object"];
  }

  const errors = [];

  if (typeof body.name !== "string" || body.name.trim() === "") {
    errors.push("name is required and must be a non-empty string");
  }

  if (typeof body.email !== "string" || !EMAIL_REGEX.test(body.email)) {
    errors.push("email is required and must be a valid email address");
  }

  // Optional fields: warn but don't block
  if (body.age !== undefined && (!Number.isInteger(body.age) || body.age < 0)) {
    errors.push("age must be a positive integer if provided");
  }

  return errors;
}
