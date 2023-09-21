import { type DeliverTxResponse } from "@cosmjs/stargate";

export const MOCK_BROADCAST_RESPONSE: DeliverTxResponse = {
  code: 0,
  height: 9686684,
  txIndex: 0,
  events: [
    {
      type: "coin_spent",
      attributes: [
        {
          key: "spender",
          value: "axelar172tq50dpww7q29xj9qg0lvwwxcw96mtv70hypp",
        },
        { key: "amount", value: "100000uaxl" },
      ],
    },
    {
      type: "coin_received",
      attributes: [
        {
          key: "receiver",
          value: "axelar17xpfvakm2amg962yls6f84z3kell8c5l5h4gqu",
        },
        { key: "amount", value: "100000uaxl" },
      ],
    },
    {
      type: "transfer",
      attributes: [
        {
          key: "recipient",
          value: "axelar17xpfvakm2amg962yls6f84z3kell8c5l5h4gqu",
        },
        {
          key: "sender",
          value: "axelar172tq50dpww7q29xj9qg0lvwwxcw96mtv70hypp",
        },
        { key: "amount", value: "100000uaxl" },
      ],
    },
    {
      type: "message",
      attributes: [
        {
          key: "sender",
          value: "axelar172tq50dpww7q29xj9qg0lvwwxcw96mtv70hypp",
        },
      ],
    },
    {
      type: "tx",
      attributes: [
        { key: "fee", value: "100000uaxl" },
        {
          key: "fee_payer",
          value: "axelar172tq50dpww7q29xj9qg0lvwwxcw96mtv70hypp",
        },
      ],
    },
    {
      type: "tx",
      attributes: [
        {
          key: "acc_seq",
          value: "axelar172tq50dpww7q29xj9qg0lvwwxcw96mtv70hypp/4",
        },
      ],
    },
    {
      type: "tx",
      attributes: [
        {
          key: "signature",
          value:
            "yWhuseXee+GyYGWRpFZAkCsz6C3OvPFCbKEaxDyrF+MJoh60bDH7q6P1HK0ao1LH1S6tQTBFZ/L0zlnLQhSG/A==",
        },
      ],
    },
    { type: "message", attributes: [{ key: "action", value: "Link" }] },
    {
      type: "link",
      attributes: [
        { key: "module", value: "evm" },
        { key: "sourceChain", value: "Fantom" },
        {
          key: "depositAddress",
          value: "0xEDd4636AEC9bD6566CfD76356d4aBcE4A7f66dCd",
        },
        {
          key: "destinationAddress",
          value: "0xB8Cd93C83A974649D76B1c19f311f639e62272BC",
        },
        { key: "destinationChain", value: "Avalanche" },
        {
          key: "tokenAddress",
          value: "0x8776aDD48553518641a589C39792cc409d4C8B84",
        },
        { key: "asset", value: "wavax-wei" },
      ],
    },
  ],
  rawLog:
    '[{"log":"successfully linked deposit 0xEDd4636AEC9bD6566CfD76356d4aBcE4A7f66dCd to recipient 0xB8Cd93C83A974649D76B1c19f311f639e62272BC","events":[{"type":"link","attributes":[{"key":"module","value":"evm"},{"key":"sourceChain","value":"Fantom"},{"key":"depositAddress","value":"0xEDd4636AEC9bD6566CfD76356d4aBcE4A7f66dCd"},{"key":"destinationAddress","value":"0xB8Cd93C83A974649D76B1c19f311f639e62272BC"},{"key":"destinationChain","value":"Avalanche"},{"key":"tokenAddress","value":"0x8776aDD48553518641a589C39792cc409d4C8B84"},{"key":"asset","value":"wavax-wei"}]},{"type":"message","attributes":[{"key":"action","value":"Link"}]}]}]',
  transactionHash:
    "89B8EF1116ADD0B6CD8E301AA101E34DBFFA2D415E57EAB200F6551AD03BD050",
  msgResponses: [],
  gasUsed: 91141,
  gasWanted: 500000,
};
