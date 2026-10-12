/*
{
  "id": "TC-AUTH-001",
  "location": "api/tests/fakerest/authors.smoke.spec.ts",
  "category": "smoke",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test } from "../../fixtures/apiFixtures";
import { seededRecord, verifyResourceContract } from "./contractAssertions";

const sampleAuthor = {
  id: 0,
  idBook: 0,
  firstName: "Smoke",
  lastName: "Author",
};

test("Authors smoke: non-persistent list/create/get/delete contracts", async ({
  authorsService,
  booksService,
}) => {
  const book = await seededRecord(booksService!);
  await verifyResourceContract(authorsService!, { ...sampleAuthor, idBook: book.id });
});
