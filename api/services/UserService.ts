import { BaseAPI } from "../base/BaseAPI";
import { APIRequestContext } from "@playwright/test";
import { UserDTO } from "../models/User";

export class UserService extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async create(user: UserDTO) {
    const url = this.buildUrl("/users");
    const res = await this.request.post(url, { data: user });
    return this.handleResponse(res);
  }

  async getById(id: string) {
    const url = this.buildUrl(`/users/${id}`);
    const res = await this.request.get(url);
    return this.handleResponse(res);
  }

  async update(id: string, payload: Partial<UserDTO>) {
    const url = this.buildUrl(`/users/${id}`);
    const res = await this.request.patch(url, { data: payload });
    return this.handleResponse(res);
  }

  async delete(id: string) {
    const url = this.buildUrl(`/users/${id}`);
    const res = await this.request.delete(url);
    return this.handleResponse(res);
  }

  async list(query?: Record<string, string | number>) {
    const q = query ? `?${new URLSearchParams(query as any).toString()}` : "";
    const url = this.buildUrl(`/users${q}`);
    const res = await this.request.get(url);
    return this.handleResponse(res);
  }
}
