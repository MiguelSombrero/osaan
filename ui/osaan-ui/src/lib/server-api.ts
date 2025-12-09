import { getAccessToken } from './session';
import { config } from './config';

export async function fetchWithAuth<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options?.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  const response = await fetch(`${config.targetApiUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

export async function proxyRequest(
  method: string,
  path: string,
  body?: any,
  params?: Record<string, string>
) {
  const token = await getAccessToken();

  const url = new URL(`${config.targetApiUrl}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return {
    status: response.status,
    data: await response.json().catch(() => null),
    headers: response.headers,
  };
}
