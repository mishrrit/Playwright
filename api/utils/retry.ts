export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  backoffMs = 300,
  maxBackoffMs = 5000,
): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts - 1) break;
      const wait = Math.min(backoffMs * 2 ** i, maxBackoffMs);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}
