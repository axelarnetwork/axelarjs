# Config

This directory contains configuration files for the project, such as environment variables, wagmi configuration, and other project-wide settings.

## Overriding RPC Nodes for the server

To override RPC nodes for server-side operations, update the corresponding environment variable following the pattern `RPC_{CHAIN_ID}_{ENVIRONMENT}`. For example:

- `RPC_hedera_testnet` - Hedera testnet RPC URL
- `RPC_ethereum_mainnet` - Ethereum mainnet RPC URL
