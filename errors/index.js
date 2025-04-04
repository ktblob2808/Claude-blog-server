const ServiceError = require('./ServiceError');

class UploadError extends ServiceError {
  constructor(message = 'File upload error', code = 400) {
    super(message, code);
  }
}

class ForbiddenError extends ServiceError {
  constructor(message = 'Access forbidden', code = 403) {
    super(message, code);
  }
}

class ValidationError extends ServiceError {
  constructor(message = 'Validation error', code = 400) {
    super(message, code);
  }
}

class NotFoundError extends ServiceError {
  constructor(message = 'Resource not found', code = 404) {
    super(message, code);
  }
}

class UnknownError extends ServiceError {
  constructor(message = 'Unknown error occurred', code = 500) {
    super(message, code);
  }
}

module.exports = {
  ServiceError,
  UploadError,
  ForbiddenError,
  ValidationError,
  NotFoundError,
  UnknownError
};
