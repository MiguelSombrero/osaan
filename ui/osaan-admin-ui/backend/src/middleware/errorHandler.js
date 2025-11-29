import { AppError } from '../utils/errors.js';

export function errorHandler(err, req, res, _next) {
  console.error('[Error]', err);

  // If it's our custom AppError, use its ProblemDetail
  if (err instanceof AppError) {
    return res.status(err.status).type('application/problem+json').json(err.toProblemDetail());
  }

  // OIDC/Auth errors
  if (err.statusCode === 401 || err.status === 401) {
    return res
      .status(401)
      .type('application/problem+json')
      .json({
        type: 'https://problems.osaan.fi/unauthorized',
        title: 'Unauthorized',
        status: 401,
        detail: err.message || 'Authentication required',
        instance: req.originalUrl,
      });
  }

  // Unknown errors - don't leak internal details
  const status = err.status || err.statusCode || 500;
  res
    .status(status)
    .type('application/problem+json')
    .json({
      type: 'about:blank',
      title: status === 500 ? 'Internal Server Error' : 'Error',
      status,
      detail: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
      instance: req.originalUrl,
    });
}
