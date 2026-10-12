/*
{
  "id": "TC-AUTH-010",
  "location": "api/tests/fakerest/authors.sanity.spec.ts",
  "category": "sanity",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test } from "../../fixtures/apiFixtures";
import { seededRecord, verifyResourceContract, expectValidationError } from "./contractAssertions";

const baseAuthor = {
  id: 0,
  idBook: 0,
  firstName: "Sanity",
  lastName: "Author",
};

test.describe("Authors sanity - CRUD and negative cases", () => {
  test("Non-persistent CRUD endpoint contracts", async ({ authorsService, booksService }) => {
    const book = await seededRecord(booksService!);
    await verifyResourceContract(
      authorsService!,
      { ...baseAuthor, idBook: book.id },
      { firstName: "SanityUpdated" },
    );
  });

  test("Negative: create invalid author payload", async ({
    authorsService,
  }) => {
    await expectValidationError(authorsService!.create({ firstName: 1 }), "firstName");
  });
});
