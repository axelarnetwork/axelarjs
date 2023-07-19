export const deployAndRegisterRemoteStandardizedToken = (args: {
  salt: `0x${string}`;
  name: string;
  symbol: string;
  decimals: bigint;
  distributor: `0x${string}`;
  operator: `0x${string}`;
  destinationChain: string;
  gasValue: bigint;
}) =>
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

export const deployAndRegisterStandardizedToken = (args: {
  salt: `0x${string}`;
  name: string;
  symbol: string;
  decimals: bigint;
  mintAmount: bigint;
  distributor: `0x${string}`;
}) =>
  [
    args.salt,
    args.name,
    args.symbol,
    args.decimals,
    args.mintAmount,
    args.distributor,
  ] as const;

export const deployCustomTokenManager = (args: {
  salt: `0x${string}`;
  tokenManagerType: bigint;
  params: `0x${string}`;
}) => [args.salt, args.tokenManagerType, args.params] as const;

export const deployRemoteCanonicalToken = (args: {
  tokenId: `0x${string}`;
  destinationChain: string;
  gasValue: bigint;
}) => [args.tokenId, args.destinationChain, args.gasValue] as const;

export const deployRemoteCustomTokenManager = (args: {
  salt: `0x${string}`;
  destinationChain: string;
  tokenManagerType: bigint;
  params: `0x${string}`;
  gasValue: bigint;
}) =>
  [
    args.salt,
    args.destinationChain,
    args.tokenManagerType,
    args.params,
    args.gasValue,
  ] as const;

export const execute = (args: {
  commandId: `0x${string}`;
  sourceChain: string;
  sourceAddress: string;
  payload: `0x${string}`;
}) =>
  [args.commandId, args.sourceChain, args.sourceAddress, args.payload] as const;

export const executeWithToken = (args: {
  commandId: `0x${string}`;
  sourceChain: string;
  sourceAddress: string;
  payload: `0x${string}`;
  tokenSymbol: string;
  amount: bigint;
}) =>
  [
    args.commandId,
    args.sourceChain,
    args.sourceAddress,
    args.payload,
    args.tokenSymbol,
    args.amount,
  ] as const;

export const expressReceiveToken = (args: {
  tokenId: `0x${string}`;
  destinationAddress: `0x${string}`;
  amount: bigint;
  commandId: `0x${string}`;
}) =>
  [args.tokenId, args.destinationAddress, args.amount, args.commandId] as const;

export const expressReceiveTokenWithData = (args: {
  tokenId: `0x${string}`;
  sourceChain: string;
  sourceAddress: `0x${string}`;
  destinationAddress: `0x${string}`;
  amount: bigint;
  data: `0x${string}`;
  commandId: `0x${string}`;
}) =>
  [
    args.tokenId,
    args.sourceChain,
    args.sourceAddress,
    args.destinationAddress,
    args.amount,
    args.data,
    args.commandId,
  ] as const;

export const getCanonicalTokenId = (args: { tokenAddress: `0x${string}` }) =>
  [args.tokenAddress] as const;

export const getCustomTokenId = (args: {
  sender: `0x${string}`;
  salt: `0x${string}`;
}) => [args.sender, args.salt] as const;

export const getExpressReceiveToken = (args: {
  tokenId: `0x${string}`;
  destinationAddress: `0x${string}`;
  amount: bigint;
  commandId: `0x${string}`;
}) =>
  [args.tokenId, args.destinationAddress, args.amount, args.commandId] as const;

export const getExpressReceiveTokenWithData = (args: {
  tokenId: `0x${string}`;
  sourceChain: string;
  sourceAddress: `0x${string}`;
  destinationAddress: `0x${string}`;
  amount: bigint;
  data: `0x${string}`;
  commandId: `0x${string}`;
}) =>
  [
    args.tokenId,
    args.sourceChain,
    args.sourceAddress,
    args.destinationAddress,
    args.amount,
    args.data,
    args.commandId,
  ] as const;

export const getFlowInAmount = (args: { tokenId: `0x${string}` }) =>
  [args.tokenId] as const;

export const getFlowLimit = (args: { tokenId: `0x${string}` }) =>
  [args.tokenId] as const;

export const getFlowOutAmount = (args: { tokenId: `0x${string}` }) =>
  [args.tokenId] as const;

export const getImplementation = (args: { tokenManagerType: bigint }) =>
  [args.tokenManagerType] as const;

export const getParamsLiquidityPool = (args: {
  operator: `0x${string}`;
  tokenAddress: `0x${string}`;
  liquidityPoolAddress: `0x${string}`;
}) => [args.operator, args.tokenAddress, args.liquidityPoolAddress] as const;

export const getParamsLockUnlock = (args: {
  operator: `0x${string}`;
  tokenAddress: `0x${string}`;
}) => [args.operator, args.tokenAddress] as const;

export const getParamsMintBurn = (args: {
  operator: `0x${string}`;
  tokenAddress: `0x${string}`;
}) => [args.operator, args.tokenAddress] as const;

export const getStandardizedTokenAddress = (args: { tokenId: `0x${string}` }) =>
  [args.tokenId] as const;

export const getTokenAddress = (args: { tokenId: `0x${string}` }) =>
  [args.tokenId] as const;

export const getTokenManagerAddress = (args: { tokenId: `0x${string}` }) =>
  [args.tokenId] as const;

export const getValidTokenManagerAddress = (args: { tokenId: `0x${string}` }) =>
  [args.tokenId] as const;

export const multicall = (args: { data: any }) => [args.data] as const;

export const registerCanonicalToken = (args: { tokenAddress: `0x${string}` }) =>
  [args.tokenAddress] as const;

export const setFlowLimit = (args: { tokenIds: any; flowLimits: any }) =>
  [args.tokenIds, args.flowLimits] as const;

export const setOperator = (args: { operator_: `0x${string}` }) =>
  [args.operator_] as const;

export const setPaused = (args: { paused: boolean }) => [args.paused] as const;

export const setup = (args: { data: `0x${string}` }) => [args.data] as const;

export const transferOwnership = (args: { newOwner: `0x${string}` }) =>
  [args.newOwner] as const;

export const transmitSendToken = (args: {
  tokenId: `0x${string}`;
  sourceAddress: `0x${string}`;
  destinationChain: string;
  destinationAddress: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
}) =>
  [
    args.tokenId,
    args.sourceAddress,
    args.destinationChain,
    args.destinationAddress,
    args.amount,
    args.metadata,
  ] as const;

export const upgrade = (args: {
  newImplementation: `0x${string}`;
  newImplementationCodeHash: `0x${string}`;
  params: `0x${string}`;
}) =>
  [
    args.newImplementation,
    args.newImplementationCodeHash,
    args.params,
  ] as const;
