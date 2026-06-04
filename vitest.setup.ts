import "@testing-library/jest-dom";
import { afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./__mocks__/kapruka-mcp";

// Start MSW mock server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// Reset handlers after each test (so tests don't bleed into each other)
afterEach(() => {
  server.resetHandlers();
  cleanup();
  if (typeof window !== "undefined") {
    window.localStorage.clear();
  }
});

// Close server after all tests
afterAll(() => server.close());
