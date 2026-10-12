/*
{
  "id": "TC-BOOKS-002",
  "location": "api/tests/fakerest/books.smoke.spec.ts",
  "category": "smoke",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test } from "../../fixtures/apiFixtures";
import { verifyResourceContract } from "./contractAssertions";

const sampleBook = {
  id: 0,
  title: "Integration Test Book",
  description: "created by automated smoke test",
  pageCount: 10,
  excerpt: "",
  publishDate: new Date().toISOString(),
};

test("Books smoke: non-persistent list/create/get/delete contracts", async ({ booksService }) => {
  await verifyResourceContract(booksService!, sampleBook);
});
