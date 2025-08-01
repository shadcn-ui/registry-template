/**
 * A utility function for making JSON API requests with proper error handling
 */
export async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json();
}