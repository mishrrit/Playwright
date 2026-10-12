import { APIRequestContext, request } from "@playwright/test";
import {
  APIConfig,
  APIName,
  getAPIConfig,
  normalizeBaseUrl,
} from "./config/apiConfig";

/**
 * APIClient - helper to create Playwright APIRequestContext instances
 */
export class APIClient {
  static async create(
    target: APIName | APIConfig = "default",
  ): Promise<APIRequestContext> {
    const config = typeof target === "string" ? getAPIConfig(target) : target;
    return await request.newContext({
      baseURL: normalizeBaseUrl(config.baseUrl),
      extraHTTPHeaders: config.defaultHeaders,
      timeout: config.timeoutMs,
    });
  }
}
