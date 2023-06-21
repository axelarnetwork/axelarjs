import { expect, test } from "@playwright/test";

test.describe("InterchainTokenService", async () => {
  test("Deploy a new interchain token", async ({ page }) => {
    await page.goto("/");

    const deployButton = page.locator("button", { hasText: /Deploy/i }).nth(0);

    await expect(deployButton).toBeEnabled();
  });
});
