import { test, expect } from "@playwright/test";
import {
  ResourceService,
  verifyResourceContract,
  expectValidationError,
} from "../fakerest/contractAssertions";

function service(overrides: Partial<ResourceService> = {}): ResourceService {
  const original = { id: 1, title: "Seeded" };
  return {
    list: async () => ({ status: 200, body: [original] }),
    create: async (data) => ({ status: 200, body: data }),
    getById: async (id) => {
      if (id === 0) throw Object.assign(new Error("Not found"), { status: 404 });
      return { status: 200, body: original };
    },
    update: async (_id, data) => ({ status: 200, body: data }),
    delete: async () => ({ status: 200, body: null }),
    ...overrides,
  };
}

const payload = { id: 0, title: "New" };
const changes = { title: "Updated" };

test("accepts a complete non-persistent contract", async () => {
  await verifyResourceContract(service(), payload, changes);
});

for (const [name, overrides] of Object.entries({
  "wrong create status": { create: async () => ({ status: 500, body: payload }) },
  "corrupted create echo": { create: async () => ({ status: 200, body: { ...payload, title: "Wrong" } }) },
  "corrupted update echo": { update: async () => ({ status: 200, body: { id: 1, title: "Wrong" } }) },
  "failed delete": { delete: async () => ({ status: 500, body: null }) },
  "empty seeded list": { list: async () => ({ status: 200, body: [] }) },
} satisfies Record<string, Partial<ResourceService>>)) {
  test(`rejects ${name}`, async () => {
    await expect(verifyResourceContract(service(overrides), payload, changes)).rejects.toThrow();
  });
}

test("negative assertions reject successful responses and server errors", async () => {
  await expect(expectValidationError(Promise.resolve({ status: 200, body: {} }), "title"))
    .rejects.toThrow();
  const error = Object.assign(new Error("Server error"), { status: 500 });
  await expect(expectValidationError(Promise.reject(error), "title")).rejects.toThrow();
});

test("negative assertions require the offending field in the 400 response", async () => {
  const error = Object.assign(new Error("Bad request"), {
    status: 400, body: { status: 400, errors: { "$.title": ["Invalid string"] } },
  });
  await expectValidationError(Promise.reject(error), "title");
  await expect(expectValidationError(Promise.reject(error), "pageCount")).rejects.toThrow();
});
