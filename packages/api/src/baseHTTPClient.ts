import fetch from "isomorphic-unfetch";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type Body =
  | {
      json: Record<string, unknown>;
    }
  | {
      [key: string]: unknown;
    };

/**
 * Interface describing the unwrapper object returned by the `requestWithUnwrapper` method.
 */
interface Unwrapper {
  json: <T>() => Promise<T>;
  text: () => Promise<string>;
}

/**
 * Interface describing the options for the BaseHttpClient.
 */
export interface BaseHttpClientOptions {
  prefixUrl?: string;
  defaultHeaders?: Record<string, string>;
  credentials?: "include" | "omit";
}

/**
 * A basic HTTP client supporting various HTTP methods and isomorphic in nature.
 * Uses `isomorphic-unfetch` as the underlying fetch implementation.
 */
export class BaseHttpClient {
  private prefixUrl = "";
  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  private credentials: "include" | "omit" = "omit";

  /**
   * Creates a new instance of the BaseHttpClient.
   * @param options - Configuration options for the client.
   */
  constructor(options: BaseHttpClientOptions = {}) {
    this.prefixUrl = options.prefixUrl ?? "";
    this.defaultHeaders = { ...this.defaultHeaders, ...options.defaultHeaders };
    this.credentials = options.credentials ?? "omit";
  }

  /**
   * Creates and returns a new BaseHttpClient instance with the provided options.
   * @param options - Configuration options to extend the client with.
   */
  static extend(options: BaseHttpClientOptions) {
    return new BaseHttpClient(options);
  }

  /**
   * Internal method to make the actual fetch request.
   * @param path - The API endpoint path.
   * @param method - The HTTP method to use.
   * @param body - The request body (if any).
   */
  private async request<T>(
    path: string,
    method: HttpMethod = "GET",
    body?: T
  ): Promise<Response> {
    const url = new URL(path, this.prefixUrl).toString();

    const response = await fetch(url, {
      method,
      headers: this.defaultHeaders,
      body: body ? JSON.stringify(body) : null,
      credentials: this.credentials,
    });

    if (!response.ok) {
      // Improved error handling here
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  /**
   * Makes a GET request.
   * @param path - The API endpoint path.
   * @returns Object with a method `json` that can be used to retrieve the parsed response.
   */
  get(path: string) {
    return this.requestWithUnwrapper("GET", path);
  }

  /**
   * Makes a POST request.
   * @param path - The API endpoint path.
   * @param body - The request body to send.
   * @returns Object with a method `json` that can be used to retrieve the parsed response.
   */
  post<B extends Body>(path: string, body?: B) {
    return this.requestWithUnwrapper("POST", path, body);
  }

  /**
   * Makes a PUT request.
   * @param path - The API endpoint path.
   * @param body - The request body to send.
   * @returns Object with a method `json` that can be used to retrieve the parsed response.
   */
  put<B extends Body>(path: string, body?: B) {
    return this.requestWithUnwrapper("PUT", path, body);
  }

  /**
   * Makes a DELETE request.
   * @param path - The API endpoint path.
   * @returns Object with a method `json` that can be used to retrieve the parsed response.
   */
  delete(path: string) {
    return this.requestWithUnwrapper("DELETE", path);
  }

  /**
   * Internal method to wrap the fetch request and provide a `.json()` method for parsing.
   * @param method - The HTTP method to use.
   * @param path - The API endpoint path.
   * @param body - The request body (if any).
   */
  private requestWithUnwrapper<B extends Body>(
    method: HttpMethod,
    path: string,
    body?: B
  ): Unwrapper {
    const fetcher = async () =>
      body === undefined
        ? this.request(path, method)
        : this.request(path, method, "json" in body ? body["json"] : body);

    return {
      async json<T>() {
        const res = await fetcher();

        return await res.text().then((t) => JSON.parse(t.trim()) as T);
      },
      text: () => fetcher().then((res) => res.text()),
    };
  }
}
