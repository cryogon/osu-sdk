import type { Score } from "../types";

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  retryAfterMs?: number;
}

export class RateLimiter {
  private requests: number[] = [];
  private options: Required<RateLimitOptions>;

  constructor(options: RateLimitOptions) {
    this.options = {
      retryAfterMs: options.windowMs,
      ...options,
    };
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();

    // Remove old requests outside the window
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.options.windowMs
    );

    // Check if we're at the limit
    if (this.requests.length >= this.options.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = oldestRequest + this.options.windowMs - now;

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    // Add current request
    this.requests.push(now);
  }

  getStatus(): {
    remaining: number;
    resetTime: number;
    total: number;
  } {
    const now = Date.now();
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.options.windowMs
    );

    const remaining = Math.max(
      0,
      this.options.maxRequests - this.requests.length
    );
    const resetTime =
      this.requests.length > 0
        ? Math.min(...this.requests) + this.options.windowMs
        : now;

    return {
      remaining,
      resetTime,
      total: this.options.maxRequests,
    };
  }
}
