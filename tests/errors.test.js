const {
  ServiceError,
  UploadError,
  ForbiddenError,
  ValidationError,
  NotFoundError,
  UnknownError
} = require('../errors');

describe('Custom Error Classes', () => {
  test('ServiceError base class works correctly', () => {
    const error = new ServiceError('Test error', 500);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(500);
    expect(error.name).toBe('ServiceError');
    
    const response = error.response();
    expect(response.success).toBe(false);
    expect(response.error.code).toBe(500);
    expect(response.error.message).toBe('Test error');
    expect(response.error.type).toBe('ServiceError');
  });

  test('UploadError works correctly', () => {
    const error = new UploadError('File too large', 413);
    expect(error.message).toBe('File too large');
    expect(error.code).toBe(413);
    expect(error.name).toBe('UploadError');
    
    const response = error.response();
    expect(response.error.type).toBe('UploadError');
  });

  test('ForbiddenError works correctly', () => {
    const error = new ForbiddenError();
    expect(error.message).toBe('Access forbidden');
    expect(error.code).toBe(403);
    
    const customError = new ForbiddenError('Custom forbidden message', 401);
    expect(customError.message).toBe('Custom forbidden message');
    expect(customError.code).toBe(401);
  });

  test('ValidationError works correctly', () => {
    const error = new ValidationError('Invalid data format');
    expect(error.message).toBe('Invalid data format');
    expect(error.code).toBe(400);
  });

  test('NotFoundError works correctly', () => {
    const error = new NotFoundError('User not found');
    expect(error.message).toBe('User not found');
    expect(error.code).toBe(404);
  });

  test('UnknownError works correctly', () => {
    const error = new UnknownError();
    expect(error.message).toBe('Unknown error occurred');
    expect(error.code).toBe(500);
  });
});
