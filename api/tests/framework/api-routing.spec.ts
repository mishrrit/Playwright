/*
{
  "id": "api-framework-routing-001",
  "suite": "framework",
  "title": "Named API routing and context isolation",
  "priority": "P1",
  "tags": ["api", "framework", "regression"]
}
*/

import { createServer, Server } from "node:http";
import { AddressInfo } from "node:net";
import { APIClient } from "../../APIClient";
import {
  APIConfig,
  APIName,
  getAPIConfig,
  normalizeBaseUrl,
} from "../../config/apiConfig";
import { test as apiTest, expect } from "../../fixtures/apiFixtures";
import { BaseAPI } from "../../base/BaseAPI";
import { UserService } from "../../services/UserService";

async function startServer(name: string) {
  const server = createServer(async (request, response) => {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    const data = Buffer.concat(chunks).toString();
    response.setHeader("Content-Type", "application/json");
    if (request.url?.endsWith("/session")) {
      response.setHeader("Set-Cookie", `session=${name}; Path=/; HttpOnly`);
    }
    if (request.url?.endsWith("/404")) response.statusCode = 404;
    response.end(JSON.stringify({
      server: name,
      path: request.url,
      method: request.method,
      headers: request.headers,
      data: data ? JSON.parse(data) : null,
    }));
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address() as AddressInfo;
  return { server, url: `http://127.0.0.1:${port}` };
}

async function stopServer(server: Server) {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
}

type Hosts = { booking: string; fakeRest: string };
const test = apiTest.extend<{ hosts: Hosts }>({
  hosts: async ({}, use) => {
    const booking = await startServer("booking");
    try {
      const fakeRest = await startServer("fakeRest");
      try {
        await use({ booking: booking.url, fakeRest: fakeRest.url });
      } finally {
        await stopServer(fakeRest.server);
      }
    } finally {
      await stopServer(booking.server);
    }
  },
  apiConfigs: async ({ hosts }, use) => {
    const makeConfig = (name: APIName, baseUrl: string): APIConfig => ({
      ...getAPIConfig(name, {}),
      baseUrl,
      defaultHeaders: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-Service": name,
      },
    });
    await use({
      default: makeConfig("default", `${hosts.booking}/app`),
      booking: makeConfig("booking", `${hosts.booking}/gateway/`),
      fakeRest: makeConfig("fakeRest", `${hosts.fakeRest}/proxy`),
    });
  },
});

test("named APIs have independent defaults and legacy configuration", () => {
  expect(getAPIConfig("booking", {}).baseUrl).toBe("https://restful-booker.herokuapp.com/");
  expect(getAPIConfig("fakeRest", {}).baseUrl).toBe("https://fakerestapi.azurewebsites.net/");
  const variables = {
    API_BASE_URL: "https://legacy.example.test/app",
    API_KEY: "legacy-key",
    API_USER: "legacy-user",
    API_PASS: "legacy-password",
    BOOKING_API_BASE_URL: '  "https://booking.example.test/gateway"  ',
    BOOKING_API_KEY: "booking-key",
    BOOKING_API_USER: "booking-user",
    BOOKING_API_PASS: "booking-password",
    FAKEREST_API_BASE_URL: " https://fake.example.test/edge/ ",
  };
  expect(getAPIConfig("default", variables)).toMatchObject({
    baseUrl: "https://legacy.example.test/app/",
    secrets: { apiKey: "legacy-key", username: "legacy-user", password: "legacy-password" },
  });
  expect(getAPIConfig("booking", variables)).toMatchObject({
    baseUrl: "https://booking.example.test/gateway/",
    secrets: { apiKey: "booking-key", username: "booking-user", password: "booking-password" },
  });
  expect(getAPIConfig("fakeRest", variables)).toMatchObject({
    baseUrl: "https://fake.example.test/edge/",
    secrets: { apiKey: undefined, username: undefined, password: undefined },
  });
  expect(getAPIConfig("fakeRest", { API_BASE_URL: variables.API_BASE_URL }).baseUrl)
    .toBe("https://fakerestapi.azurewebsites.net/");
});

test("normalizes blank settings and isolates mutable defaults", () => {
  expect(getAPIConfig("booking", { BOOKING_API_BASE_URL: ' "" ' }).baseUrl)
    .toBe(getAPIConfig("booking", {}).baseUrl);
  expect(normalizeBaseUrl("https://example.test/gateway///"))
    .toBe("https://example.test/gateway/");
  const booking = getAPIConfig("booking", {
    API_TIMEOUT_MS: "2000",
    BOOKING_API_TIMEOUT_MS: "3500",
    BOOKING_API_RETRY_ATTEMPTS: "5",
  });
  expect(booking.timeoutMs).toBe(3500);
  expect(booking.retry.attempts).toBe(5);
  booking.defaultHeaders.Accept = "text/plain";
  expect(getAPIConfig("booking", {}).defaultHeaders.Accept).toBe("application/json; v=1.0");
  expect(getAPIConfig("fakeRest", { API_TIMEOUT_MS: "2000" }).timeoutMs).toBe(2000);
});

for (const url of ["not-a-url", "/relative", "ftp://example.test", "https://user:pass@example.test", "https://example.test?query=1", "https://example.test#fragment"]) {
  test(`rejects invalid API base URL: ${url}`, async () => {
    expect(() => getAPIConfig("booking", { BOOKING_API_BASE_URL: url })).toThrow(/API base URL/);
    await expect(APIClient.create({ ...getAPIConfig("booking", {}), baseUrl: url }))
      .rejects.toThrow(/API base URL/);
  });
}

test("rejects unknown targets instead of using another host", () => {
  expect(() => getAPIConfig("missing" as APIName, {})).toThrow("Unknown API target");
});

test("all service fixtures select the right host and preserve base path prefixes", async ({
  bookingService, fakeRestService, booksService, authorsService,
  coverPhotosService, activitiesService, usersService,
}) => {
  const results = await Promise.all([
    bookingService!.list(), fakeRestService!.listBooks(), booksService!.list(),
    authorsService!.list(), coverPhotosService!.list(), activitiesService!.list(), usersService!.list(),
  ]);
  const paths = ["/gateway/booking", "/proxy/api/v1/Books", "/proxy/api/v1/Books",
    "/proxy/api/v1/Authors", "/proxy/api/v1/CoverPhotos", "/proxy/api/v1/Activities", "/proxy/api/v1/Users"];
  results.forEach((result, index) => {
    const name = index === 0 ? "booking" : "fakeRest";
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      server: name, path: paths[index], method: "GET",
      headers: { "x-api-service": name, accept: "application/json" },
    });
  });
});

