import dotenv from "dotenv";
dotenv.config();

export type Env = "local" | "dev" | "staging" | "prod";

export interface APIConfig {
  env: Env;
  baseUrl: string;
  timeoutMs: number;
  defaultHeaders: Record<string, string>;
  retry: { attempts: number; backoffMs: number; maxBackoffMs: number };
  secrets: { apiKey?: string; username?: string; password?: string };
}

export const API_TARGETS = {
  default: { prefix: "API", baseUrl: "https://api.dev.example.com" },
  booking: {
    prefix: "BOOKING_API",
    baseUrl: "https://restful-booker.herokuapp.com",
  },
  fakeRest: {
    prefix: "FAKEREST_API",
    baseUrl: "https://fakerestapi.azurewebsites.net",
  },
} as const;

export type APIName = keyof typeof API_TARGETS;

export function normalizeBaseUrl(value: string): string {
  const cleaned = value.trim().replace(/^['"]+|['"]+$/g, "").trim();
  let url: URL;
  try {
    url = new URL(cleaned);
  } catch {
    throw new Error("API base URL must be an absolute HTTP(S) URL");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "API base URL must use HTTP(S) without credentials, query or fragment",
    );
  }
  // A trailing slash preserves gateway prefixes when resolving relative endpoints.
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
  return url.toString();
}

export function getAPIConfig(
  name: APIName = "default",
  variables: NodeJS.ProcessEnv = process.env,
): APIConfig {
  if (!Object.prototype.hasOwnProperty.call(API_TARGETS, name)) {
    throw new Error(`Unknown API target: ${name}`);
  }
  const target = API_TARGETS[name];
  const configuredUrl = variables[`${target.prefix}_BASE_URL`]
    ?.trim()
    .replace(/^['"]+|['"]+$/g, "")
    .trim();
  return {
    env: (variables.NODE_ENV as Env) || "dev",
    baseUrl: normalizeBaseUrl(configuredUrl || target.baseUrl),
    timeoutMs: Number(
      variables[`${target.prefix}_TIMEOUT_MS`] || variables.API_TIMEOUT_MS || 15000,
    ),
    defaultHeaders: {
      Accept: "application/json; v=1.0",
      "Content-Type": "application/json",
    },
    retry: {
      attempts: Number(
        variables[`${target.prefix}_RETRY_ATTEMPTS`] || variables.API_RETRY_ATTEMPTS || 3,
      ),
      backoffMs: 300,
      maxBackoffMs: 5000,
    },
    secrets: {
      apiKey: variables[`${target.prefix}_KEY`],
      username: variables[`${target.prefix}_USER`],
      password: variables[`${target.prefix}_PASS`],
    },
  };
}

export const API_CONFIG: APIConfig = getAPIConfig();
