export type ApproveArgs = { spender: `0x${string}`; amount: bigint };

export const approve = (args: ApproveArgs) =>
  [args.spender, args.amount] as const;

export type DecreaseAllowanceArgs = {
  spender: `0x${string}`;
  subtractedValue: bigint;
};

export const decreaseAllowance = (args: DecreaseAllowanceArgs) =>
  [args.spender, args.subtractedValue] as const;

export type IncreaseAllowanceArgs = {
  spender: `0x${string}`;
  addedValue: bigint;
};

export const increaseAllowance = (args: IncreaseAllowanceArgs) =>
  [args.spender, args.addedValue] as const;

export type InterchainTransferArgs = {
  destinationChain: string;
  recipient: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
};

export const interchainTransfer = (args: InterchainTransferArgs) =>
  [args.destinationChain, args.recipient, args.amount, args.metadata] as const;

export type InterchainTransferFromArgs = {
  sender: `0x${string}`;
  destinationChain: string;
  recipient: `0x${string}`;
  amount: bigint;
  metadata: `0x${string}`;
};

export const interchainTransferFrom = (args: InterchainTransferFromArgs) =>
  [
    args.sender,
    args.destinationChain,
    args.recipient,
    args.amount,
    args.metadata,
  ] as const;

export type TransferArgs = { recipient: `0x${string}`; amount: bigint };

export const transfer = (args: TransferArgs) =>
  [args.recipient, args.amount] as const;

export type TransferFromArgs = {
  sender: `0x${string}`;
  recipient: `0x${string}`;
  amount: bigint;
};

export const transferFrom = (args: TransferFromArgs) =>
  [args.sender, args.recipient, args.amount] as const;
