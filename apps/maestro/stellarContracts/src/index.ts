import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Spec as ContractSpec,
  Result,
  type Duration,
  type i32,
  type i64,
  type i128,
  type i256,
  type Option,
  type Typepoint,
  type u32,
  type u64,
  type u128,
  type u256,
} from "@stellar/stellar-sdk/contract";

export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCD7JXLHOJKQDPKOXQTK6PYACFYQPRC25IVKHQDOMP3ANFMBWO5FZZAN",
  },
} as const;

export const Errors = {
  1: { message: "MigrationNotAllowed" },

  2: { message: "NotOwner" },

  3: { message: "TrustedChainAlreadySet" },

  4: { message: "TrustedChainNotSet" },

  5: { message: "InvalidMessageType" },

  6: { message: "InvalidPayload" },

  7: { message: "UntrustedChain" },

  8: { message: "InsufficientMessageLength" },

  9: { message: "AbiDecodeFailed" },

  10: { message: "InvalidAmount" },

  11: { message: "InvalidUtf8" },

  12: { message: "InvalidMinter" },

  13: { message: "InvalidDestinationAddress" },

  14: { message: "NotHubChain" },

  15: { message: "NotHubAddress" },

  16: { message: "InvalidTokenMetaData" },

  17: { message: "InvalidTokenId" },

  18: { message: "TokenAlreadyRegistered" },

  19: { message: "InvalidFlowLimit" },

  20: { message: "FlowLimitExceeded" },

  21: { message: "FlowAmountOverflow" },

  22: { message: "NotApproved" },

  23: { message: "InvalidDestinationChain" },

  24: { message: "InvalidData" },

  25: { message: "InvalidTokenName" },

  26: { message: "InvalidTokenSymbol" },

  27: { message: "InvalidTokenDecimals" },

  28: { message: "ContractPaused" },

  29: { message: "InvalidInitialSupply" },
};
/**
 * The type of token manager used for the tokenId.
 *
 * Only the variants supported by Stellar ITS are defined here.
 * The variant values need to match the [ITS spec](https://github.com/axelarnetwork/interchain-token-service/blob/v2.0.0/contracts/interfaces/ITokenManagerType.sol#L9).
 */
export enum TokenManagerType {
  NativeInterchainToken = 0,
  LockUnlock = 2,
}

export interface FlowKey {
  epoch: u64;
  token_id: Buffer;
}

export interface TokenIdConfigValue {
  token_address: string;
  token_manager: string;
  token_manager_type: TokenManagerType;
}

export type DataKey =
  | { tag: "Gateway"; values: void }
  | { tag: "GasService"; values: void }
  | { tag: "ChainName"; values: void }
  | { tag: "ItsHubAddress"; values: void }
  | { tag: "NativeTokenAddress"; values: void }
  | { tag: "InterchainTokenWasmHash"; values: void }
  | { tag: "TokenManagerWasmHash"; values: void }
  | { tag: "TrustedChain"; values: readonly [string] }
  | { tag: "TokenIdConfig"; values: readonly [Buffer] }
  | { tag: "FlowLimit"; values: readonly [Buffer] }
  | { tag: "FlowOut"; values: readonly [FlowKey] }
  | { tag: "FlowIn"; values: readonly [FlowKey] };

export interface TokenMetadata {
  decimal: u32;
  name: string;
  symbol: string;
}

// export const Errors = {
//   1: {message:"MigrationNotAllowed"},

//   2: {message:"InvalidAddress"},

//   3: {message:"InvalidAmount"},

//   4: {message:"InsufficientBalance"}
// }
// export const Errors = {
//   /**
//    * Upgradable
//    */
//   1: {message:"MigrationNotAllowed"},

//   /**
//    * Auth
//    */
//   2: {message:"InvalidThreshold"},

//   3: {message:"InvalidProof"},

//   4: {message:"InvalidSigners"},

//   5: {message:"InsufficientRotationDelay"},

//   6: {message:"InvalidSignatures"},

//   7: {message:"InvalidWeight"},

//   8: {message:"WeightOverflow"},

//   9: {message:"NotLatestSigners"},

//   10: {message:"DuplicateSigners"},

//   11: {message:"InvalidSignersHash"},

//   12: {message:"InvalidEpoch"},

//   13: {message:"EmptySigners"},

//   14: {message:"OutdatedSigners"},

