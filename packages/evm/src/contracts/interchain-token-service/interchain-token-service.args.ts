export type DeployAndRegisterRemoteStandardizedTokenArgs = {
  salt: `0x${string}`;
  name: string;
  symbol: string;
  decimals: bigint;
  distributor: `0x${string}`;
  operator: `0x${string}`;
  destinationChain: string;
  gasValue: bigint;
};

export const deployAndRegisterRemoteStandardizedToken = (
  args: DeployAndRegisterRemoteStandardizedTokenArgs
) =>
  [
    args.salt,
    args.name,
    args.symbol,
    args.decimals,
    args.distributor,
    args.operator,
    args.destinationChain,
    args.gasValue,
  ] as const;

export type DeployAndRegisterStandardizedTokenArgs = {
  salt: `0x${string}`;
  name: string;
  symbol: string;
  decimals: bigint;
  mintAmount: bigint;
  distributor: `0x${string}`;
};

export const deployAndRegisterStandardizedToken = (
  args: DeployAndRegisterStandardizedTokenArgs
) =>
  [
    args.salt,
    args.name,
    args.symbol,
    args.decimals,
    args.mintAmount,
    args.distributor,
  ] as const;

export type DeployCustomTokenManagerArgs = {
  salt: `0x${string}`;
  tokenManagerType: bigint;
  params: `0x${string}`;
};

export const deployCustomTokenManager = (args: DeployCustomTokenManagerArgs) =>
  [args.salt, args.tokenManagerType, args.params] as const;

export type DeployRemoteCanonicalTokenArgs = {
  tokenId: `0x${string}`;
  destinationChain: string;
  gasValue: bigint;
};

export const deployRemoteCanonicalToken = (
  args: DeployRemoteCanonicalTokenArgs
) => [args.tokenId, args.destinationChain, args.gasValue] as const;

export type DeployRemoteCustomTokenManagerArgs = {
  salt: `0x${string}`;
  destinationChain: string;
  tokenManagerType: bigint;
  params: `0x${string}`;
  gasValue: bigint;
};

export const deployRemoteCustomTokenManager = (
  args: DeployRemoteCustomTokenManagerArgs
) =>
  [
    args.salt,
    args.destinationChain,
    args.tokenManagerType,
    args.params,
    args.gasValue,
  ] as const;

export type ExecuteArgs = {
  commandId: `0x${string}`;
  sourceChain: string;
  sourceAddress: string;
  payload: `0x${string}`;
};

export const execute = (args: ExecuteArgs) =>
  [args.commandId, args.sourceChain, args.sourceAddress, args.payload] as const;

export type ExecuteWithTokenArgs = {
  commandId: `0x${string}`;
  sourceChain: string;
  sourceAddress: string;
  payload: `0x${string}`;
  tokenSymbol: string;
  amount: bigint;
};

export const executeWithToken = (args: ExecuteWithTokenArgs) =>
  [
    args.commandId,
    args.sourceChain,
    args.sourceAddress,
    args.payload,
    args.tokenSymbol,
    args.amount,
  ] as const;

export type ExpressReceiveTokenArgs = {
  tokenId: `0x${string}`;
  destinationAddress: `0x${string}`;
  amount: bigint;
  commandId: `0x${string}`;
};

export const expressReceiveToken = (args: ExpressReceiveTokenArgs) =>
  [args.tokenId, args.destinationAddress, args.amount, args.commandId] as const;

export type ExpressReceiveTokenWithDataArgs = {
  tokenId: `0x${string}`;
  sourceChain: string;
  sourceAddress: `0x${string}`;
  destinationAddress: `0x${string}`;
  amount: bigint;
  data: `0x${string}`;
  commandId: `0x${string}`;
};

export const expressReceiveTokenWithData = (
  args: ExpressReceiveTokenWithDataArgs
) =>
  [
    args.tokenId,
    args.sourceChain,
    args.sourceAddress,
    args.destinationAddress,
    args.amount,
    args.data,
    args.commandId,
  ] as const;

export type GetCanonicalTokenIdArgs = { tokenAddress: `0x${string}` };

export const getCanonicalTokenId = (args: GetCanonicalTokenIdArgs) =>
  [args.tokenAddress] as const;

export type GetCustomTokenIdArgs = {
  sender: `0x${string}`;
  salt: `0x${string}`;
};

export const getCustomTokenId = (args: GetCustomTokenIdArgs) =>
  [args.sender, args.salt] as const;

export type GetExpressReceiveTokenArgs = {
  tokenId: `0x${string}`;
  destinationAddress: `0x${string}`;
  amount: bigint;
  commandId: `0x${string}`;
};

export const getExpressReceiveToken = (args: GetExpressReceiveTokenArgs) =>
  [args.tokenId, args.destinationAddress, args.amount, args.commandId] as const;

