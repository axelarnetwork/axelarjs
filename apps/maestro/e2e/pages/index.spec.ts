import { expect, test } from "@playwright/test";

test.describe("Index page", () => {
  test("Connect/Disconnect wallet", async ({ page }) => {
    await page.goto("/");

    const connectButton = page
      .locator("button", { hasText: /Connect Wallet/i })
      .nth(0);

    const connectButtonCount = await connectButton.count();

    const connectedWalletDropdownTrigger = page.locator(
      "button[aria-label='connected wallet dropdown trigger']"
    );

    const isAutoConnected = connectButtonCount === 0;

    if (isAutoConnected) {
      await expect(connectedWalletDropdownTrigger).toBeEnabled();

      await connectedWalletDropdownTrigger.click();

      const disconnectButton = page
        .locator("button", {
          hasText: /Disconnect/i,
        })
        .nth(0);

      await expect(disconnectButton).toBeEnabled();

      await disconnectButton.click();

      await expect(connectButton).toBeEnabled();
    }

    // clear local storage
    await page.evaluate(async () => {
      window.localStorage.clear();
      window.sessionStorage.clear();
      await window.caches.delete("walletconnect");
    });
  });
});
