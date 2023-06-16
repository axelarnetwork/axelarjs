import { expect, test } from "@playwright/test";

test("Index page", async ({ page }) => {
  await page.goto(process.env.NEXT_PUBLIC_E2E_URL as string);
  const connectButton = page
    .locator("button", { hasText: /Connect Wallet/i })
    .nth(0);

  const count = await connectButton.count();

  const connectedWalletDropdownTrigger = page.locator(
    "button[aria-label='connected wallet dropdown trigger']"
  );

  if (count) {
    // is not connected
    await expect(connectButton).toBeEnabled();

    await connectButton.click();

    await expect(connectedWalletDropdownTrigger).toBeEnabled();
  } else {
    // is connected
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
});
