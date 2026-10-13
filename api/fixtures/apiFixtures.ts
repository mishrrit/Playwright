import { test as base, expect, APIRequestContext } from "@playwright/test";
import { APIClient } from "../APIClient";
import { APIConfig, APIName, getAPIConfig } from "../config/apiConfig";
import { AuthService } from "../services/AuthService";
import { Logger } from "../utils/logger";

type Fixtures = {
  apiTarget: APIName;
  apiConfigs: Partial<Record<APIName, APIConfig>>;
  apiConfig: APIConfig;
  apiRequest: APIRequestContext;
  bookingApiRequest: APIRequestContext;
  fakeRestApiRequest: APIRequestContext;
  authService: AuthService;
  authToken?: string;
  bookingService?: import("../services/BookingService").BookingService;
  booksService?: import("../services/BooksService").BooksService;
  authorsService?: import("../services/AuthorsService").AuthorsService;
  coverPhotosService?: import("../services/CoverPhotosService").CoverPhotosService;
  activitiesService?: import("../services/ActivitiesService").ActivitiesService;
  usersService?: import("../services/UsersService").UsersService;
};

export const test = base.extend<Fixtures>({
  apiTarget: ["default", { option: true }],
  apiConfigs: [{}, { option: true }],

  apiConfig: async ({ apiTarget, apiConfigs }, use) => {
    await use(apiConfigs[apiTarget] ?? getAPIConfig(apiTarget));
  },

  apiRequest: async ({ apiConfig }, use) => {
    const ctx = await APIClient.create(apiConfig);
    try {
      await use(ctx);
    } finally {
      await ctx.dispose();
    }
  },

  bookingApiRequest: async ({ apiConfigs }, use) => {
    const ctx = await APIClient.create(apiConfigs.booking ?? "booking");
    try {
      await use(ctx);
    } finally {
      await ctx.dispose();
    }
  },

  fakeRestApiRequest: async ({ apiConfigs }, use) => {
    const ctx = await APIClient.create(apiConfigs.fakeRest ?? "fakeRest");
    try {
      await use(ctx);
    } finally {
      await ctx.dispose();
    }
  },

  authService: async ({ apiRequest }, use) => {
    await use(new AuthService(apiRequest));
  },

  authToken: async ({ authService, apiConfig }, use) => {
    try {
      const { body } = await authService.login({
        username: apiConfig.secrets.username!,
        password: apiConfig.secrets.password!,
      });
      const token = (body as any)?.token;
      await use(token);
    } catch (err) {
      Logger.error("Auth fixture failed", err);
      await use(undefined);
    }
  },

  bookingService: async ({ bookingApiRequest }, use) => {
    const { BookingService } = await import("../services/BookingService.js");
    await use(new BookingService(bookingApiRequest));
  },

  booksService: async ({ fakeRestApiRequest }, use) => {
    const { BooksService } = await import("../services/BooksService.js");
    await use(new BooksService(fakeRestApiRequest));
  },

  authorsService: async ({ fakeRestApiRequest }, use) => {
    const { AuthorsService } = await import("../services/AuthorsService.js");
    await use(new AuthorsService(fakeRestApiRequest));
  },

  coverPhotosService: async ({ fakeRestApiRequest }, use) => {
    const { CoverPhotosService } =
      await import("../services/CoverPhotosService.js");
    await use(new CoverPhotosService(fakeRestApiRequest));
  },

  activitiesService: async ({ fakeRestApiRequest }, use) => {
    const { ActivitiesService } =
      await import("../services/ActivitiesService.js");
    await use(new ActivitiesService(fakeRestApiRequest));
  },

  usersService: async ({ fakeRestApiRequest }, use) => {
    const { UsersService } = await import("../services/UsersService.js");
    await use(new UsersService(fakeRestApiRequest));
  },
});

export { expect };
