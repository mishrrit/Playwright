import { test, expect } from "../../fixtures/apiFixtures";
import { verifyResourceContract, expectValidationError } from "./contractAssertions";

test.describe("FakeRest API - Books", () => {
  test("List books returns array", async ({ booksService }) => {
    const { status, body } = await booksService!.list();
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("Non-persistent create/read/update/delete endpoint contracts", async ({
    booksService,
  }) => {
    const book = {
      id: 0,
      title: "Integration Test Book",
      description: "created by automated test",
      pageCount: 123,
      excerpt: "",
      publishDate: new Date().toISOString(),
    };

    await verifyResourceContract(booksService!, book, { title: "Updated Title" });
  });

  test("Get non-existent book returns 404", async ({ booksService }) => {
    const id = 9999999;
    await expect(async () => {
      await booksService!.getById(id);
    }).rejects.toHaveProperty("status", 404);
  });

  test("Create with invalid pageCount returns a 400 validation error", async ({
    booksService,
  }) => {
    await expectValidationError(
      booksService!.create({ pageCount: "not-a-number" }),
      "pageCount",
    );
  });

  test("Edge: create very large title", async ({ booksService }) => {
    const book = {
      id: 0,
      title: "x".repeat(2000),
      description: "edge",
      pageCount: 1,
      excerpt: "",
      publishDate: new Date().toISOString(),
    };
    const res = await booksService!.create(book);
    expect(res.status).toBe(200);
    const created = res.body as any;
    await booksService!.delete(created.id);
  });

  test("Edge: boundary pageCount values", async ({ booksService }) => {
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
    const zr = await booksService!.create(zero as any);
    expect(zr.status).toBe(200);
    await booksService!.delete((zr.body as any).id);
    const hr = await booksService!.create(high as any);
    expect(hr.status).toBe(200);
    await booksService!.delete((hr.body as any).id);
  });
});
