import { BaseAPI } from "../base/BaseAPI";
import { APIRequestContext } from "@playwright/test";

/**
 * AuthService - authentication endpoints
 */
export class AuthService extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Login with username/password. Returns token and user info.
   */
  async login(payload: { username: string; password: string }) {
    const url = this.buildUrl("/auth/login");
    const res = await this.request.post(url, { data: payload });
    return await this.handleResponse(res);
  }

  async logout(token: string) {
    const url = this.buildUrl("/auth/logout");
    const res = await this.request.post(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await this.handleResponse(res);
  }
}
