const HttpError = require("./HttpError");

class NotFoundError extends HttpError {
  constructor(message = "Not Found") {
    super(message, 404);
    this.name = "NotFound";
  }
}

module.exports = NotFoundError;
