import ky from "ky";

import type {
  GetGMPContractsResponse,
  SearchGMPParams,
  SearchGMPResponse,
} from "./types";

export const client = ky.extend({
  prefixUrl: String(process.env.NEXT_PUBLIC_GMP_API_URL),
});

async function searchGMP(params: SearchGMPParams) {
  return await client
    .post("", {
      json: {
        ...params,
        method: "searchGMP",
      },
    })
    .json<SearchGMPResponse>();
}

async function getContracts() {
  return await client
    .post("", {
      json: { method: "getContracts" },
    })
    .json<GetGMPContractsResponse>();
}

export { getContracts, searchGMP };
