import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 90_000,
  fullyParallel: false,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:4322", ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
  webServer: { command: "node scripts/serve-dist.mjs 4322", url: "http://127.0.0.1:4322", reuseExistingServer: false, timeout: 60_000 },
});
