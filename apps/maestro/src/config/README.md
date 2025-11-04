# Config

This directory contains configuration files for the project, such as environment variables, wagmi configuration, and other project-wide settings.

## Overriding RPC Nodes for the server

To override RPC nodes for server-side operations, update the corresponding environment variable following the pattern `RPC_{CHAIN_ID}_{ENVIRONMENT}`. Note that hyphens in chain IDs are automatically converted to underscores for valid environment variable names. For example:

- `RPC_hedera_testnet` - hedera testnet RPC URL
- `RPC_ethereum_mainnet` - ethereum mainnet RPC URL
- `RPC_polygon_sepolia_testnet` - polygon-sepolia testnet RPC URL (note underscores instead of hyphens)
