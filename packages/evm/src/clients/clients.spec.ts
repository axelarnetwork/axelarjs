import { createAxelarConfigClient } from "@axelarjs/api";

import { avalancheFuji } from "viem/chains";

import { InterchainTokenClient } from "../contracts";
import {
  createPublicClient,
  type SupportedMainnetChain,
} from "./mainnet-client";
import {
  createPublicTestnetClient,
  type SupportedTestnetChain,
} from "./testnet-client";

describe("EVM Clients", () => {
  it("should be defined", () => {
    const client = createPublicTestnetClient("avalanche");
    expect(client).toBeDefined();
  });

  // TODO: Refactor these tests since we support non-evm chains as well
  it.skip("should support all mainnet chains", async () => {
    const env = "mainnet";
    const configClient = createAxelarConfigClient(env);
    const configs = await configClient.getAxelarConfigs(env);
    const chains = Object.keys(configs.chains).filter(
      (chainId) => configs.chains[chainId]?.chainType === "evm"
    );
    const supportedChains = [];

    chains.forEach((chain) => {
      try {
        createPublicClient(chain as SupportedMainnetChain);
        supportedChains.push(chain);
      } catch (e) {
        console.error(
          `Chain ${chain} is not supported in mainnet. Please fix it.`
        );
      }
    });

    expect(supportedChains.length).toBe(chains.length);
  });

  it.skip("should support all testnet chains", async () => {
    const env = "testnet";
    const configClient = createAxelarConfigClient(env);
    const configs = await configClient.getAxelarConfigs(env);
    const chains = Object.keys(configs.chains).filter(
      (chainId) => configs.chains[chainId]?.chainType === "evm"
    );
    const supportedChains = [];

    chains.forEach((chain) => {
      try {
        createPublicTestnetClient(chain as SupportedTestnetChain);
        supportedChains.push(chain);
      } catch (e) {
        console.error(
          `Chain ${chain} is not supported in testnet. Please fix it.`
        );
      }
    });

    expect(supportedChains.length).toBe(chains.length - 1);
  });
});

describe("InterchainTokenClient", () => {
  const tokenAddress = "0x8C315Fa374817682CB0D3218d2B0b3FfE849FD4a";
  const ownerAddress = "0xB8Cd93C83A974649D76B1c19f311f639e62272BC";
  const serviceAddress = "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";

  const client = new InterchainTokenClient({
    chain: avalancheFuji,
    address: tokenAddress,
  });

  it("should be defined", () => {
    expect(client).toBeDefined();
  });

  it("should have a reads property", () => {
    expect(client.reads).toBeDefined();
  });

  it("should be able to read the balance of a token holder", async () => {
    const balance = await client.reads.balanceOf({
      balanceOfArg0: ownerAddress,
    });

    expect(balance).toBeDefined();
  });

  it("should be able to read the total supply of the token", async () => {
    const totalSupply = await client.reads.totalSupply();

    expect(totalSupply).toBeDefined();
  });

  it("should be able to get the token service address", async () => {
    const tokenServiceAddress = await client.reads.interchainTokenService();

    expect(tokenServiceAddress).toBe(serviceAddress);
  });

  it("should be able to determine whether an address is the token minter", async () => {
    const isMinter = await client.reads.isMinter({
      addr: ownerAddress,
    });

    expect(isMinter).toBe(true);
  });
});
