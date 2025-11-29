// backend/src/utils/errors.js
export class AppError extends Error {
  constructor(status, type, title, detail, instance) {
    super(title);
    this.status = status;
    this.type = type;
    this.title = title;
    this.detail = detail;
    this.instance = instance;
  }

  toProblemDetail() {
    return {
      type: this.type || 'about:blank',
      title: this.title,
      status: this.status,
      detail: this.detail,
      instance: this.instance,
    };
  }
}

export class NotFoundError extends AppError {
  constructor(detail, instance) {
    super(404, 'https://problems.osaan.fi/not-found', 'Not Found', detail, instance);
  }
}

export class ValidationError extends AppError {
  constructor(detail, instance) {
    super(400, 'https://problems.osaan.fi/validation-error', 'Validation Error', detail, instance);
  }
}

export class UnauthorizedError extends AppError {
  constructor(detail, instance) {
    super(401, 'https://problems.osaan.fi/unauthorized', 'Unauthorized', detail, instance);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(detail, instance) {
    super(
      503,
      'https://problems.osaan.fi/service-unavailable',
      'Service Unavailable',
      detail,
      instance
    );
  }
}
