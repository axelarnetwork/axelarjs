import { BaseHttpClient } from "./baseHTTPClient";

/**
 * Defines the runtime target for the HTTP client, either "browser" or "node".
 */
export type ClientTarget = "browser" | "node";

/**
 * Configuration options for creating an instance of `IsomorphicHTTPClient`.
 * The type is a discriminated union based on the target ("browser" or "node").
 */
export type ClientOptions = {
  /**
   * The underlying HTTP client instance for browser, based on Ky.
   */
  instance: BaseHttpClient;
};

/**
 * Metadata to provide additional information about the client.
 */
export type ClientMeta = {
  /**
   * The name of the client.
   */
  name: string;
  /**
   * The version of the client.
   */
  version: string;
};

/**
 * Abstract class that defines an isomorphic HTTP client.
 * This can be used both in browser and Node.js environments.
 */
export abstract class IsomorphicHTTPClient {
  /**
   * The name of the HTTP client.
   */
  public name: string;
  /**
   * The version of the HTTP client.
   */
  public version: string;

  /**
   * The internal client instance
   */
  protected client: BaseHttpClient;

  /**
   * Constructs a new instance of `IsomorphicHTTPClient`.
   *
   * @param client - Configuration options for the client instance.
   * @param meta - Optional metadata like name and version for the client.
   */
  constructor(client: ClientOptions, meta?: ClientMeta) {
    this.client = client.instance;
    this.name = meta?.name ?? "HTTPClient";
    this.version = meta?.version ?? "0.0.0";
  }
}
