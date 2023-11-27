export type ABIInputItem = {
  name: string;
  type: string;
};

export type ABIItem = {
  name: string;
  type: string;
  inputs: {
    name: string;
    type: string;
  }[];
  stateMutability?: string;
};
