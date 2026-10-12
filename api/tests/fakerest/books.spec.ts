import { test, expect } from "../../fixtures/apiFixtures";
import { verifyResourceContract, expectValidationError } from "./contractAssertions";

test.describe("FakeRest API - Books", () => {
  test("List books returns array", async ({ fakeRestService }) => {
    const { status, body } = await fakeRestService!.listBooks();
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("Non-persistent create/read/update/delete endpoint contracts", async ({
    fakeRestService,
  }) => {
    const book = {
      id: 0,
      title: "Integration Test Book",
      description: "created by automated test",
      pageCount: 123,
      excerpt: "",
      publishDate: new Date().toISOString(),
    };

    const service = fakeRestService!;
    await verifyResourceContract({
      list: () => service.listBooks(),
      create: (data) => service.createBook(data),
      getById: (id) => service.getBook(id),
      update: (id, data) => service.updateBook(id, data),
      delete: (id) => service.deleteBook(id),
    }, book, { title: "Updated Title" });
  });

  test("Get non-existent book returns 404", async ({ fakeRestService }) => {
    const id = 9999999;
    await expect(async () => {
      await fakeRestService!.getBook(id);
    }).rejects.toHaveProperty("status", 404);
  });

  test("Create with invalid pageCount returns a 400 validation error", async ({
    fakeRestService,
  }) => {
    await expectValidationError(
      fakeRestService!.createBook({ pageCount: "not-a-number" }),
      "pageCount",
    );
  });

  test("Edge: create very large title", async ({ fakeRestService }) => {
    const book = {
      id: 0,
      title: "x".repeat(2000),
      description: "edge",
      pageCount: 1,
      excerpt: "",
      publishDate: new Date().toISOString(),
    };
    const res = await fakeRestService!.createBook(book);
    expect(res.status).toBe(200);
    const created = res.body as any;
    await fakeRestService!.deleteBook(created.id);
  });

  test("Edge: boundary pageCount values", async ({ fakeRestService }) => {
    const zero = {
      id: 0,
      title: "Zero",
      description: "",
      pageCount: 0,
      excerpt: "",
      publishDate: new Date().toISOString(),
    };
    const high = {
      id: 0,
      title: "High",
      description: "",
      pageCount: 2147483647,
      excerpt: "",
      publishDate: new Date().toISOString(),
    };
    const zr = await fakeRestService!.createBook(zero as any);
    expect(zr.status).toBe(200);
    await fakeRestService!.deleteBook((zr.body as any).id);
    const hr = await fakeRestService!.createBook(high as any);
    expect(hr.status).toBe(200);
    await fakeRestService!.deleteBook((hr.body as any).id);
  });
});
