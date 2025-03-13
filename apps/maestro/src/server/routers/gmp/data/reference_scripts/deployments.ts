const deployPayload = {
  method: "searchGMP",
  size: 25000,
  destinationContractAddress: process.env
    .NEXT_PUBLIC_INTERCHAIN_TOKEN_SERVICE_ADDRESS as `0x${string}`,
  contractMethod:
    "InterchainTokenDeploymentStarted,TokenManagerDeploymentStarted",
  _source: {
    includes: [
      "interchain_token_deployment_started.tokenId",
      "token_manager_deployment_started.tokenId",
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
export const getDeploymentsPayload = (start: number, end: number) => {
  return { ...deployPayload, fromTime: start, toTime: end };
};

const transformDeployments = async (start: number, end: number) => {
  const data = await fetch("https://api.gmp.axelarscan.io", {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(getDeploymentsPayload(start, end)),
  })
    .then((res) => res.json())
    .then((res) => {
      const filtered = res.data.filter((t: any) => t.status === "executed");
      const results = filtered.map((t: any) => ({
        call: {
          transactionHash: t.call.transactionHash,
          _logIndex: t.call.logIndex ?? t.call._logIndex,
        },
        interchain_token_deployment_started:
          t.interchain_token_deployment_started,
        token_manager_deployment_started: t.token_manager_deployment_started,
      }));
      return results;
    });
  return data;
};

const run = async () => {
  const ranges: any = getUnixTimestampRanges("2024-02-07");

  const res = await Promise.all(
    ranges.map(
      async (range: number[]) => await transformDeployments(range[0], range[1])
    )
  );
  const results = res.flat();
  console.log(JSON.stringify(results));
  return results;
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
