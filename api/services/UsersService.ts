import { BaseAPI } from "../base/BaseAPI";
import { APIRequestContext } from "@playwright/test";

export class UsersService extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async list() {
    const url = this.buildUrl("/api/v1/Users");
    const res = await this.request.get(url, { headers: this.defaultHeaders });
    return this.handleResponse(res);
  }

  async create(data: any) {
    const url = this.buildUrl("/api/v1/Users");
    const res = await this.request.post(url, {
      headers: { ...this.defaultHeaders, "Content-Type": "application/json; v=1.0" },
      data: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async getById(id: number | string) {
    const url = this.buildUrl(`/api/v1/Users/${id}`);
    const res = await this.request.get(url, { headers: this.defaultHeaders });
    return this.handleResponse(res);
  }

  async update(id: number | string, data: any) {
    const url = this.buildUrl(`/api/v1/Users/${id}`);
    const res = await this.request.put(url, {
      headers: { ...this.defaultHeaders, "Content-Type": "application/json" },
      data: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async delete(id: number | string) {
    const url = this.buildUrl(`/api/v1/Users/${id}`);
    const res = await this.request.delete(url, {
      headers: this.defaultHeaders,
    });
    return this.handleResponse(res);
  }
}
