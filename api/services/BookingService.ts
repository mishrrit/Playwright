import { BaseAPI } from "../base/BaseAPI";
import { APIRequestContext } from "@playwright/test";

export class BookingService extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async create(data: any) {
    const url = this.buildUrl("/booking");
    const res = await this.request.post(url, { data });
    return this.handleResponse(res);
  }

  async list() {
    const url = this.buildUrl("/booking");
    const res = await this.request.get(url);
    return this.handleResponse(res);
  }

  async getById(id: number | string) {
    const url = this.buildUrl(`/booking/${id}`);
    const res = await this.request.get(url);
    return this.handleResponse(res);
  }

  async update(id: number | string, data: any, token?: string) {
    const url = this.buildUrl(`/booking/${id}`);
    const headers = token ? { Cookie: `token=${token}` } : undefined;
    const res = await this.request.put(url, { data, headers });
    return this.handleResponse(res);
  }

  async partialUpdate(id: number | string, data: any, token?: string) {
    const url = this.buildUrl(`/booking/${id}`);
    const headers = token ? { Cookie: `token=${token}` } : undefined;
    const res = await this.request.patch(url, { data, headers });
    return this.handleResponse(res);
  }

  async delete(id: number | string, token?: string) {
    const url = this.buildUrl(`/booking/${id}`);
    const headers = token ? { Cookie: `token=${token}` } : undefined;
    const res = await this.request.delete(url, { headers });
    return this.handleResponse(res);
  }

  async auth(username: string, password: string) {
    const url = this.buildUrl(`/auth`);
    const res = await this.request.post(url, { data: { username, password } });
    return this.handleResponse(res);
  }

  async ping() {
    const url = this.buildUrl(`/ping`);
    const res = await this.request.get(url);
    return this.handleResponse(res);
  }
}
