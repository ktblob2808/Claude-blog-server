const ServiceError = require('./ServiceError');

class UploadError extends ServiceError {
  constructor(message = 'File upload error', code = 400) {
    super(message, code);
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.code = 400;
  }

  response() {
    return {
      code: this.code,
      msg: this.message,
      data: null
    };
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.code = 403;
  }

  response() {
    return {
      code: this.code,
      msg: this.message,
      data: null
    };
  }
}

class NotFoundError extends ServiceError {
  constructor(message = 'Resource not found', code = 404) {
    super(message, code);
  }
}

class UnknownError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.name = 'UnknownError';
    this.code = code;
  }

  response() {
    return {
      code: this.code,
      msg: this.message,
      data: null
    };
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
