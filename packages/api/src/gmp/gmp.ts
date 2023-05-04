import ky, { Options } from "ky";
import { always } from "rambda";

import {
  GetContractsResponse,
  GetGasPriceParams,
  GetGasPriceResponse,
  GetGMPChartResponse,
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
        json: { ...params, method: "searchGMP" },
      })
      .json<SearchGMPResponse>()
      .catch(always({ data: [] as SearchGMPResponse["data"] }))
      .then((res) => res.data);
  }

  async getContracts() {
    return await this.client
      .post("", { json: { method: "getContracts" } })
      .json<GetContractsResponse>();
  }

  async getGasPrice(params: GetGasPriceParams) {
    return await this.client
      .post("", {
        json: { ...params, method: "getGasPrice" },
      })
      .json<GetGasPriceResponse>()
      .then((res) => res.result);
  }

  async getGMPChart() {
    return await this.client
      .post("", { json: { method: "GMPChart" } })
      .json<GetGMPChartResponse>()
      .then((res) => res.data);
  }
}

export const createGMPClient = (options: Options) => new GMPClient(options);
