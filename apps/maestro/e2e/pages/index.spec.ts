import { expect, test } from "@playwright/test";

test.describe("Index page", () => {
  test("Connect/Disconnect wallet", async ({ page }) => {
    await page.goto(process.env.NEXT_PUBLIC_E2E_URL as string);

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

      connectedWalletDropdownTrigger.click();

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
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.caches.delete("walletconnect");
    });
  });
});
