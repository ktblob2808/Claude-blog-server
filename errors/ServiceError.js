class ServiceError extends Error {
  constructor(message = 'An error occurred', code = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }

  response() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        type: this.name
      }
    };
  }
}

module.exports = ServiceError;
