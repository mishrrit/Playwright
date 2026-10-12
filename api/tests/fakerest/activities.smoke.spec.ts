/*
{
  "id": "TC-ACT-001",
  "location": "api/tests/fakerest/activities.smoke.spec.ts",
  "category": "smoke",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test } from "../../fixtures/apiFixtures";
import { verifyResourceContract } from "./contractAssertions";

const sampleActivity = {
  id: 0,
  title: "Smoke Activity",
  dueDate: new Date().toISOString(),
  completed: false,
};

test("Activities smoke: non-persistent list/create/get/delete contracts", async ({
  activitiesService,
}) => {
  await verifyResourceContract(activitiesService!, sampleActivity);
});
