/* eslint-disable @typescript-eslint/no-unsafe-call */

import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import ConnectWalletButton from "./ConnectWalletButton";

const mockOpen = vi.fn();

vi.mock("@web3modal/wagmi/react", () => ({
  useWeb3Modal: vi.fn().mockImplementation(() => ({
    open: mockOpen,
  })),
}));

describe("ConnectWalletButton", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the button with default text 'Connect Wallet'", () => {
    const { getByText } = render(<ConnectWalletButton />);
    expect(getByText("Connect Wallet")).toBeInTheDocument();
  });

  it("triggers the open function from useWeb3Modal when clicked", async () => {
    const { getByTestId } = render(<ConnectWalletButton />);
    const button = getByTestId("connect-button");

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOpen).toBeCalledTimes(1);
    });
  });

  it("renders the button with default size 'sm'", () => {
    const { getByTestId } = render(<ConnectWalletButton />);
    const button = getByTestId("connect-button");

    expect(button).toHaveClass("btn-sm");
  });

  it("renders the button with default variant 'primary'", () => {
    const { getByTestId } = render(<ConnectWalletButton />);
    const button = getByTestId("connect-button");

    expect(button).toHaveClass("btn-primary");
  });

  it("renders the button with custom props", () => {
    const { getByText } = render(
      <ConnectWalletButton size="lg" variant="secondary">
        Custom Connect
      </ConnectWalletButton>
    );
    const button = getByText("Custom Connect");

    expect(button).toHaveClass("btn-lg");
    expect(button).toHaveClass("btn-secondary");
  });

  it("supports forwarding refs", async () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<ConnectWalletButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);

    if (ref.current) {
      fireEvent.click(ref.current);
    }

    await waitFor(() => {
      expect(mockOpen).toBeCalledTimes(1);
    });
  });
});
