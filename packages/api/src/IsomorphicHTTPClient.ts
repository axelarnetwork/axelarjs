import type { Got } from "got/dist/source";
import type { KyInstance } from "ky/distribution/types/ky";

/**
 * Defines the runtime target for the HTTP client, either "browser" or "node".
 */
export type ClientTarget = "browser" | "node";

/**
 * Configuration options for creating an instance of `IsomorphicHTTPClient`.
 * The type is a discriminated union based on the target ("browser" or "node").
 */
export type ClientOptions =
  | {
      /**
       * Indicates that the client will run in a browser environment.
       */
      target: "browser";
      /**
       * The underlying HTTP client instance for browser, based on Ky.
       */
      instance: KyInstance;
    }
  | {
      /**
       * Indicates that the client will run in a Node.js environment.
       */
      target: "node";
      /**
       * The underlying HTTP client instance for Node.js, based on Got.
       */
      instance: Got;
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
   * The runtime target of the HTTP client, either "browser" or "node".
   */
  public target: ClientTarget;

  /**
   * The internal client instance, either based on Ky for browsers or Got for Node.js.
   */
  protected client: KyInstance | Got;

  /**
   * Constructs a new instance of `IsomorphicHTTPClient`.
   *
   * @param client - Configuration options for the client instance.
   * @param meta - Optional metadata like name and version for the client.
   */
  constructor(client: ClientOptions, meta?: ClientMeta) {
    this.client = client.instance;
    this.target = client.target;
    this.name = meta?.name ?? "HTTPClient";
    this.version = meta?.version ?? "0.0.0";
  }
}
