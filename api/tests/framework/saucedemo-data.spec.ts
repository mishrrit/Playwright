import { test, expect } from "@playwright/test";
import users, { parseUsers, usersByKey, USER_KEYS } from "../../../ui/test-data/saucedemo/users";
import source from "../../../ui/test-data/saucedemo/users.json";

test("canonical accounts retain all six identities and keyed access", () => {
  expect(users.map(({ key, username }) => [key, username])).toEqual([
    ["standard", "standard_user"],
    ["locked", "locked_out_user"],
    ["problem", "problem_user"],
    ["perf", "performance_glitch_user"],
    ["error", "error_user"],
    ["visual", "visual_user"],
  ]);
  expect(users.map((user) => user.key)).toEqual([...USER_KEYS]);
  for (const user of users) {
    expect(usersByKey[user.key]).toBe(user);
    expect(user.password.length).toBeGreaterThan(0);
    expect(user).not.toHaveProperty("expected");
  }
});

test("account array, keyed index and records are immutable", () => {
  expect(Object.isFrozen(users)).toBe(true);
  expect(Object.isFrozen(usersByKey)).toBe(true);
  for (const user of users) expect(Object.isFrozen(user)).toBe(true);
  expect(Reflect.set(usersByKey, "problem", usersByKey.standard)).toBe(false);
  expect(Reflect.set(usersByKey.problem, "username", "modified")).toBe(false);
});

test("parser returns independent account records without scenario expectations", () => {
  const input = source.map((user) => ({ ...user, expected: "unused scenario setting" }));
  const parsed = parseUsers(input);
  input[0].username = "modified source";
  expect(parsed[0].username).toBe("standard_user");
  expect(parsed[0]).not.toHaveProperty("expected");
});

const invalidCases: Array<{ name: string; make: () => unknown; error: RegExp }> = [
  { name: "non-array data", make: () => ({}), error: /exactly one account/ },
  { name: "missing account", make: () => source.slice(1), error: /exactly one account/ },
  { name: "non-object account", make: () => [null, ...source.slice(1)], error: /must be an object/ },
  { name: "unknown key", make: () => [{ ...source[0], key: "unknown" }, ...source.slice(1)], error: /Unsupported/ },
  { name: "duplicate key", make: () => [{ ...source[0], key: source[1].key }, ...source.slice(1)], error: /Duplicate/ },
  { name: "duplicate username", make: () => [{ ...source[0], username: source[1].username }, ...source.slice(1)], error: /Duplicate/ },
  { name: "blank username", make: () => [{ ...source[0], username: " " }, ...source.slice(1)], error: /non-empty/ },
  { name: "blank password", make: () => [{ ...source[0], password: " " }, ...source.slice(1)], error: /non-empty/ },
  { name: "invalid password type", make: () => [{ ...source[0], password: 123 }, ...source.slice(1)], error: /non-empty/ },
];

for (const { name, make, error } of invalidCases) {
  test(`canonical data rejects ${name}`, () => {
    expect(() => parseUsers(make())).toThrow(error);
  });
}
