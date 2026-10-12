/*
{
  "id": "TC-COV-001",
  "location": "api/tests/fakerest/coverphotos.smoke.spec.ts",
  "category": "smoke",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test } from "../../fixtures/apiFixtures";
import { seededRecord, verifyResourceContract } from "./contractAssertions";

const sampleCover = {
  id: 0,
  idBook: 0,
  url: "https://example.com/cover.jpg",
};

test("CoverPhotos smoke: non-persistent list/create/get/delete contracts", async ({
  coverPhotosService,
  booksService,
}) => {
  const book = await seededRecord(booksService!);
  await verifyResourceContract(coverPhotosService!, { ...sampleCover, idBook: book.id });
});
