export const callContractWithInterchainToken = (args: {
  destinationChain: string;
  destinationAddress: `0x${string}`;
  amount: bigint;
  data: `0x${string}`;
}) =>
  [
    args.destinationChain,
    args.destinationAddress,
    args.amount,
    args.data,
  ] as const;

export const giveToken = (args: {
  destinationAddress: `0x${string}`;
  amount: bigint;
}) => [args.destinationAddress, args.amount] as const;

export const sendToken = (args: {
  destinationChain: string;
  destinationAddress: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
}) =>
  [
    args.destinationChain,
    args.destinationAddress,
    args.amount,
    args.metadata,
  ] as const;

export const setFlowLimit = (args: { flowLimit: bigint }) =>
  [args.flowLimit] as const;

export const setOperator = (args: { operator_: `0x${string}` }) =>
  [args.operator_] as const;

export const setup = (args: { params: `0x${string}` }) =>
  [args.params] as const;

export const transmitInterchainTransfer = (args: {
  sender: `0x${string}`;
  destinationChain: string;
  destinationAddress: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
}) =>
  [
    args.sender,
    args.destinationChain,
    args.destinationAddress,
    args.amount,
    args.metadata,
  ] as const;
