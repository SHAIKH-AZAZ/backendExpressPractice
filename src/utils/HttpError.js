// A tiny error that carries an HTTP status code.
// Instead of writing res.status(400)... everywhere, we `throw` one of these
// and let the global error handler in app.js do the responding.

export default class HttpError extends Error {
  constructor(statusCode, message) {
    super(message); // Error requires the message passed to super()
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}
