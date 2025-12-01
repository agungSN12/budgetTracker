const HttpError = require("./HttpError");

class ErrorForbidden extends HttpError {
  constructor(message = "Error Forbidden") {
    super(message, 403);
    this.name = "Error Forbidden";
  }
}

module.exports = ErrorForbidden;
