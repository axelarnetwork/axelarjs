const payload = {
  method: "searchGMP",
  size: 25000,
  destinationContractAddress: "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C",
  contractMethod: "InterchainTransfer",
  _source: {
    includes: [
      "interchain_transfer.name",
      "interchain_transfer.symbol",
      "interchain_transfer.contract_address",
      "interchain_transfer.tokenId",
      "call.transactionHash",
    ],
    excludes: [
      "call.returnValues",
      "call.transaction",
      "call.event",
      "call.chain",
      "call.destination_chain_type",
      "call._logIndex",
      "call.chain_type",
      "call.blockNumber",
      "call.block_timestamp",
      "refunded",
      "to_refund",
      "fees",
      "gas",
      "time_spent",
      "confirm",
      "gas_price_rate",
      "gas_paid",
      "approved",
      "executing_at",
      "command_id",
      "is_not_enough_gas",
      "is_call_from_relayer",
      "is_insufficient_fee",
      "not_enough_gas_to_execute",
      "simplified_status",
      "gas_status",
      "is_two_way",
      "is_execute_from_relayer",
      "not_to_refund",
      "no_gas_remain",
    ],
  },
};
export const getPayload = (start: number, end: number) => {
  return { ...payload, fromTime: start, toTime: end };
};
const transformTransfers = async (start: number, end: number) => {
  const data = await fetch("https://api.gmp.axelarscan.io", {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(getPayload(start, end)),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.data.length === 0) throw new Error("no data");
      const filtered = res.data.filter((t: any) => t.status === "executed");
      const results = filtered.map((t: any) => ({
        call: {
          transactionHash: t.call.transactionHash,
          _logIndex: t.call.logIndex ?? t.call._logIndex,
        },
        interchain_transfer: t.interchain_transfer,
      }));
      return results;
    });
  return data;
};

const run = async () => {
  const ranges = getUnixTimestampRanges("2024-02-07");

  const res = await Promise.all(
    ranges.map(async (range) => await transformTransfers(range[0], range[1]))
  );
  console.log(JSON.stringify(res.flat()));
};

function getUnixTimestampRanges(startDate: string) {
  const currentDate = new Date();
  const timestamps = [];
  const date = new Date(startDate);
  date.setHours(0, 0, 0, 0);

  while (date < currentDate) {
    timestamps.push(Math.floor(date.getTime() / 1000));
    date.setDate(date.getDate() + 1);
  }
  const ranges = [];

  for (let i = 0; i < timestamps.length - 1; i++) {
    ranges.push([timestamps[i], timestamps[i + 1]]);
  }

  return ranges;
}

await run();
