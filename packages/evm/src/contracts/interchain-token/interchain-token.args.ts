export const approve = (args: { spender: `0x${string}`; amount: bigint }) =>
  [args.spender, args.amount] as const;

export const decreaseAllowance = (args: {
  spender: `0x${string}`;
  subtractedValue: bigint;
}) => [args.spender, args.subtractedValue] as const;

export const increaseAllowance = (args: {
  spender: `0x${string}`;
  addedValue: bigint;
}) => [args.spender, args.addedValue] as const;

export const interchainTransfer = (args: {
  destinationChain: string;
  recipient: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
}) =>
  [args.destinationChain, args.recipient, args.amount, args.metadata] as const;

export const interchainTransferFrom = (args: {
  sender: `0x${string}`;
  destinationChain: string;
  recipient: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
}) =>
  [
    args.sender,
    args.destinationChain,
    args.recipient,
    args.amount,
    args.metadata,
  ] as const;

export const transfer = (args: { recipient: `0x${string}`; amount: bigint }) =>
  [args.recipient, args.amount] as const;

export const transferFrom = (args: {
  sender: `0x${string}`;
  recipient: `0x${string}`;
  amount: bigint;
}) => [args.sender, args.recipient, args.amount] as const;
