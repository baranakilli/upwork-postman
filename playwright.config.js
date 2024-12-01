// @ts-check
const { defineConfig } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  outputDir: './tests/test-results/outputs',
  reporter: [
    ['html', { outputFolder: './tests/test-results/playwright-report' }],
    ['list'] // Console'da test sonuçlarını görmek için
  ],
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});

