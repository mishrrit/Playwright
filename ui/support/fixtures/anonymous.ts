import { test as base } from "./base";

export const test = base.extend({
  storageState: { cookies: [], origins: [] },
});
export { expect } from "./base";
