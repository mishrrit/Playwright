import { APIRequestContext, request } from "@playwright/test";
import { API_CONFIG } from "./config/apiConfig";

/**
 * APIClient - helper to create Playwright APIRequestContext instances
 */
export class APIClient {
  static async create(): Promise<APIRequestContext> {
    return await request.newContext({
      baseURL: API_CONFIG.baseUrl,
      extraHTTPHeaders: API_CONFIG.defaultHeaders,
      timeout: API_CONFIG.timeoutMs,
    });
  }
}
