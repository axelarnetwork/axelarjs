import ky, { Options } from "ky";

import {
  GetGMPContractsResponse,
  SearchGMPParams,
  SearchGMPResponse,
} from "./types";

export class GMPClient {
  private client: typeof ky;

  constructor(options: Options) {
    this.client = ky.extend(options);
  }

  async searchGMP(params: SearchGMPParams) {
    return await this.client
      .post("", {
        json: {
          ...params,
          method: "searchGMP",
        },
      })
      .json<SearchGMPResponse>()
      .catch(() => ({ data: [] as SearchGMPResponse["data"] }));
  }

  async getContracts() {
    return await this.client
      .post("", {
        json: { method: "getContracts" },
      })
      .json<GetGMPContractsResponse>();
  }
}

export const createGMPClient = (options: Options) => new GMPClient(options);
