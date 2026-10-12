/*
{
  "id": "TC-COV-010",
  "location": "api/tests/fakerest/coverphotos.sanity.spec.ts",
  "category": "sanity",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test } from "../../fixtures/apiFixtures";
import { seededRecord, verifyResourceContract, expectValidationError } from "./contractAssertions";

const baseCover = {
  id: 0,
  idBook: 0,
  url: "https://example.com/cover.jpg",
};

test.describe("CoverPhotos sanity - CRUD and negative cases", () => {
  test("Non-persistent CRUD endpoint contracts", async ({ coverPhotosService, booksService }) => {
    const book = await seededRecord(booksService!);
    await verifyResourceContract(
      coverPhotosService!,
      { ...baseCover, idBook: book.id },
      { url: "https://example.com/updated.jpg" },
    );
  });

  test("Negative: create invalid cover payload", async ({
    coverPhotosService,
  }) => {
    await expectValidationError(
      coverPhotosService!.create({ idBook: "not-a-number" }),
      "idBook",
    );
  });
});
