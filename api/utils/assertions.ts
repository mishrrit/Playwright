import { validateSchema } from "./validator";
import { expect } from "@playwright/test";

export function assertStatus(actual: number, expected: number) {
  expect(actual, `Expected HTTP status ${expected} but got ${actual}`).toBe(
    expected,
  );
}

export function assertSchema(schema: object, data: any) {
  const { valid, errors } = validateSchema(schema, data);
  expect(valid, `Schema validation failed: ${JSON.stringify(errors)}`).toBe(
    true,
  );
}

export function assertBodyContains(actual: any, subset: any) {
  for (const k of Object.keys(subset)) {
    expect((actual as any)[k]).toEqual((subset as any)[k]);
  }
}
