import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_CONFIG } from "../config/apiConfig";
import { Logger } from "../utils/logger";

/**
 * BaseAPI - common behavior for services (headers, auth, error handling)
 */
export abstract class BaseAPI {
  protected request: APIRequestContext;
  protected baseUrl = API_CONFIG.baseUrl;
  protected defaultHeaders = API_CONFIG.defaultHeaders;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected buildUrl(path: string) {
    return `${this.baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
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
