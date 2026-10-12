import { APIRequestContext, APIResponse } from "@playwright/test";
import { Logger } from "../utils/logger";

/**
 * BaseAPI - common behavior for services (headers, auth, error handling)
 */
export abstract class BaseAPI {
  protected request: APIRequestContext;
  // Defaults come from the selected request context; services may add overrides.
  protected defaultHeaders: Record<string, string> = {};

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected buildUrl(path: string) {
    const endpoint = path.trim();
    if (
      /^[a-z][a-z\d+.-]*:/i.test(endpoint) ||
      endpoint.startsWith("//") ||
      endpoint.includes("\\")
    ) {
      throw new Error("API endpoints must be relative to their configured host");
    }
    return endpoint.replace(/^\/+/, "");
  }

  protected async handleResponse(res: APIResponse) {
    const status = res.status();
    const headers = res.headers();
    let body: unknown = null;
    try {
      const text = await res.text();
      body = text ? JSON.parse(text) : null;
    } catch {
      body = await res.text();
    }
    Logger.debug("Response", { status, headers, body });
    if (status >= 400) {
      const err = new Error(`HTTP ${status} - ${JSON.stringify(body)}`);
      (err as any).status = status;
      (err as any).body = body;
      throw err;
    }
    return { status, headers, body };
  }
}
