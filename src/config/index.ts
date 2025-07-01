export interface OsuApiConfig {
  baseUrl?: string;
  userAgent?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  apiVersion?: string;
}

export const DEFAULT_CONFIG: Required<OsuApiConfig> = {
  baseUrl: "https://osu.ppy.sh/api/v2",
  userAgent: "osu-api-sdk",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  apiVersion: "20220705",
};
