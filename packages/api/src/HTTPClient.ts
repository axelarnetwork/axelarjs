import ky, { Options as KyOptions } from "ky";

export type Options = KyOptions;

export abstract class HTTPClient {
  protected client: typeof ky;

  public name: string;
  public version: string;

  constructor(
    options: Options,
    meta?: {
      name: string;
      version: string;
    }
  ) {
    this.client = ky.extend(options);

    this.name = meta?.name ?? "HTTPClient";
    this.version = meta?.version ?? "0.0.0";
  }
}
