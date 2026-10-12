import { expect } from "@playwright/test";

type APIResult = { status: number; body: unknown };
type Payload = Record<string, unknown>;
export type ResourceService = {
  list(): Promise<APIResult>;
  create(data: Payload): Promise<APIResult>;
  getById(id: number): Promise<APIResult>;
  update(id: number, data: Payload): Promise<APIResult>;
  delete(id: number): Promise<APIResult>;
};

function expectEcho(body: unknown, payload: Payload) {
  expect(body).toBeTruthy();
  for (const [key, value] of Object.entries(payload)) {
    const actual = (body as Payload)[key];
    if (key === "dueDate" || key === "publishDate") {
      expect(typeof actual).toBe("string");
      expect(Date.parse(actual as string)).toBe(Date.parse(value as string));
    } else {
      expect(actual, `echoed ${key}`).toEqual(value);
    }
  }
}

export async function seededRecord(service: Pick<ResourceService, "list" | "getById">) {
  const list = await service.list();
  expect(list.status).toBe(200);
  expect(Array.isArray(list.body)).toBe(true);
  const records = list.body as Array<{ id: number }>;
  expect(records.length).toBeGreaterThan(0);
  const id = records[0].id;
  expect(Number.isInteger(id)).toBe(true);
  expect(id).toBeGreaterThan(0);
  const get = await service.getById(id);
  expect(get.status).toBe(200);
  expect(get.body).toMatchObject({ id });
  return get.body as Payload & { id: number };
}

export async function verifyResourceContract(
  service: ResourceService,
  payload: Payload,
  changes?: Payload,
) {
  const original = await seededRecord(service);
  await expect(service.getById(0)).rejects.toHaveProperty("status", 404);
  const create = await service.create(payload);
  expect(create.status).toBe(200);
  expectEcho(create.body, payload);
  // FakeRest writes are echoes, not storage operations; never claim persisted CRUD.
  await expect(service.getById(0)).rejects.toHaveProperty("status", 404);

  if (changes) {
    const updatedPayload = { ...original, ...changes };
    const updated = await service.update(original.id, updatedPayload);
    expect(updated.status).toBe(200);
    expectEcho(updated.body, updatedPayload);
    const reread = await service.getById(original.id);
    expect(reread.status).toBe(200);
    for (const key of Object.keys(changes)) {
      expect((reread.body as Payload)[key]).toEqual(original[key]);
    }
  }

  const deleted = await service.delete(original.id);
  expect(deleted.status).toBe(200);
  const afterDelete = await service.getById(original.id);
  expect(afterDelete.status).toBe(200);
  expect(afterDelete.body).toMatchObject({ id: original.id });
  for (const key of Object.keys(changes ?? {})) {
    expect((afterDelete.body as Payload)[key]).toEqual(original[key]);
  }
}

export async function expectValidationError(operation: Promise<APIResult>, field: string) {
  await expect(operation).rejects.toMatchObject({
    status: 400,
    body: {
      status: 400,
      errors: { [`$.${field}`]: expect.any(Array) },
    },
  });
}
