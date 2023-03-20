import ky from "ky";

import type { SearchGMPParams } from "./types";

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
    .json();
}

async function getContracts(params = {}) {
  // await request({
  //   ...params,
  //   method: "getContracts",
  // });
  return new Promise((resolve) => {
    resolve([]);
  });
}

export { getContracts, searchGMP };
