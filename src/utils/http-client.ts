import type { OsuApiConfig } from "../config";
import type { RequestConfig } from "../types/api";

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export class HttpError extends Error {
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = "HttpError";
  }
}

export class HttpClient {
  private config: Required<OsuApiConfig>;

  constructor(config: Required<OsuApiConfig>) {
    this.config = config;
  }

  async request<T = any>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    options: RequestConfig = {}
  ): Promise<HttpResponse<T>> {
    const { headers = {}, params, timeout = this.config.timeout } = options;

    // Build URL with query parameters
    const fullUrl = new URL(url, this.config.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) =>
              fullUrl.searchParams.append(`${key}[]`, String(v))
            );
          } else {
            fullUrl.searchParams.append(key, String(value));
          }
        }
      });
    }

    // Prepare headers
    const requestHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": this.config.userAgent,
      "x-api-version": this.config.apiVersion,
      ...headers,
    };

    // Create fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    };

    // Add body for non-GET requests
    if (method !== "GET" && options.params) {
      if (requestHeaders["Content-Type"] === "application/json") {
        fetchOptions.body = JSON.stringify(options.params);
      } else if (
        requestHeaders["Content-Type"] === "application/x-www-form-urlencoded"
      ) {
        const formData = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        fetchOptions.body = formData.toString();
      }
    }

    let lastError: Error | null = null;

    // Retry mechanism
    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(fullUrl.toString(), fetchOptions);

        // Parse response
        let data: T;
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          data = (await response.json()) as any;
        } else {
          data = (await response.text()) as any;
        }

        // Handle HTTP errors
        if (!response.ok) {
          throw new HttpError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            data
          );
        }

        // Convert Headers to plain object
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) or last attempt
        if (
          error instanceof HttpError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          throw error;
        }

        if (attempt === this.config.retryAttempts) {
          throw lastError;
        }

        // Wait before retry
        await this.delay(this.config.retryDelay * (attempt + 1));
      }
    }

    throw lastError;
  }

  async get<T = any>(
    url: string,
    options: RequestConfig = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>("GET", url, options);
  }

  async post<T = any>(
    url: string,
    options: RequestConfig = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>("POST", url, options);
  }

  async put<T = any>(
    url: string,
    options: RequestConfig = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>("PUT", url, options);
  }

  async delete<T = any>(
    url: string,
    options: RequestConfig = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>("DELETE", url, options);
  }

  async patch<T = any>(
    url: string,
    options: RequestConfig = {}
  ): Promise<HttpResponse<T>> {
    return this.request<T>("PATCH", url, options);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
