class ServiceError extends Error {
  constructor(message = 'An error occurred', code = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }

  response() {
    return {
        code: this.code,
        msg: this.message,
        data: null
    }

  }
}

module.exports = ServiceError;
