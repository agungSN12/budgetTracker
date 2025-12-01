const HttpError = require("./HttpError");

class UnauthorizedError extends HttpError {
  constructor(message = "Error Unauthorized") {
    super(message, 401);
    this.name = "Error Unauthorized";
  }
}

module.exports = UnauthorizedError;