export type GetExpressReceiveTokenWithDataArgs = {
  tokenId: `0x${string}`;
  sourceChain: string;
  sourceAddress: `0x${string}`;
  destinationAddress: `0x${string}`;
  amount: bigint;
  data: `0x${string}`;
  commandId: `0x${string}`;
};

export const getExpressReceiveTokenWithData = (
  args: GetExpressReceiveTokenWithDataArgs
) =>
  [
    args.tokenId,
    args.sourceChain,
    args.sourceAddress,
    args.destinationAddress,
    args.amount,
    args.data,
    args.commandId,
  ] as const;

export type GetFlowInAmountArgs = { tokenId: `0x${string}` };

export const getFlowInAmount = (args: GetFlowInAmountArgs) =>
  [args.tokenId] as const;

export type GetFlowLimitArgs = { tokenId: `0x${string}` };

export const getFlowLimit = (args: GetFlowLimitArgs) => [args.tokenId] as const;

export type GetFlowOutAmountArgs = { tokenId: `0x${string}` };

export const getFlowOutAmount = (args: GetFlowOutAmountArgs) =>
  [args.tokenId] as const;

export type GetImplementationArgs = { tokenManagerType: bigint };

export const getImplementation = (args: GetImplementationArgs) =>
  [args.tokenManagerType] as const;

export type GetParamsLiquidityPoolArgs = {
  operator: `0x${string}`;
  tokenAddress: `0x${string}`;
  liquidityPoolAddress: `0x${string}`;
};

export const getParamsLiquidityPool = (args: GetParamsLiquidityPoolArgs) =>
  [args.operator, args.tokenAddress, args.liquidityPoolAddress] as const;

export type GetParamsLockUnlockArgs = {
  operator: `0x${string}`;
  tokenAddress: `0x${string}`;
};

export const getParamsLockUnlock = (args: GetParamsLockUnlockArgs) =>
  [args.operator, args.tokenAddress] as const;

export type GetParamsMintBurnArgs = {
  operator: `0x${string}`;
  tokenAddress: `0x${string}`;
};

export const getParamsMintBurn = (args: GetParamsMintBurnArgs) =>
  [args.operator, args.tokenAddress] as const;

export type GetStandardizedTokenAddressArgs = { tokenId: `0x${string}` };

export const getStandardizedTokenAddress = (
  args: GetStandardizedTokenAddressArgs
) => [args.tokenId] as const;

export type GetTokenAddressArgs = { tokenId: `0x${string}` };

export const getTokenAddress = (args: GetTokenAddressArgs) =>
  [args.tokenId] as const;

export type GetTokenManagerAddressArgs = { tokenId: `0x${string}` };

export const getTokenManagerAddress = (args: GetTokenManagerAddressArgs) =>
  [args.tokenId] as const;

export type GetValidTokenManagerAddressArgs = { tokenId: `0x${string}` };

export const getValidTokenManagerAddress = (
  args: GetValidTokenManagerAddressArgs
) => [args.tokenId] as const;

export type MulticallArgs = { data: any };

export const multicall = (args: MulticallArgs) => [args.data] as const;

export type RegisterCanonicalTokenArgs = { tokenAddress: `0x${string}` };

export const registerCanonicalToken = (args: RegisterCanonicalTokenArgs) =>
  [args.tokenAddress] as const;

export type SetFlowLimitArgs = { tokenIds: any; flowLimits: any };

export const setFlowLimit = (args: SetFlowLimitArgs) =>
  [args.tokenIds, args.flowLimits] as const;

export type SetOperatorArgs = { operator_: `0x${string}` };

export const setOperator = (args: SetOperatorArgs) => [args.operator_] as const;

export type SetPausedArgs = { paused: boolean };

export const setPaused = (args: SetPausedArgs) => [args.paused] as const;

export type SetupArgs = { data: `0x${string}` };

export const setup = (args: SetupArgs) => [args.data] as const;

export type TransferOwnershipArgs = { newOwner: `0x${string}` };

export const transferOwnership = (args: TransferOwnershipArgs) =>
  [args.newOwner] as const;

export type TransmitSendTokenArgs = {
  tokenId: `0x${string}`;
  sourceAddress: `0x${string}`;
  destinationChain: string;
  destinationAddress: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
};

export const transmitSendToken = (args: TransmitSendTokenArgs) =>
  [
    args.tokenId,
    args.sourceAddress,
    args.destinationChain,
    args.destinationAddress,
    args.amount,
    args.metadata,
  ] as const;

export type UpgradeArgs = {
  newImplementation: `0x${string}`;
  newImplementationCodeHash: `0x${string}`;
  params: `0x${string}`;
};

export const upgrade = (args: UpgradeArgs) =>
  [
    args.newImplementation,
    args.newImplementationCodeHash,
    args.params,
  ] as const;
