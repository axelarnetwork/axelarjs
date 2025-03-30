import type { EVMChainConfig } from "@axelarjs/api";

import { render } from "@testing-library/react";
import { vi } from "vitest";

import { setupWithUserEvent } from "~/lib/utils/tests";
import SendInterchainToken from "./SendInterchainToken";
import type { Actions, State } from "./SendInterchainToken.state";

const MOCK_EVM_CHAIN_CONFIG: EVMChainConfig = {
  id: "1",
  maintainer_id: "maintainer_1",
  chain_name: "Ethereum",
  name: "Ethereum Mainnet",
  chain_id: 1,
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
  deprecated: false,
  no_inflation: true,
  chain_type: "evm",
  endpoints: {
    rpc: ["https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
  },
  native_token: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  // no_tvl: true,
};

const mocks = {
  setIsModalOpen: vi.fn(),
  resetTxState: vi.fn(),
  sendTokenAsync: vi.fn(),
  selectToChain: vi.fn(),
  refetchBalances: vi.fn(),
  addTransaction: vi.fn(),
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
      tokenSymbol: "ETH",
    } as State,
    {
      setIsModalOpen: mocks.setIsModalOpen,
      resetTxState: mocks.resetTxState,
      sendTokenAsync: mocks.sendTokenAsync,
      selectToChain: mocks.selectToChain,
      refetchBalances: mocks.refetchBalances,
      trackTransaction: mocks.addTransaction,
    } as Actions,
  ]),
}));

vi.mock("~/ui/compounds/GMPTxStatusMonitor/index.ts", () => ({
  default: () => <div>GMPTxStatusMonitor</div>,
}));

vi.mock("~/ui/components/ChainsDropdown/index.ts", () => ({
  default: () => <div>EVMChainsDropdown</div>,
}));

vi.mock("~/ui/compounds/MultiStepForm/index.ts", () => ({
  ShareHaikuButton: () => <div>ShareHaikuButton</div>,
}));

describe("SendInterchainToken", () => {
  it("should render correctly", () => {
    const { ...screen } = render(
      <SendInterchainToken
        tokenAddress="0x00"
        balance={{
          decimals: 18,
          tokenBalance: "100000000000000000000000000",
        }}
        isOpen
        sourceChain={MOCK_EVM_CHAIN_CONFIG}
        kind="interchain"
        tokenId="0x00"
        originTokenAddress="0x00"
        originTokenChainId={MOCK_EVM_CHAIN_CONFIG.chain_id}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /set max balance/i,
      })
    ).toMatchInlineSnapshot(`
      <span
        aria-label="set max balance to transfer"
        class="label-text-alt"
        role="button"
      >
        Balance:
         
        100,000,000
      </span>
    `);

    expect(screen.getByText(/Amount is required/)).toBeVisible();
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
        kind="interchain"
        tokenId="0x00"
        originTokenAddress="0x00"
        originTokenChainId={MOCK_EVM_CHAIN_CONFIG.chain_id}
      />
    );

    // type in an amount
    await user.type(
      screen.getByPlaceholderText("Enter your amount to transfer"),
      "100"
    );

    expect(screen.getByRole("button", { name: /Transfer/ }))
      .toMatchInlineSnapshot(`
      <button
        class="btn disabled:btn-disabled btn-primary"
        type="submit"
      >
        Transfer 
        100
         
        tokens
         to
         
        Ethereum Mainnet
      </button>
    `);
  });
});
