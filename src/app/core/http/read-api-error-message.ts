export function readApiErrorMessage(body: unknown): string | null {
  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (!body || typeof body !== 'object') {
    return null;
  }

  const apiError = body as { error?: unknown; message?: unknown };

  if (typeof apiError.error === 'string' && apiError.error.trim()) {
    return apiError.error;
  }

  if (typeof apiError.message === 'string' && apiError.message.trim()) {
    return apiError.message;
  }

  return null;
}
