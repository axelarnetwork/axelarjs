import unfetch from "isomorphic-unfetch";

export type Body =
  | {
      json: Record<string, unknown>;
    }
  | {
      [key: string]: unknown;
    };

export type Payload<B extends Body | undefined> =
  | {
      method: "GET" | "DELETE";
      body?: never;
    }
  | {
      method: "POST" | "PUT" | "PATCH";
      body: B;
    };

export type HttpMethod = Payload<Body>["method"];

/**
 * Interface describing the unwrapper object returned by the `requestWithUnwrapper` method.
 */
interface Unwrapper {
  json: <T>() => Promise<T>;
  text: () => Promise<string>;
  blob: () => Promise<Blob>;
}

/**
 * Interface describing the options for the BaseHttpClient.
 */
export interface HttpClientOptions {
  prefixUrl?: string;
  defaultHeaders?: Record<string, string>;
  credentials?: "include" | "omit";
}

/**
 * A basic HTTP client supporting various HTTP methods and isomorphic in nature.
 * Uses `isomorphic-unfetch` as the underlying fetch implementation.
 */
export class HttpClient {
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
  constructor(options: HttpClientOptions = {}) {
    this.prefixUrl = options.prefixUrl ?? "";
    this.defaultHeaders = { ...this.defaultHeaders, ...options.defaultHeaders };
    this.credentials = options.credentials ?? "omit";
  }

  /**
   * Creates and returns a new BaseHttpClient instance with the provided options.
   * @param options - Configuration options to extend the client with.
   */
  static extend(options: HttpClientOptions) {
    return new HttpClient(options);
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
    const requestUrl = this.urlJoin(this.prefixUrl, path);
    const url = new URL(requestUrl).toString();

    const response = await unfetch(url, {
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
    return this.requestWithUnwrapper(path, { method: "GET" });
  }

  /**
   * Makes a POST request.
   * @param path - The API endpoint path.
   * @param body - The request body to send.
   * @returns Object with a method `json` that can be used to retrieve the parsed response.
   */
  post<B extends Body>(path: string, body?: B) {
    return this.requestWithUnwrapper(path, { method: "POST", body });
  }

  /**
   * Makes a PUT request.
   * @param path - The API endpoint path.
   * @param body - The request body to send.
   * @returns Object with a method `json` that can be used to retrieve the parsed response.
   */
  put<B extends Body>(path: string, body?: B) {
    return this.requestWithUnwrapper(path, { method: "PUT", body });
  }

  /**
   * Makes a PATCH request.
   * @param path - The API endpoint path.
   * @param body - The request body to send.
   * @returns Object with a method `json` that can be used to retrieve the parsed response.
   */
  patch<B extends Body>(path: string, body?: B) {
    return this.requestWithUnwrapper(path, { method: "PATCH", body });
  }

  /**
   * Makes a DELETE request.
   * @param path - The API endpoint path.
   * @returns Object with a method `json` that can be used to retrieve the parsed response.
   */
  delete(path: string) {
    return this.requestWithUnwrapper(path, { method: "DELETE" });
  }

  /**
   * Internal method to wrap the fetch request and provide a `.json()` method for parsing.
   * @param path - The API endpoint path.
   * @parm payload - The request payload with the HTTP method and body.
   */
  private requestWithUnwrapper<B extends Body | undefined>(
    path: string,
    { method, body }: Payload<B>
  ): Unwrapper {
    const fetcher = async () => {
      if (method === "GET" || method === "DELETE") {
        return this.request(path, method);
      }

      return this.request(
        path,
        method,
        body && "json" in body ? body.json : body
      );
    };

    return {
      async json<T>() {
        const res = await fetcher();
        const content = await res.text();

        return JSON.parse(content.trim()) as T;
      },
      text: () => fetcher().then((res) => res.text()),
      blob: () => fetcher().then((res) => res.blob()),
    };
  }

  private urlJoin(...parts: string[]): string {
    return parts
      .map((part) => part.trim().replace(/^\/+|\/+$/g, ""))
      .filter(Boolean)
      .join("/");
  }
}
