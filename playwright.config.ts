import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir:   "./__tests__/e2e",
  fullyParallel: false,   // run sequentially to avoid MCP rate limits
  retries:   process.env.CI ? 2 : 0,
  reporter:  [["html", { outputFolder: "playwright-report" }], ["list"]],
  timeout:   60000,   // 60s per test (agent calls can be slow)

  use: {
    baseURL:       process.env.BASE_URL ?? "http://127.0.0.1:3000",
    screenshot:    "only-on-failure",
    video:         "on-first-retry",
    trace:         "on-first-retry",
    extraHTTPHeaders: {
      "x-test-mode": "true",
    },
  },

  projects: [
    {
      name: "chromium-desktop",
      use:  { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "mobile-chrome",
      use:  { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "firefox",
      use:  {
        ...devices["Desktop Firefox"],
        launchOptions: {
          firefoxUserPrefs: {
            "network.proxy.type": 0,
          },
        },
      },
    },
  ],

  webServer: {
    command: "npx next dev -H 127.0.0.1 -p 3000",
    url:     "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
