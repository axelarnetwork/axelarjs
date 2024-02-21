// import { generateOpenApiDocument } from "trpc-openapi";

// import { getBaseUrl } from "~/lib/trpc";
// import { appRouter } from "./routers/_app";

// // Generate OpenAPI schema document
// export const openApiDocument = generateOpenApiDocument(appRouter, {
//   title: "Interchain Token Service API",
//   description: "Interchain Token Service API, search interchain tokens",
//   version: "1.0.0",
//   baseUrl: `${getBaseUrl()}/api`,
//   docsUrl: "https://github.com/axelarnetwork/axelarjs/tree/main/apps/maestro",
//   tags: ["interchain-token", "abi", "gmp"],
// });

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Interchain Token Service API",
    description: "Interchain Token Service API, search interchain tokens",
    version: "1.0.0",
  },
  servers: [
    { url: "https://axelar-maestro-8isrjgo69-axelar-network.vercel.app/api" },
  ],
  paths: {
    "/chain-configs/evm": {
      get: {
        operationId: "axelarscan-getEVMChainConfigs",
        summary: "Get EVM chain configs",
        description: "Get EVM chain configs",
        tags: ["chain-configs"],
        parameters: [
          {
            name: "axelarChainId",
            in: "query",
            required: false,
            schema: { type: "string", maxLength: 64 },
          },
          {
            name: "chainId",
            in: "query",
            required: false,
            schema: { type: "number" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      deprecated: { type: "boolean" },
                      chain_id: { type: "number" },
                      chain_name: { type: "string" },
                      maintainer_id: { type: "string" },
                      name: { type: "string" },
                      image: { type: "string" },
                      color: { type: "string" },
                      chain_type: { type: "string", enum: ["evm"] },
                      gateway_address: { type: "string" },
                      no_inflation: { type: "boolean" },
                      endpoints: {
                        type: "object",
                        properties: {
                          rpc: { type: "array", items: { type: "string" } },
                        },
                        required: ["rpc"],
                        additionalProperties: false,
                      },
                      native_token: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          symbol: { type: "string" },
                          decimals: { type: "number" },
                        },
                        required: ["name", "symbol", "decimals"],
                        additionalProperties: false,
                      },
                      explorer: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          url: { type: "string" },
                          icon: { type: "string" },
                          block_path: { type: "string" },
                          address_path: { type: "string" },
                          contract_path: { type: "string" },
                          contract_0_path: { type: "string" },
                          transaction_path: { type: "string" },
                        },
                        required: [
                          "name",
                          "url",
                          "icon",
                          "block_path",
                          "address_path",
                          "contract_path",
                          "contract_0_path",
                          "transaction_path",
                        ],
                        additionalProperties: false,
                      },
                      provider_params: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            chainId: { type: "string" },
                            chainName: { type: "string" },
                            rpcUrls: {
                              type: "array",
                              items: { type: "string" },
                            },
                            nativeCurrency: {
                              type: "object",
                              properties: {
                                name: { type: "string" },
                                symbol: { type: "string" },
                                decimals: { type: "number" },
                              },
                              required: ["name", "symbol", "decimals"],
                              additionalProperties: false,
                            },
                            blockExplorerUrls: {
                              type: "array",
                              items: { type: "string" },
                            },
                          },
                          required: [
                            "chainId",
                            "chainName",
                            "rpcUrls",
                            "nativeCurrency",
                            "blockExplorerUrls",
                          ],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: [
                      "id",
                      "chain_id",
                      "chain_name",
                      "maintainer_id",
                      "name",
                      "image",
                      "color",
                      "chain_type",
                      "gateway_address",
                      "no_inflation",
                      "endpoints",
                      "native_token",
                      "explorer",
                      "provider_params",
                    ],
                    additionalProperties: false,
                  },
                },
              },
            },
          },
          default: { $ref: "#/components/responses/error" },
        },
      },
    },
    "/chain-infos/{axelarChainId}": {
      get: {
        operationId: "axelarjsSDK-getChainInfo",
        summary: "Get chain info for a given chain",
        description:
          "Get chain info for a given chain by providing its chain id on Axelar",
        tags: ["chain-infos"],
        parameters: [
          {
            name: "axelarChainId",
            in: "path",
            required: true,
            schema: { type: "string", maxLength: 64 },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    chainName: { type: "string" },
                    blockConfirmations: { type: "number" },
                    estimatedWaitTimeInMinutes: { type: "number" },
                  },
                  required: ["id", "chainName", "estimatedWaitTimeInMinutes"],
                  additionalProperties: false,
                },
              },
            },
          },
          default: { $ref: "#/components/responses/error" },
        },
      },
    },
    "/axelar-chain-configs": {
      get: {
        operationId: "axelarConfigs-getChainConfigs",
        summary: "Get the full configs for a chain on the Axelar network",
        description:
          "Get the full configs for a chain on the Axelar network, including the assets registered directly on the network",
        tags: ["axelar-chain-configs"],
        parameters: [
          {
            name: "axelarChainId",
            in: "query",
            required: true,
            schema: { type: "string", maxLength: 64 },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: { "application/json": { schema: {} } },
          },
          default: { $ref: "#/components/responses/error" },
        },
      },
    },
    "/interchain-token/abi": {
      get: {
        operationId: "interchainToken-getInterchainTokenABI",
        summary: "Get the ABI for the InterchainToken contract",
        description: "Get the ABI for the InterchainToken contract",
        tags: ["abi"],
        parameters: [],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      inputs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            type: { type: "string" },
                            internalType: { type: "string" },
                            anonymous: { type: "boolean" },
                            indexed: { type: "boolean" },
                          },
                          additionalProperties: false,
                        },
                      },
                      name: { type: "string" },
                      outputs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            type: { type: "string" },
                            internalType: { type: "string" },
                            anonymous: { type: "boolean" },
                            indexed: { type: "boolean" },
                          },
                          additionalProperties: false,
                        },
                      },
                      type: { type: "string" },
                    },
                    additionalProperties: false,
                  },
                },
              },
            },
          },
          default: { $ref: "#/components/responses/error" },
        },
      },
    },
    "/interchain-token-service/abi": {
      get: {
        operationId: "interchainToken-getInterchainTokenServiceABI",
        summary: "Get the ABI for the InterchainTokenService contract",
        description: "Get the ABI for the InterchainTokenService contract",
        tags: ["abi"],
        parameters: [],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      inputs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            type: { type: "string" },
                            internalType: { type: "string" },
                            anonymous: { type: "boolean" },
                            indexed: { type: "boolean" },
                          },
                          additionalProperties: false,
                        },
                      },
                      name: { type: "string" },
                      outputs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            type: { type: "string" },
                            internalType: { type: "string" },
                            anonymous: { type: "boolean" },
                            indexed: { type: "boolean" },
                          },
                          additionalProperties: false,
                        },
                      },
                      type: { type: "string" },
                    },
                    additionalProperties: false,
                  },
                },
              },
            },
          },
          default: { $ref: "#/components/responses/error" },
        },
      },
    },
    "/interchain-token/details": {
      get: {
        operationId: "interchainToken-getInterchainTokenDetails",
        summary: "Get token details for an interchain token",
        description:
          "Get the details for an interchain token by address and chain ID",
        tags: ["interchain-token"],
        parameters: [
          {
            name: "chainId",
            in: "query",
            required: true,
            schema: { type: "number" },
          },
          {
            name: "tokenAddress",
            in: "query",
            required: true,
            schema: { type: "string", pattern: "^0x[0-9a-fA-F]{40}$" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tokenId: { type: "string" },
                    tokenAddress: {
                      type: "string",
                      pattern: "^0x[0-9a-fA-F]{40}$",
                    },
                    axelarChainId: { type: "string" },
                    tokenName: { type: "string" },
                    tokenSymbol: { type: "string" },
                    tokenDecimals: { type: "number" },
                    deploymentMessageId: { type: "string" },
                    deployerAddress: {
                      type: "string",
                      pattern: "^0x[0-9a-fA-F]{40}$",
                    },
                    tokenManagerAddress: {
                      type: "string",
                      pattern: "^0x[0-9a-fA-F]{40}$",
                      nullable: true,
                    },
                    tokenManagerType: {
                      type: "string",
                      enum: [
                        "mint_burn",
                        "mint_burn_from",
                        "lock_unlock",
                        "lock_unlock_fee",
                        "gateway",
                      ],
                      nullable: true,
                    },
                    originalMinterAddress: {
                      type: "string",
                      pattern: "^0x[0-9a-fA-F]{40}$",
                      nullable: true,
                    },
                    kind: { type: "string" },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    updatedAt: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    salt: {
                      anyOf: [
                        { type: "string", pattern: "^0x[0-9a-fA-F]{64}$" },
                        { type: "string", pattern: "^0x", maxLength: 2 },
                      ],
                    },
                    remoteTokens: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          tokenId: { type: "string" },
                          axelarChainId: { type: "string" },
                          tokenAddress: {
                            type: "string",
                            pattern: "^0x[0-9a-fA-F]{40}$",
                          },
                          tokenManagerAddress: {
                            type: "string",
                            pattern: "^0x[0-9a-fA-F]{40}$",
                            nullable: true,
                          },
                          tokenManagerType: {
                            type: "string",
                            enum: [
                              "mint_burn",
                              "mint_burn_from",
                              "lock_unlock",
                              "lock_unlock_fee",
                              "gateway",
                            ],
                            nullable: true,
                          },
                          deploymentMessageId: { type: "string" },
                          deploymentStatus: { type: "string", nullable: true },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                          },
                        },
                        required: [
                          "id",
                          "tokenId",
                          "axelarChainId",
                          "tokenAddress",
                          "tokenManagerAddress",
                          "tokenManagerType",
                          "deploymentMessageId",
                          "deploymentStatus",
                          "createdAt",
                          "updatedAt",
                        ],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: [
                    "tokenId",
                    "tokenAddress",
                    "axelarChainId",
                    "tokenName",
                    "tokenSymbol",
                    "tokenDecimals",
                    "deploymentMessageId",
                    "deployerAddress",
                    "tokenManagerAddress",
                    "tokenManagerType",
                    "originalMinterAddress",
                    "kind",
                    "createdAt",
                    "updatedAt",
                    "salt",
                    "remoteTokens",
                  ],
                  additionalProperties: false,
                },
              },
            },
          },
          default: { $ref: "#/components/responses/error" },
        },
      },
    },
    "/token-manager/abi": {
      get: {
        operationId: "interchainToken-getTokenManagerABI",
        summary: "Get the ABI for the TokenManager contract",
        description: "Get the ABI for the TokenManager contract",
        tags: ["abi"],
        parameters: [],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      inputs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            type: { type: "string" },
                            internalType: { type: "string" },
                            anonymous: { type: "boolean" },
                            indexed: { type: "boolean" },
                          },
                          additionalProperties: false,
                        },
                      },
                      name: { type: "string" },
                      outputs: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            type: { type: "string" },
                            internalType: { type: "string" },
                            anonymous: { type: "boolean" },
                            indexed: { type: "boolean" },
                          },
                          additionalProperties: false,
                        },
                      },
                      type: { type: "string" },
                    },
                    additionalProperties: false,
                  },
                },
              },
            },
          },
          default: { $ref: "#/components/responses/error" },
        },
      },
    },
    "/interchain-token/search": {
      get: {
        operationId: "interchainToken-searchInterchainToken",
        summary: "Search for an interchain token",
        description:
          "Search for an interchain token by address, either on a specific chain or on any chain",
        tags: ["interchain-token"],
        parameters: [
          {
            name: "chainId",
            in: "query",
            required: false,
            schema: { type: "number" },
          },
          {
            name: "tokenAddress",
            in: "query",
            required: true,
            schema: { type: "string", pattern: "^0x[0-9a-fA-F]{40}$" },
          },
          {
            name: "strict",
            in: "query",
            required: false,
            schema: { type: "boolean" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    chainId: { type: "number" },
                    chainName: { type: "string" },
                    axelarChainId: { type: "string" },
                    tokenId: {
                      type: "string",
                      pattern: "^0x[0-9a-fA-F]+$",
                      nullable: true,
                    },
                    tokenAddress: {
                      type: "string",
                      pattern: "^0x[0-9a-fA-F]{40}$",
                      nullable: true,
                    },
                    tokenManagerAddress: {
                      type: "string",
                      pattern: "^0x[0-9a-fA-F]{40}$",
                      nullable: true,
                    },
                    tokenManagerType: {
                      type: "string",
                      enum: [
                        "mint_burn",
                        "mint_burn_from",
                        "lock_unlock",
                        "lock_unlock_fee",
                        "gateway",
                      ],
                      nullable: true,
                    },
                    isOriginToken: { type: "boolean", nullable: true },
                    isRegistered: { type: "boolean" },
                    kind: {
                      type: "string",
                      enum: ["interchain", "canonical", "custom"],
                    },
                    wasDeployedByAccount: { type: "boolean" },
                    matchingTokens: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          chainId: { type: "number" },
                          chainName: { type: "string" },
                          axelarChainId: { type: "string" },
                          tokenId: {
                            type: "string",
                            pattern: "^0x[0-9a-fA-F]+$",
                            nullable: true,
                          },
                          tokenAddress: {
                            type: "string",
                            pattern: "^0x[0-9a-fA-F]{40}$",
                            nullable: true,
                          },
                          tokenManagerAddress: {
                            type: "string",
                            pattern: "^0x[0-9a-fA-F]{40}$",
                            nullable: true,
                          },
                          tokenManagerType: {
                            type: "string",
                            enum: [
                              "mint_burn",
                              "mint_burn_from",
                              "lock_unlock",
                              "lock_unlock_fee",
                              "gateway",
                            ],
                            nullable: true,
                          },
                          isOriginToken: { type: "boolean", nullable: true },
                          isRegistered: { type: "boolean" },
                          kind: {
                            type: "string",
                            enum: ["interchain", "canonical", "custom"],
                          },
                        },
                        required: [
                          "chainId",
                          "chainName",
                          "axelarChainId",
                          "tokenId",
                          "tokenAddress",
                          "tokenManagerType",
                          "isOriginToken",
                          "isRegistered",
                          "kind",
                        ],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: [
                    "chainId",
                    "chainName",
                    "axelarChainId",
                    "tokenId",
                    "tokenAddress",
                    "tokenManagerType",
                    "isOriginToken",
                    "isRegistered",
                    "kind",
                    "wasDeployedByAccount",
                    "matchingTokens",
                  ],
                  additionalProperties: false,
                },
              },
            },
          },
          default: { $ref: "#/components/responses/error" },
        },
      },
    },
  },
  components: {
    securitySchemes: { Authorization: { type: "http", scheme: "bearer" } },
    responses: {
      error: {
        description: "Error response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
                code: { type: "string" },
                issues: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { message: { type: "string" } },
                    required: ["message"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["message", "code"],
              additionalProperties: false,
            },
          },
        },
      },
    },
  },
  tags: [{ name: "interchain-token" }, { name: "abi" }, { name: "gmp" }],
  externalDocs: {
    url: "https://github.com/axelarnetwork/axelarjs/tree/main/apps/maestro",
  },
};