test("relative CRUD endpoints preserve payloads and per-request headers", async ({ bookingService, booksService }) => {
  const payload = { title: "Routing regression" };
  const operations = [
    { run: () => bookingService!.create(payload), method: "POST", path: "/gateway/booking" },
    { run: () => bookingService!.getById(7), method: "GET", path: "/gateway/booking/7" },
    { run: () => bookingService!.update(7, payload), method: "PUT", path: "/gateway/booking/7" },
    { run: () => bookingService!.partialUpdate(7, payload), method: "PATCH", path: "/gateway/booking/7" },
    { run: () => bookingService!.delete(7), method: "DELETE", path: "/gateway/booking/7" },
    { run: () => booksService!.create(payload), method: "POST", path: "/proxy/api/v1/Books" },
    { run: () => booksService!.getById(7), method: "GET", path: "/proxy/api/v1/Books/7" },
    { run: () => booksService!.update(7, payload), method: "PUT", path: "/proxy/api/v1/Books/7" },
    { run: () => booksService!.delete(7), method: "DELETE", path: "/proxy/api/v1/Books/7" },
  ];
  for (const { run, method, path } of operations) {
    const result = await run();
    expect(result.body).toMatchObject({ method, path,
      data: ["POST", "PUT", "PATCH"].includes(method) ? payload : null });
  }
  const updated = await bookingService!.update(7, payload, "test-token");
  expect(updated.body).toMatchObject({ headers: { cookie: "token=test-token", "x-api-service": "booking" } });
  const created = await booksService!.create(payload);
  expect(created.body).toMatchObject({ headers: { "content-type": "application/json; v=1.0", "x-api-service": "fakeRest" } });
});

test("separate contexts isolate cookies even when hosts share a cookie domain", async ({
  bookingApiRequest, fakeRestApiRequest, bookingService, booksService,
}) => {
  expect(bookingApiRequest).not.toBe(fakeRestApiRequest);
  await bookingApiRequest.get("session");
  const [booking, books] = await Promise.all([bookingService!.list(), booksService!.list()]);
  expect(booking.body).toMatchObject({ headers: { cookie: "session=booking" } });
  expect((books.body as { headers: Record<string, string> }).headers.cookie).toBeUndefined();
});

test("default callers retain generic endpoints and query parameters", async ({ apiRequest, apiConfig }) => {
  expect(apiConfig.baseUrl).toContain("/app");
  const service = new UserService(apiRequest);
  const result = await service.list({ role: "admin", page: 2 });
  expect(result.body).toMatchObject({ path: "/app/users?role=admin&page=2", headers: { "x-api-service": "default" } });
});

test.describe("explicit target for future raw-request suites", () => {
  test.use({ apiTarget: "fakeRest" });
  test("raw requests and the selected config use the same target", async ({ apiRequest, apiConfig }) => {
    expect(apiConfig.defaultHeaders["X-API-Service"]).toBe("fakeRest");
    const response = await apiRequest.get("api/v1/Books");
    expect(await response.json()).toMatchObject({ server: "fakeRest", path: "/proxy/api/v1/Books" });
  });
});

test("service errors retain their HTTP status", async ({ bookingService }) => {
  await expect(bookingService!.getById(404)).rejects.toHaveProperty("status", 404);
});

test("service endpoints cannot hardcode another host", async ({ apiRequest }) => {
  class EndpointProbe extends BaseAPI {
    resolve(path: string) { return this.buildUrl(path); }
  }
  const service = new EndpointProbe(apiRequest);
  expect(service.resolve("/users/7?expand=true")).toBe("users/7?expand=true");
  expect(() => service.resolve("https://another.example.test/users")).toThrow(/relative/);
  expect(() => service.resolve("//another.example.test/users")).toThrow(/relative/);
  expect(() => service.resolve("  https://another.example.test/users  ")).toThrow(/relative/);
  expect(() => service.resolve("\\\\another.example.test\\users")).toThrow(/relative/);
});
