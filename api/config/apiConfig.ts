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

const env = (process.env.NODE_ENV as Env) || "dev";

export const API_CONFIG: APIConfig = {
  env,
  baseUrl: process.env.API_BASE_URL || "https://api.dev.example.com",
  timeoutMs: Number(process.env.API_TIMEOUT_MS || 15000),
  defaultHeaders: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  retry: {
    attempts: Number(process.env.API_RETRY_ATTEMPTS || 3),
    backoffMs: 300,
    maxBackoffMs: 5000,
  },
  secrets: {
    apiKey: process.env.API_KEY,
    username: process.env.API_USER,
    password: process.env.API_PASS,
  },
};