//   /**
//    * Messages
//    */
//   15: {message:"EmptyMessages"},

//   /**
//    * Pausable
//    */
//   16: {message:"ContractPaused"}
// }

export interface WeightedSigner {
  signer: Buffer;
  weight: u128;
}

export interface WeightedSigners {
  nonce: Buffer;
  signers: Array<WeightedSigner>;
  threshold: u128;
}

/**
 * `ProofSignature` represents an optional signature from a signer.
 * Since Soroban doesn't support use of `Option` in it's contract interfaces,
 * we use this enum instead.
 */
export type ProofSignature =
  | { tag: "Signed"; values: readonly [Buffer] }
  | { tag: "Unsigned"; values: void };

/**
 * `ProofSigner` represents a signer in a proof.
 *
 * If the signer submitted a signature, and if it is being included in the proof to meet the threshold,
 * then a signature is attached. Otherwise, the `ProofSignature` is `Unsigned`.
 */
export interface ProofSigner {
  signature: ProofSignature;
  signer: WeightedSigner;
}

/**
 * `Proof` represents a proof that a set of signers have signed a message.
 * All weighted signers are included in the along with a signature, if they have signed the message,
 * until threshold is met.
 */
export interface Proof {
  nonce: Buffer;
  signers: Array<ProofSigner>;
  threshold: u128;
}

export type CommandType =
  | { tag: "ApproveMessages"; values: void }
  | { tag: "RotateSigners"; values: void };

export interface Message {
  contract_address: string;
  message_id: string;
  payload_hash: Buffer;
  source_address: string;
  source_chain: string;
}

export interface Token {
  address: string;
  amount: i128;
}

// export type DataKey = {tag: "Interfaces_Operator", values: void};

// export type DataKey = {tag: "Interfaces_Owner", values: void};

// export type DataKey = {tag: "Interfaces_Paused", values: void};

// export type DataKey = {tag: "Interfaces_Migrating", values: void};

// export const Errors = {
//   1: {message:"MigrationNotAllowed"},

//   2: {message:"NotMinter"},

//   3: {message:"InvalidDecimal"},

//   4: {message:"InvalidTokenName"},

//   5: {message:"InvalidTokenSymbol"},

//   6: {message:"InvalidAmount"},

//   7: {message:"InvalidExpirationLedger"},

//   8: {message:"InsufficientAllowance"},

//   9: {message:"InsufficientBalance"}
// }
// export const Errors = {
//   1: {message:"MigrationNotAllowed"}
// }

