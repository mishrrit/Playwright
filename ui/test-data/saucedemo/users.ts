import data from "./users.json";

export const USER_KEYS = ["standard", "locked", "problem", "perf", "error", "visual"] as const;
export type UserKey = typeof USER_KEYS[number];

export interface SauceDemoUser {
  readonly key: UserKey;
  readonly username: string;
  readonly password: string;
}

export function parseUsers(value: unknown): readonly SauceDemoUser[] {
  if (!Array.isArray(value) || value.length !== USER_KEYS.length) {
    throw new Error("SauceDemo data must contain exactly one account for each supported key");
  }
  const keys = new Set<UserKey>();
  const usernames = new Set<string>();
  const accounts = value.map((entry: unknown) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Each SauceDemo account must be an object");
    }
    const { key, username, password } = entry as Record<string, unknown>;
    if (typeof key !== "string" || !USER_KEYS.includes(key as UserKey)) {
      throw new Error("Unsupported SauceDemo account key");
    }
    if (typeof username !== "string" || !username.trim() ||
        typeof password !== "string" || !password.trim()) {
      throw new Error("SauceDemo accounts require non-empty username and password strings");
    }
    if (keys.has(key as UserKey) || usernames.has(username)) {
      throw new Error("Duplicate SauceDemo account key or username");
    }
    keys.add(key as UserKey);
    usernames.add(username);
    return Object.freeze({ key: key as UserKey, username, password });
  });
  return Object.freeze(accounts);
}

const users = parseUsers(data);
export const usersByKey: Readonly<Record<UserKey, SauceDemoUser>> = Object.freeze(
  Object.fromEntries(users.map((user) => [user.key, user])) as Record<UserKey, SauceDemoUser>,
);
export default users;
