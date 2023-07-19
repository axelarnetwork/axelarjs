export type CallContractWithInterchainTokenArgs = {
  destinationChain: string;
  destinationAddress: `0x${string}`;
  amount: bigint;
  data: `0x${string}`;
};

export const callContractWithInterchainToken = (
  args: CallContractWithInterchainTokenArgs
) =>
  [
    args.destinationChain,
    args.destinationAddress,
    args.amount,
    args.data,
  ] as const;

export type GiveTokenArgs = {
  destinationAddress: `0x${string}`;
  amount: bigint;
};

export const giveToken = (args: GiveTokenArgs) =>
  [args.destinationAddress, args.amount] as const;

export type SendTokenArgs = {
  destinationChain: string;
  destinationAddress: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
};

export const sendToken = (args: SendTokenArgs) =>
  [
    args.destinationChain,
    args.destinationAddress,
    args.amount,
    args.metadata,
  ] as const;

export type SetFlowLimitArgs = { flowLimit: bigint };

export const setFlowLimit = (args: SetFlowLimitArgs) =>
  [args.flowLimit] as const;

export type SetOperatorArgs = { operator_: `0x${string}` };

export const setOperator = (args: SetOperatorArgs) => [args.operator_] as const;

export type SetupArgs = { params: `0x${string}` };

export const setup = (args: SetupArgs) => [args.params] as const;

export type TransmitInterchainTransferArgs = {
  sender: `0x${string}`;
  destinationChain: string;
  destinationAddress: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
};

export const transmitInterchainTransfer = (
  args: TransmitInterchainTransferArgs
) =>
  [
    args.sender,
    args.destinationChain,
    args.destinationAddress,
    args.amount,
    args.metadata,
  ] as const;
