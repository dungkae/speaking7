import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  expect: { timeout: 8000 },
  workers: 2,
  reporter: 'list',
  outputDir: '.playwright-artifacts',
  use: {
    viewport: { width: 1440, height: 900 },
    launchOptions: { executablePath, args: ['--enable-unsafe-swiftshader'] },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'development', use: { baseURL: 'http://127.0.0.1:5198' } },
    { name: 'production', use: { baseURL: 'http://127.0.0.1:5199' } },
  ],
  webServer: [
    { command: 'npm run dev -- --port 5198 --strictPort', url: 'http://127.0.0.1:5198', reuseExistingServer: !process.env.CI },
    { command: 'npm run preview -- --port 5199 --strictPort', url: 'http://127.0.0.1:5199', reuseExistingServer: !process.env.CI },
  ],
});
