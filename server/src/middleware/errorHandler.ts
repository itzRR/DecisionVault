import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Log error without sensitive data
  console.error(`[Error] ${err.name}: ${err.message}`);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ZodError) {
    statusCode = 400;
    const issues = err.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
    message = `Validation failed: ${issues}`;
  } else if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof AuthError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  } else if (err.message?.includes('Gemini') || err.message?.includes('generate content')) {
    statusCode = 503;
    message = 'AI analysis is temporarily unavailable. Please try again.';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
