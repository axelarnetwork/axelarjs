import { render, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import ConnectWalletButton from "./ConnectWalletButton";

const mocks = {
  useWeb3Modal: vi.fn(),
};

vi.doMock("@web3modal/react", () => ({
  useWeb3Modal: mocks.useWeb3Modal,
}));

describe("ConnectWalletButton", () => {
  it("should render correctly", async () => {
    mocks.useWeb3Modal.mockReturnValue({
      open: vi.fn(),
    });

    const { container } = render(<ConnectWalletButton />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          class="btn btn-sm btn-primary"
          data-testid="connect-button"
          type="button"
        >
          Connect Wallet
        </button>
      </div>
    `);
  });

  it("should call open on click", async () => {
    const open = vi.fn();

    mocks.useWeb3Modal.mockReturnValue({ open });

    const { getByTestId } = render(<ConnectWalletButton />);

    getByTestId("connect-button").click();

    waitFor(() => expect(open).toHaveBeenCalledTimes(1));
  });
});
