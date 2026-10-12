import { APIRequestContext } from "@playwright/test";
import { BaseAPI } from "../base/BaseAPI";

export class FakeRestService extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async listBooks() {
    const res = await this.request.get(this.buildUrl(`/api/v1/Books`), {
      headers: this.defaultHeaders,
    });
    return this.handleResponse(res);
  }

  async createBook(payload: any) {
    const res = await this.request.post(this.buildUrl(`/api/v1/Books`), {
      headers: { ...this.defaultHeaders, "Content-Type": "application/json" },
      data: payload,
    });
    return this.handleResponse(res);
  }

  async getBook(id: number) {
    const res = await this.request.get(this.buildUrl(`/api/v1/Books/${id}`), {
      headers: this.defaultHeaders,
    });
    return this.handleResponse(res);
  }

  async updateBook(id: number, payload: any) {
    const res = await this.request.put(this.buildUrl(`/api/v1/Books/${id}`), {
      headers: { ...this.defaultHeaders, "Content-Type": "application/json" },
      data: payload,
    });
    return this.handleResponse(res);
  }

  async deleteBook(id: number) {
    const res = await this.request.delete(
      this.buildUrl(`/api/v1/Books/${id}`),
      {
        headers: this.defaultHeaders,
      },
    );
    return this.handleResponse(res);
  }
}
