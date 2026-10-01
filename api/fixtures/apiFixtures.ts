import { test as base, expect, APIRequestContext } from "@playwright/test";
import { APIClient } from "../APIClient";
import { API_CONFIG } from "../config/apiConfig";
import { AuthService } from "../services/AuthService";
import { Logger } from "../utils/logger";

type Fixtures = {
  apiRequest: APIRequestContext;
  authService: AuthService;
  authToken?: string;
};

export const test = base.extend<Fixtures>({
  apiRequest: async ({}, use) => {
    const ctx = await APIClient.create();
    await use(ctx);
    await ctx.dispose();
  },

  authService: async ({ apiRequest }, use) => {
    await use(new AuthService(apiRequest));
  },

  authToken: async ({ authService }, use) => {
    try {
      const { body } = await authService.login({
        username: API_CONFIG.secrets.username!,
        password: API_CONFIG.secrets.password!,
      });
      const token = (body as any)?.token;
      await use(token);
    } catch (err) {
      Logger.error("Auth fixture failed", err);
      await use(undefined);
    }
  },
});

export { expect };
