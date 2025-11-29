export interface ProblemDetail {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
}

export class ApiError extends Error {
  public readonly problem: ProblemDetail;
  public readonly status: number;

  constructor(problem: ProblemDetail) {
    super(problem.title);
    this.name = 'ApiError';
    this.problem = problem;
    this.status = problem.status;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isValidationError(): boolean {
    return this.status === 400;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

export function parseApiError(error: unknown): ApiError {
  // Axios error with response
  if (isAxiosError(error) && error.response) {
    const data = error.response.data;

    if (data && typeof data === 'object' && 'title' in data && 'status' in data) {
      return new ApiError(data as ProblemDetail);
    }

    return new ApiError({
      title: 'Request Failed',
      status: error.response.status,
      detail: typeof data === 'string' ? data : JSON.stringify(data),
    });
  }

  // Network error
  if (isAxiosError(error) && !error.response) {
    return new ApiError({
      title: 'Network Error',
      status: 0,
      detail: 'Unable to connect to the server. Please check your internet connection.',
    });
  }

  return new ApiError({
    title: 'Unexpected Error',
    status: 500,
    detail: error instanceof Error ? error.message : 'An unexpected error occurred',
  });
}

function isAxiosError(error: unknown): error is import('axios').AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as { isAxiosError: boolean }).isAxiosError === true
  );
}
