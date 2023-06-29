import { render } from "@testing-library/react";
import { vi } from "vitest";

import SendInterchainToken from "./SendInterchainToken";

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

vi.mock("./SendInterchainToken.state.ts", () => ({
  useSendInterchainTokenState: vi.fn(() => [
    {
      isModalOpen: true,
      txState: {
        type: "idle",
      },
      isSending: false,
      selectedToChain: MOCK_EVM_CHAIN_CONFIG,
      eligibleTargetChains: [MOCK_EVM_CHAIN_CONFIG],
    },
    {
      setIsModalOpen: vi.fn(),
      setTxState: vi.fn(),
      sendTokenAsync: vi.fn(),
      selectToChain: vi.fn(),
      refetchBalances: vi.fn(),
    },
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
    const { findByRole } = render(
      <SendInterchainToken
        tokenAddress="0x00"
        balance={{
          decimals: 18,
          tokenBalance: "10000",
        }}
        sourceChain={MOCK_EVM_CHAIN_CONFIG}
      />
    );

    const button = await findByRole("button", { name: "Send" });

    expect(button).toBeTruthy();
    expect(button).toMatchInlineSnapshot(`
      <button
        class="btn btn-primary btn-disabled"
        disabled=""
        type="submit"
      >
        Send 
        0
         tokens to 
        Ethereum Mainnet
      </button>
    `);
  });
});
