/*
{
  "id": "TC-ACT-010",
  "location": "api/tests/fakerest/activities.sanity.spec.ts",
  "category": "sanity",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";
import { expectValidationError } from "./contractAssertions";

const baseAct = {
  id: 0,
  title: "Sanity Activity",
  dueDate: new Date().toISOString(),
  completed: false,
};

test.describe("Activities sanity - CRUD and negative cases", () => {
  test("CRUD endpoint contracts on the non-persistent FakeRest API", async ({
    activitiesService,
  }) => {
    const service = activitiesService!;
    const create = await service.create(baseAct);
    expect(create.status).toBe(200);
    expect(create.body).toMatchObject({
      id: baseAct.id,
      title: baseAct.title,
      completed: baseAct.completed,
    });

    // FakeRest echoes writes but does not persist them; read a seeded activity.
    await expect(service.getById(baseAct.id)).rejects.toHaveProperty("status", 404);
    const list = await service.list();
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    const activities = list.body as Array<{ id: number }>;
    expect(activities.length).toBeGreaterThan(0);
    const id = activities[0].id;

    const get = await service.getById(id);
    expect(get.status).toBe(200);
    expect(get.body).toMatchObject({ id });

    const payload = { ...(get.body as Record<string, unknown>), title: "Updated" };
    const updated = await service.update(id, payload);
    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject(payload);

    const deleted = await service.delete(id);
    expect(deleted.status).toBe(200);

    const afterDelete = await service.getById(id);
    expect(afterDelete.status).toBe(200);
    expect(afterDelete.body).toMatchObject({
      id,
      title: (get.body as { title: string }).title,
    });
  });

  test("Negative: create invalid activity payload", async ({
    activitiesService,
  }) => {
    await expectValidationError(activitiesService!.create({ title: 123 }), "title");
  });
});
