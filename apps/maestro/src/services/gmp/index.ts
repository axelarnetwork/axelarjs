import ky from "ky";

import type {
  GetGMPContractsResponse,
  SearchGMPParams,
  SearchGMPResponse,
} from "./types";

const PREFIX_URL = String(process.env.NEXT_PUBLIC_GMP_API_URL);

export const client = ky.extend({
  prefixUrl: PREFIX_URL,
});

async function searchGMP(params: SearchGMPParams) {
  return await client
    .post("", {
      json: {
        ...params,
        method: "searchGMP",
      },
    })
    .json<SearchGMPResponse>()
    .catch(() => ({ data: [] as SearchGMPResponse["data"] }));
}

async function getContracts() {
  return await client
    .post("", {
      json: { method: "getContracts" },
    })
    .json<GetGMPContractsResponse>();
}

const extendedClient = {
  ...client,
  searchGMP,
  getContracts,
};

export default extendedClient;

export { getContracts, searchGMP };
