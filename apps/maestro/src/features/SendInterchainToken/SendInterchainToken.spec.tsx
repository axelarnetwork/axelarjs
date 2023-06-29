import { render } from "@testing-library/react";
import { vi } from "vitest";

import { setupWithUserEvent } from "~/lib/utils/tests";
import SendInterchainToken from "./SendInterchainToken";
import type { Actions, State } from "./SendInterchainToken.state";

const MOCK_EVM_CHAIN_CONFIG = {
  id: "1",
  maintainer_id: "maintainer_1",
  chain_name: "Ethereum",
  name: "Ethereum Mainnet",
  short_name: "ETH",
  chain_id: 1,
  is_staging: false,
  provider_params: [
    {
      chainId: "0x1",
      chainName: "Ethereum Mainnet",
      rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://etherscan.io/"],
    },
  ],
  explorer: {
    name: "Etherscan",
    url: "https://etherscan.io/",
    icon: "etherscan-icon.png",
    block_path: "/block/{{blockNumber}}",
    address_path: "/address/{{address}}",
    contract_path: "/address/{{address}}#code",
    contract_0_path: "/address/{{address}}#readContract",
    transaction_path: "/tx/{{transactionHash}}",
  },
  image: "ethereum-logo.png",
  color: "#3C3C3D",
  website: "https://ethereum.org/",
  gateway_address: "0x123456789",
  deprecated: false,
  no_inflation: true,
};

const mocks = {
  setIsModalOpen: vi.fn(),
  setTxState: vi.fn(),
  sendTokenAsync: vi.fn(),
  selectToChain: vi.fn(),
  refetchBalances: vi.fn(),
};

vi.mock("./SendInterchainToken.state.ts", () => ({
  useSendInterchainTokenState: vi.fn(() => [
    {
      isModalOpen: true,
      txState: {
        status: "idle",
      },
      isSending: false,
      selectedToChain: MOCK_EVM_CHAIN_CONFIG,
      eligibleTargetChains: [MOCK_EVM_CHAIN_CONFIG],
    } as State,
    {
      setIsModalOpen: mocks.setIsModalOpen,
      setTxState: mocks.setTxState,
      sendTokenAsync: mocks.sendTokenAsync,
      selectToChain: mocks.selectToChain,
      refetchBalances: mocks.refetchBalances,
    } as Actions,
  ]),
}));

vi.mock("~/compounds/GMPTxStatusMonitor/index.ts", () => ({
  default: () => <div>GMPTxStatusMonitor</div>,
}));

vi.mock("~/components/EVMChainsDropdown/index.ts", () => ({
  default: () => <div>EVMChainsDropdown</div>,
}));

describe("SendInterchainToken", () => {
  it("should render correctly", async () => {
    const { ...screen } = render(
      <SendInterchainToken
        tokenAddress="0x00"
        balance={{
          decimals: 18,
          tokenBalance: "100000000000000000000000000",
        }}
        isOpen
        sourceChain={MOCK_EVM_CHAIN_CONFIG}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /set max balance/i,
      })
    ).toMatchInlineSnapshot(`
      <span
        aria-label="set max balance to send"
        class="label-text-alt"
        role="button"
      >
        Balance:
         
        100,000,000
      </span>
    `);

    expect(
      screen.getByRole("button", { name: /Amount is required/ })
    ).toBeDisabled();
  });

  it("should update the button text when entering an amount", async () => {
    const { user, ...screen } = setupWithUserEvent(
      <SendInterchainToken
        tokenAddress="0x00"
        balance={{
          decimals: 18,
          tokenBalance: "100000000000000000000000000",
        }}
        isOpen
        sourceChain={MOCK_EVM_CHAIN_CONFIG}
      />
    );

    // type in an amount
    await user.type(
      screen.getByPlaceholderText("Enter your amount to send"),
      "100"
    );

    expect(screen.getByRole("button", { name: /Send/ })).toMatchInlineSnapshot(`
      <button
        class="btn btn-primary"
        type="submit"
      >
        Send 
        100
         tokens to 
        Ethereum Mainnet
      </button>
    `);
  });
});
