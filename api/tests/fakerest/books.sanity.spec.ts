/*
{
  "id": "TC-BOOKS-010",
  "location": "api/tests/fakerest/books.sanity.spec.ts",
  "category": "sanity",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";
import { verifyResourceContract, expectValidationError } from "./contractAssertions";

const basePayload = {
  id: 0,
  title: "Sanity Test Book",
  description: "created by automated sanity test",
  pageCount: 42,
  excerpt: "",
  publishDate: new Date().toISOString(),
};

test.describe("Books sanity - CRUD and negative cases", () => {
  test("Non-persistent CRUD endpoint contracts", async ({ booksService }) => {
    await verifyResourceContract(booksService!, basePayload, { title: "Sanity Updated" });
  });

  test("Negative: get non-existent id returns 404", async ({
    booksService,
  }) => {
    await expect(async () => {
      await booksService!.getById(999999999);
    }).rejects.toHaveProperty("status", 404);
  });

  test("Negative: invalid pageCount returns a 400 validation error", async ({
    booksService,
  }) => {
    await expectValidationError(
      booksService!.create({ ...basePayload, pageCount: "not-a-number" }),
      "pageCount",
    );
  });
});