export interface Client {
  /**
   * Construct and simulate a gateway transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  gateway: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a execute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  execute: (
    {
      source_chain,
      message_id,
      source_address,
      payload,
    }: {
      source_chain: string;
      message_id: string;
      source_address: string;
      payload: Buffer;
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a gas_service transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  gas_service: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a chain_name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  chain_name: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a its_hub_chain_name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  its_hub_chain_name: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a its_hub_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  its_hub_address: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a native_token_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  native_token_address: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a interchain_token_wasm_hash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  interchain_token_wasm_hash: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>;

  /**
   * Construct and simulate a token_manager_wasm_hash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  token_manager_wasm_hash: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>;

  /**
   * Construct and simulate a is_trusted_chain transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_trusted_chain: (
    { chain }: { chain: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<boolean>>;

  /**
   * Construct and simulate a set_trusted_chain transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_trusted_chain: (
    { chain }: { chain: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a remove_trusted_chain transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_trusted_chain: (
    { chain }: { chain: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a interchain_token_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  interchain_token_id: (
    { deployer, salt }: { deployer: string; salt: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Buffer>>;

  /**
   * Construct and simulate a canonical_interchain_token_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  canonical_interchain_token_id: (
    { token_address }: { token_address: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Buffer>>;

  /**
   * Construct and simulate a interchain_token_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  interchain_token_address: (
    { token_id }: { token_id: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a token_manager_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  token_manager_address: (
    { token_id }: { token_id: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a token_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  token_address: (
    { token_id }: { token_id: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a token_manager transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  token_manager: (
    { token_id }: { token_id: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a token_manager_type transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  token_manager_type: (
    { token_id }: { token_id: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<TokenManagerType>>;

  /**
   * Construct and simulate a flow_limit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  flow_limit: (
    { token_id }: { token_id: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Option<i128>>>;

  /**
   * Construct and simulate a flow_out_amount transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  flow_out_amount: (
    { token_id }: { token_id: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a flow_in_amount transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  flow_in_amount: (
    { token_id }: { token_id: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a set_flow_limit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_flow_limit: (
    { token_id, flow_limit }: { token_id: Buffer; flow_limit: Option<i128> },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a deploy_interchain_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deploy_interchain_token: (
    {
      caller,
      salt,
      token_metadata,
      initial_supply,
      minter,
    }: {
      caller: string;
      salt: Buffer;
      token_metadata: TokenMetadata;
      initial_supply: i128;
      minter: Option<string>;
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<Buffer>>>;

  /**
   * Construct and simulate a deploy_remote_interchain_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deploy_remote_interchain_token: (
    {
      caller,
      salt,
      destination_chain,
      gas_token,
    }: {
      caller: string;
      salt: Buffer;
      destination_chain: string;
      gas_token: Token;
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<Buffer>>>;

  /**
   * Construct and simulate a register_canonical_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  register_canonical_token: (
    { token_address }: { token_address: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<Buffer>>>;

  /**
   * Construct and simulate a deploy_remote_canonical_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deploy_remote_canonical_token: (
    {
      token_address,
      destination_chain,
      spender,
      gas_token,
    }: {
      token_address: string;
      destination_chain: string;
      spender: string;
      gas_token: Token;
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<Buffer>>>;

  /**
   * Construct and simulate a interchain_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  interchain_transfer: (
    {
      caller,
      token_id,
      destination_chain,
      destination_address,
      amount,
      data,
      gas_token,
    }: {
      caller: string;
      token_id: Buffer;
      destination_chain: string;
      destination_address: Buffer;
      amount: i128;
      data: Option<Buffer>;
      gas_token: Token;
    },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a operator transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  operator: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a transfer_operatorship transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_operatorship: (
    { new_operator }: { new_operator: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  owner: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a transfer_ownership transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer_ownership: (
    { new_owner }: { new_owner: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  paused: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>;

  /**
   * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pause: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unpause: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a version transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  version: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>;

  /**
   * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  upgrade: (
    { new_wasm_hash }: { new_wasm_hash: Buffer },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a migrate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  migrate: (
    { migration_data }: { migration_data: void },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    }
  ) => Promise<AssembledTransaction<Result<void>>>;
}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAdAAAAAAAAABNNaWdyYXRpb25Ob3RBbGxvd2VkAAAAAAEAAAAAAAAACE5vdE93bmVyAAAAAgAAAAAAAAAWVHJ1c3RlZENoYWluQWxyZWFkeVNldAAAAAAAAwAAAAAAAAASVHJ1c3RlZENoYWluTm90U2V0AAAAAAAEAAAAAAAAABJJbnZhbGlkTWVzc2FnZVR5cGUAAAAAAAUAAAAAAAAADkludmFsaWRQYXlsb2FkAAAAAAAGAAAAAAAAAA5VbnRydXN0ZWRDaGFpbgAAAAAABwAAAAAAAAAZSW5zdWZmaWNpZW50TWVzc2FnZUxlbmd0aAAAAAAAAAgAAAAAAAAAD0FiaURlY29kZUZhaWxlZAAAAAAJAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAACgAAAAAAAAALSW52YWxpZFV0ZjgAAAAACwAAAAAAAAANSW52YWxpZE1pbnRlcgAAAAAAAAwAAAAAAAAAGUludmFsaWREZXN0aW5hdGlvbkFkZHJlc3MAAAAAAAANAAAAAAAAAAtOb3RIdWJDaGFpbgAAAAAOAAAAAAAAAA1Ob3RIdWJBZGRyZXNzAAAAAAAADwAAAAAAAAAUSW52YWxpZFRva2VuTWV0YURhdGEAAAAQAAAAAAAAAA5JbnZhbGlkVG9rZW5JZAAAAAAAEQAAAAAAAAAWVG9rZW5BbHJlYWR5UmVnaXN0ZXJlZAAAAAAAEgAAAAAAAAAQSW52YWxpZEZsb3dMaW1pdAAAABMAAAAAAAAAEUZsb3dMaW1pdEV4Y2VlZGVkAAAAAAAAFAAAAAAAAAASRmxvd0Ftb3VudE92ZXJmbG93AAAAAAAVAAAAAAAAAAtOb3RBcHByb3ZlZAAAAAAWAAAAAAAAABdJbnZhbGlkRGVzdGluYXRpb25DaGFpbgAAAAAXAAAAAAAAAAtJbnZhbGlkRGF0YQAAAAAYAAAAAAAAABBJbnZhbGlkVG9rZW5OYW1lAAAAGQAAAAAAAAASSW52YWxpZFRva2VuU3ltYm9sAAAAAAAaAAAAAAAAABRJbnZhbGlkVG9rZW5EZWNpbWFscwAAABsAAAAAAAAADkNvbnRyYWN0UGF1c2VkAAAAAAAcAAAAAAAAABRJbnZhbGlkSW5pdGlhbFN1cHBseQAAAB0=",
        "AAAAAwAAARNUaGUgdHlwZSBvZiB0b2tlbiBtYW5hZ2VyIHVzZWQgZm9yIHRoZSB0b2tlbklkLgoKT25seSB0aGUgdmFyaWFudHMgc3VwcG9ydGVkIGJ5IFN0ZWxsYXIgSVRTIGFyZSBkZWZpbmVkIGhlcmUuClRoZSB2YXJpYW50IHZhbHVlcyBuZWVkIHRvIG1hdGNoIHRoZSBbSVRTIHNwZWNdKGh0dHBzOi8vZ2l0aHViLmNvbS9heGVsYXJuZXR3b3JrL2ludGVyY2hhaW4tdG9rZW4tc2VydmljZS9ibG9iL3YyLjAuMC9jb250cmFjdHMvaW50ZXJmYWNlcy9JVG9rZW5NYW5hZ2VyVHlwZS5zb2wjTDkpLgAAAAAAAAAAEFRva2VuTWFuYWdlclR5cGUAAAACAAAAAAAAABVOYXRpdmVJbnRlcmNoYWluVG9rZW4AAAAAAAAAAAAAAAAAAApMb2NrVW5sb2NrAAAAAAAC",
        "AAAAAAAAAAAAAAAHZ2F0ZXdheQAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAHZXhlY3V0ZQAAAAAEAAAAAAAAAAxzb3VyY2VfY2hhaW4AAAAQAAAAAAAAAAptZXNzYWdlX2lkAAAAAAAQAAAAAAAAAA5zb3VyY2VfYWRkcmVzcwAAAAAAEAAAAAAAAAAHcGF5bG9hZAAAAAAOAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAALZ2FzX3NlcnZpY2UAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAKY2hhaW5fbmFtZQAAAAAAAAAAAAEAAAAQ",
        "AAAAAAAAAAAAAAASaXRzX2h1Yl9jaGFpbl9uYW1lAAAAAAAAAAAAAQAAABA=",
        "AAAAAAAAAAAAAAAPaXRzX2h1Yl9hZGRyZXNzAAAAAAAAAAABAAAAEA==",
        "AAAAAAAAAAAAAAAUbmF0aXZlX3Rva2VuX2FkZHJlc3MAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAaaW50ZXJjaGFpbl90b2tlbl93YXNtX2hhc2gAAAAAAAAAAAABAAAD7gAAACA=",
        "AAAAAAAAAAAAAAAXdG9rZW5fbWFuYWdlcl93YXNtX2hhc2gAAAAAAAAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAAQaXNfdHJ1c3RlZF9jaGFpbgAAAAEAAAAAAAAABWNoYWluAAAAAAAAEAAAAAEAAAAB",
        "AAAAAAAAAAAAAAARc2V0X3RydXN0ZWRfY2hhaW4AAAAAAAABAAAAAAAAAAVjaGFpbgAAAAAAABAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAUcmVtb3ZlX3RydXN0ZWRfY2hhaW4AAAABAAAAAAAAAAVjaGFpbgAAAAAAABAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAATaW50ZXJjaGFpbl90b2tlbl9pZAAAAAACAAAAAAAAAAhkZXBsb3llcgAAABMAAAAAAAAABHNhbHQAAAPuAAAAIAAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAAdY2Fub25pY2FsX2ludGVyY2hhaW5fdG9rZW5faWQAAAAAAAABAAAAAAAAAA10b2tlbl9hZGRyZXNzAAAAAAAAEwAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAAYaW50ZXJjaGFpbl90b2tlbl9hZGRyZXNzAAAAAQAAAAAAAAAIdG9rZW5faWQAAAPuAAAAIAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAVdG9rZW5fbWFuYWdlcl9hZGRyZXNzAAAAAAAAAQAAAAAAAAAIdG9rZW5faWQAAAPuAAAAIAAAAAEAAAAT",
        "AAAAAAAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAAAEAAAAAAAAACHRva2VuX2lkAAAD7gAAACAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAANdG9rZW5fbWFuYWdlcgAAAAAAAAEAAAAAAAAACHRva2VuX2lkAAAD7gAAACAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAASdG9rZW5fbWFuYWdlcl90eXBlAAAAAAABAAAAAAAAAAh0b2tlbl9pZAAAA+4AAAAgAAAAAQAAB9AAAAAQVG9rZW5NYW5hZ2VyVHlwZQ==",
        "AAAAAAAAAAAAAAAKZmxvd19saW1pdAAAAAAAAQAAAAAAAAAIdG9rZW5faWQAAAPuAAAAIAAAAAEAAAPoAAAACw==",
        "AAAAAAAAAAAAAAAPZmxvd19vdXRfYW1vdW50AAAAAAEAAAAAAAAACHRva2VuX2lkAAAD7gAAACAAAAABAAAACw==",
        "AAAAAAAAAAAAAAAOZmxvd19pbl9hbW91bnQAAAAAAAEAAAAAAAAACHRva2VuX2lkAAAD7gAAACAAAAABAAAACw==",
        "AAAAAAAAAAAAAAAOc2V0X2Zsb3dfbGltaXQAAAAAAAIAAAAAAAAACHRva2VuX2lkAAAD7gAAACAAAAAAAAAACmZsb3dfbGltaXQAAAAAA+gAAAALAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAXZGVwbG95X2ludGVyY2hhaW5fdG9rZW4AAAAABQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAARzYWx0AAAD7gAAACAAAAAAAAAADnRva2VuX21ldGFkYXRhAAAAAAfQAAAADVRva2VuTWV0YWRhdGEAAAAAAAAAAAAADmluaXRpYWxfc3VwcGx5AAAAAAALAAAAAAAAAAZtaW50ZXIAAAAAA+gAAAATAAAAAQAAA+kAAAPuAAAAIAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAeZGVwbG95X3JlbW90ZV9pbnRlcmNoYWluX3Rva2VuAAAAAAAEAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAABHNhbHQAAAPuAAAAIAAAAAAAAAARZGVzdGluYXRpb25fY2hhaW4AAAAAAAAQAAAAAAAAAAlnYXNfdG9rZW4AAAAAAAfQAAAABVRva2VuAAAAAAAAAQAAA+kAAAPuAAAAIAAAB9AAAAANQ29udHJhY3RFcnJvcgAAAA==",
        "AAAAAAAAAAAAAAAYcmVnaXN0ZXJfY2Fub25pY2FsX3Rva2VuAAAAAQAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAABMAAAABAAAD6QAAA+4AAAAgAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAAdZGVwbG95X3JlbW90ZV9jYW5vbmljYWxfdG9rZW4AAAAAAAAEAAAAAAAAAA10b2tlbl9hZGRyZXNzAAAAAAAAEwAAAAAAAAARZGVzdGluYXRpb25fY2hhaW4AAAAAAAAQAAAAAAAAAAdzcGVuZGVyAAAAABMAAAAAAAAACWdhc190b2tlbgAAAAAAB9AAAAAFVG9rZW4AAAAAAAABAAAD6QAAA+4AAAAgAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAAAAAAAAAAATaW50ZXJjaGFpbl90cmFuc2ZlcgAAAAAHAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACHRva2VuX2lkAAAD7gAAACAAAAAAAAAAEWRlc3RpbmF0aW9uX2NoYWluAAAAAAAAEAAAAAAAAAATZGVzdGluYXRpb25fYWRkcmVzcwAAAAAOAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAABGRhdGEAAAPoAAAADgAAAAAAAAAJZ2FzX3Rva2VuAAAAAAAH0AAAAAVUb2tlbgAAAAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAADUNvbnRyYWN0RXJyb3IAAAA=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAkAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAAAAAAdnYXRld2F5AAAAABMAAAAAAAAAC2dhc19zZXJ2aWNlAAAAABMAAAAAAAAAD2l0c19odWJfYWRkcmVzcwAAAAAQAAAAAAAAAApjaGFpbl9uYW1lAAAAAAAQAAAAAAAAABRuYXRpdmVfdG9rZW5fYWRkcmVzcwAAABMAAAAAAAAAGmludGVyY2hhaW5fdG9rZW5fd2FzbV9oYXNoAAAAAAPuAAAAIAAAAAAAAAAXdG9rZW5fbWFuYWdlcl93YXNtX2hhc2gAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAIb3BlcmF0b3IAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAVdHJhbnNmZXJfb3BlcmF0b3JzaGlwAAAAAAAAAQAAAAAAAAAMbmV3X29wZXJhdG9yAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAFb3duZXIAAAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAASdHJhbnNmZXJfb3duZXJzaGlwAAAAAAABAAAAAAAAAAluZXdfb3duZXIAAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAGcGF1c2VkAAAAAAAAAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAFcGF1c2UAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAHdW5wYXVzZQAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAABA=",
        "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAHbWlncmF0ZQAAAAABAAAAAAAAAA5taWdyYXRpb25fZGF0YQAAAAAD7QAAAAAAAAABAAAD6QAAA+0AAAAAAAAH0AAAAA1Db250cmFjdEVycm9yAAAA",
        "AAAAAQAAAAAAAAAAAAAAB0Zsb3dLZXkAAAAAAgAAAAAAAAAFZXBvY2gAAAAAAAAGAAAAAAAAAAh0b2tlbl9pZAAAA+4AAAAg",
        "AAAAAQAAAAAAAAAAAAAAElRva2VuSWRDb25maWdWYWx1ZQAAAAAAAwAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAABMAAAAAAAAADXRva2VuX21hbmFnZXIAAAAAAAATAAAAAAAAABJ0b2tlbl9tYW5hZ2VyX3R5cGUAAAAAB9AAAAAQVG9rZW5NYW5hZ2VyVHlwZQ==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAADAAAAAAAAAAAAAAAB0dhdGV3YXkAAAAAAAAAAAAAAAAKR2FzU2VydmljZQAAAAAAAAAAAAAAAAAJQ2hhaW5OYW1lAAAAAAAAAAAAAAAAAAANSXRzSHViQWRkcmVzcwAAAAAAAAAAAAAAAAAAEk5hdGl2ZVRva2VuQWRkcmVzcwAAAAAAAAAAAAAAAAAXSW50ZXJjaGFpblRva2VuV2FzbUhhc2gAAAAAAAAAAAAAAAAUVG9rZW5NYW5hZ2VyV2FzbUhhc2gAAAABAAAAAAAAAAxUcnVzdGVkQ2hhaW4AAAABAAAAEAAAAAEAAAAAAAAADVRva2VuSWRDb25maWcAAAAAAAABAAAD7gAAACAAAAABAAAAAAAAAAlGbG93TGltaXQAAAAAAAABAAAD7gAAACAAAAABAAAAAAAAAAdGbG93T3V0AAAAAAEAAAfQAAAAB0Zsb3dLZXkAAAAAAQAAAAAAAAAGRmxvd0luAAAAAAABAAAH0AAAAAdGbG93S2V5AA==",
        "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA=",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAEAAAAAAAAABNNaWdyYXRpb25Ob3RBbGxvd2VkAAAAAAEAAAAAAAAADkludmFsaWRBZGRyZXNzAAAAAAACAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAAAwAAAAAAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAAE",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAQAAAAClVwZ3JhZGFibGUAAAAAABNNaWdyYXRpb25Ob3RBbGxvd2VkAAAAAAEAAAAEQXV0aAAAABBJbnZhbGlkVGhyZXNob2xkAAAAAgAAAAAAAAAMSW52YWxpZFByb29mAAAAAwAAAAAAAAAOSW52YWxpZFNpZ25lcnMAAAAAAAQAAAAAAAAAGUluc3VmZmljaWVudFJvdGF0aW9uRGVsYXkAAAAAAAAFAAAAAAAAABFJbnZhbGlkU2lnbmF0dXJlcwAAAAAAAAYAAAAAAAAADUludmFsaWRXZWlnaHQAAAAAAAAHAAAAAAAAAA5XZWlnaHRPdmVyZmxvdwAAAAAACAAAAAAAAAAQTm90TGF0ZXN0U2lnbmVycwAAAAkAAAAAAAAAEER1cGxpY2F0ZVNpZ25lcnMAAAAKAAAAAAAAABJJbnZhbGlkU2lnbmVyc0hhc2gAAAAAAAsAAAAAAAAADEludmFsaWRFcG9jaAAAAAwAAAAAAAAADEVtcHR5U2lnbmVycwAAAA0AAAAAAAAAD091dGRhdGVkU2lnbmVycwAAAAAOAAAACE1lc3NhZ2VzAAAADUVtcHR5TWVzc2FnZXMAAAAAAAAPAAAACFBhdXNhYmxlAAAADkNvbnRyYWN0UGF1c2VkAAAAAAAQ",
        "AAAAAQAAAAAAAAAAAAAADldlaWdodGVkU2lnbmVyAAAAAAACAAAAAAAAAAZzaWduZXIAAAAAA+4AAAAgAAAAAAAAAAZ3ZWlnaHQAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAAD1dlaWdodGVkU2lnbmVycwAAAAADAAAAAAAAAAVub25jZQAAAAAAA+4AAAAgAAAAAAAAAAdzaWduZXJzAAAAA+oAAAfQAAAADldlaWdodGVkU2lnbmVyAAAAAAAAAAAACXRocmVzaG9sZAAAAAAAAAo=",
        "AAAAAgAAAKVgUHJvb2ZTaWduYXR1cmVgIHJlcHJlc2VudHMgYW4gb3B0aW9uYWwgc2lnbmF0dXJlIGZyb20gYSBzaWduZXIuClNpbmNlIFNvcm9iYW4gZG9lc24ndCBzdXBwb3J0IHVzZSBvZiBgT3B0aW9uYCBpbiBpdCdzIGNvbnRyYWN0IGludGVyZmFjZXMsCndlIHVzZSB0aGlzIGVudW0gaW5zdGVhZC4AAAAAAAAAAAAADlByb29mU2lnbmF0dXJlAAAAAAACAAAAAQAAAAAAAAAGU2lnbmVkAAAAAAABAAAD7gAAAEAAAAAAAAAAAAAAAAhVbnNpZ25lZA==",
        "AAAAAQAAAOBgUHJvb2ZTaWduZXJgIHJlcHJlc2VudHMgYSBzaWduZXIgaW4gYSBwcm9vZi4KCklmIHRoZSBzaWduZXIgc3VibWl0dGVkIGEgc2lnbmF0dXJlLCBhbmQgaWYgaXQgaXMgYmVpbmcgaW5jbHVkZWQgaW4gdGhlIHByb29mIHRvIG1lZXQgdGhlIHRocmVzaG9sZCwKdGhlbiBhIHNpZ25hdHVyZSBpcyBhdHRhY2hlZC4gT3RoZXJ3aXNlLCB0aGUgYFByb29mU2lnbmF0dXJlYCBpcyBgVW5zaWduZWRgLgAAAAAAAAALUHJvb2ZTaWduZXIAAAAAAgAAAAAAAAAJc2lnbmF0dXJlAAAAAAAH0AAAAA5Qcm9vZlNpZ25hdHVyZQAAAAAAAAAAAAZzaWduZXIAAAAAB9AAAAAOV2VpZ2h0ZWRTaWduZXIAAA==",
        "AAAAAQAAAMFgUHJvb2ZgIHJlcHJlc2VudHMgYSBwcm9vZiB0aGF0IGEgc2V0IG9mIHNpZ25lcnMgaGF2ZSBzaWduZWQgYSBtZXNzYWdlLgpBbGwgd2VpZ2h0ZWQgc2lnbmVycyBhcmUgaW5jbHVkZWQgaW4gdGhlIGFsb25nIHdpdGggYSBzaWduYXR1cmUsIGlmIHRoZXkgaGF2ZSBzaWduZWQgdGhlIG1lc3NhZ2UsCnVudGlsIHRocmVzaG9sZCBpcyBtZXQuAAAAAAAAAAAAAAVQcm9vZgAAAAAAAAMAAAAAAAAABW5vbmNlAAAAAAAD7gAAACAAAAAAAAAAB3NpZ25lcnMAAAAD6gAAB9AAAAALUHJvb2ZTaWduZXIAAAAAAAAAAAl0aHJlc2hvbGQAAAAAAAAK",
        "AAAAAgAAAAAAAAAAAAAAC0NvbW1hbmRUeXBlAAAAAAIAAAAAAAAAAAAAAA9BcHByb3ZlTWVzc2FnZXMAAAAAAAAAAAAAAAANUm90YXRlU2lnbmVycwAAAA==",
        "AAAAAQAAAAAAAAAAAAAAB01lc3NhZ2UAAAAABQAAAAAAAAAQY29udHJhY3RfYWRkcmVzcwAAABMAAAAAAAAACm1lc3NhZ2VfaWQAAAAAABAAAAAAAAAADHBheWxvYWRfaGFzaAAAA+4AAAAgAAAAAAAAAA5zb3VyY2VfYWRkcmVzcwAAAAAAEAAAAAAAAAAMc291cmNlX2NoYWluAAAAEA==",
        "AAAAAQAAAAAAAAAAAAAABVRva2VuAAAAAAAAAgAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAs=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAAE0ludGVyZmFjZXNfT3BlcmF0b3IA",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAAEEludGVyZmFjZXNfT3duZXI=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAAEUludGVyZmFjZXNfUGF1c2VkAAAA",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAAFEludGVyZmFjZXNfTWlncmF0aW5n",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAAJAAAAAAAAABNNaWdyYXRpb25Ob3RBbGxvd2VkAAAAAAEAAAAAAAAACU5vdE1pbnRlcgAAAAAAAAIAAAAAAAAADkludmFsaWREZWNpbWFsAAAAAAADAAAAAAAAABBJbnZhbGlkVG9rZW5OYW1lAAAABAAAAAAAAAASSW52YWxpZFRva2VuU3ltYm9sAAAAAAAFAAAAAAAAAA1JbnZhbGlkQW1vdW50AAAAAAAABgAAAAAAAAAXSW52YWxpZEV4cGlyYXRpb25MZWRnZXIAAAAABwAAAAAAAAAVSW5zdWZmaWNpZW50QWxsb3dhbmNlAAAAAAAACAAAAAAAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAAJ",
        "AAAABAAAAAAAAAAAAAAADUNvbnRyYWN0RXJyb3IAAAAAAAABAAAAAAAAABNNaWdyYXRpb25Ob3RBbGxvd2VkAAAAAAE=",
      ]),
      options
    );
  }
  public readonly fromJSON = {
    gateway: this.txFromJSON<string>,
    execute: this.txFromJSON<Result<void>>,
    gas_service: this.txFromJSON<string>,
    chain_name: this.txFromJSON<string>,
    its_hub_chain_name: this.txFromJSON<string>,
    its_hub_address: this.txFromJSON<string>,
    native_token_address: this.txFromJSON<string>,
    interchain_token_wasm_hash: this.txFromJSON<Buffer>,
    token_manager_wasm_hash: this.txFromJSON<Buffer>,
    is_trusted_chain: this.txFromJSON<boolean>,
    set_trusted_chain: this.txFromJSON<Result<void>>,
    remove_trusted_chain: this.txFromJSON<Result<void>>,
    interchain_token_id: this.txFromJSON<Buffer>,
    canonical_interchain_token_id: this.txFromJSON<Buffer>,
    interchain_token_address: this.txFromJSON<string>,
    token_manager_address: this.txFromJSON<string>,
    token_address: this.txFromJSON<string>,
    token_manager: this.txFromJSON<string>,
    token_manager_type: this.txFromJSON<TokenManagerType>,
    flow_limit: this.txFromJSON<Option<i128>>,
    flow_out_amount: this.txFromJSON<i128>,
    flow_in_amount: this.txFromJSON<i128>,
    set_flow_limit: this.txFromJSON<Result<void>>,
    deploy_interchain_token: this.txFromJSON<Result<Buffer>>,
    deploy_remote_interchain_token: this.txFromJSON<Result<Buffer>>,
    register_canonical_token: this.txFromJSON<Result<Buffer>>,
    deploy_remote_canonical_token: this.txFromJSON<Result<Buffer>>,
    interchain_transfer: this.txFromJSON<Result<void>>,
    operator: this.txFromJSON<string>,
    transfer_operatorship: this.txFromJSON<null>,
    owner: this.txFromJSON<string>,
    transfer_ownership: this.txFromJSON<null>,
    paused: this.txFromJSON<boolean>,
    pause: this.txFromJSON<null>,
    unpause: this.txFromJSON<null>,
    version: this.txFromJSON<string>,
    upgrade: this.txFromJSON<null>,
    migrate: this.txFromJSON<Result<void>>,
  };
}
