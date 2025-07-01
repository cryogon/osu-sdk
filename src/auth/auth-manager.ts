import type {
  AuthConfig,
  OAuthTokenResponse,
} from "../types";
import { HttpClient } from "../utils/http-client";

export interface TokenInfo {
  access_token: string;
  token_type: string;
  expires_at: number;
  refresh_token?: string;
  scopes?: string[];
  is_api_key?: boolean; // Flag to identify if this is a static API key
}

export type AuthenticationMode = "api_key" | "oauth";

export class AuthManager {
  private tokenInfo: TokenInfo | null = null;
  private refreshPromise: Promise<TokenInfo> | null = null;
  private httpClient: HttpClient;
  private config?: AuthConfig; // Make config optional for API key mode
  private authMode: AuthenticationMode;

  constructor(httpClient: HttpClient, config?: AuthConfig) {
    this.httpClient = httpClient;
    this.config = config;
    this.authMode = config ? "oauth" : "api_key";
  }

  /**
   * Set access token directly (for API key usage or manual token management)
   */
  setAccessToken(token: string, expiresIn?: number): void {
    this.tokenInfo = {
      access_token: token,
      token_type: "Bearer",
      expires_at: expiresIn
        ? Date.now() + expiresIn * 1000
        : Date.now() + 365 * 24 * 60 * 60 * 1000, // Default 1 year for API keys
      is_api_key: true, // Mark as API key
    };
    this.authMode = "api_key";
  }

  /**
   * Configure OAuth credentials (can be called after initialization)
   */
  setOAuthConfig(config: AuthConfig): void {
    this.config = config;
    this.authMode = "oauth";
  }

  /**
   * Get current authentication mode
   */
  getAuthMode(): AuthenticationMode {
    return this.authMode;
  }

  /**
   * Check if OAuth is configured
   */
  isOAuthConfigured(): boolean {
    return !!(this.config?.client_id && this.config?.client_secret);
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthorizationUrl(scopes: string[] = ["public"], state?: string): string {
    if (!this.isOAuthConfigured()) {
      throw new Error(
        "OAuth not configured. Please call setOAuthConfig() first or provide config during initialization."
      );
    }

    if (!this.config!.redirect_uri) {
      throw new Error("redirect_uri is required for authorization flow");
    }

    const params = new URLSearchParams({
      client_id: this.config!.client_id,
      redirect_uri: this.config!.redirect_uri,
      response_type: "code",
      scope: scopes.join(" "),
    });

    if (state) {
      params.append("state", state);
    }

    return `https://osu.ppy.sh/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<TokenInfo> {
    if (!this.isOAuthConfigured()) {
      throw new Error(
        "OAuth not configured. Please call setOAuthConfig() first."
      );
    }

    if (!this.config!.redirect_uri) {
      throw new Error(
        "redirect_uri is required for authorization code exchange"
      );
    }

    const response = await this.httpClient.post<OAuthTokenResponse>(
      "/oauth/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          client_id: this.config!.client_id,
          client_secret: this.config!.client_secret,
          code,
          grant_type: "authorization_code",
          redirect_uri: this.config!.redirect_uri,
        },
      }
    );

    const tokenInfo = this.processTokenResponse(response.data);
    this.tokenInfo = tokenInfo;
    this.authMode = "oauth";
    return tokenInfo;
  }

  /**
   * Get client credentials token (for application-only access)
   */
  async getClientCredentialsToken(
    scopes: string[] = ["public"]
  ): Promise<TokenInfo> {
    if (!this.isOAuthConfigured()) {
      throw new Error(
        "OAuth not configured. Please call setOAuthConfig() first."
      );
    }

    const response = await this.httpClient.post<OAuthTokenResponse>(
      "/oauth/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          client_id: this.config!.client_id,
          client_secret: this.config!.client_secret,
          grant_type: "client_credentials",
          scope: scopes.join(" "),
        },
      }
    );

    const tokenInfo = this.processTokenResponse(response.data, scopes);
    this.tokenInfo = tokenInfo;
    this.authMode = "oauth";
    return tokenInfo;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<TokenInfo> {
    if (!this.tokenInfo?.refresh_token) {
      throw new Error("No refresh token available");
    }

    if (!this.isOAuthConfigured()) {
      throw new Error("OAuth not configured. Cannot refresh token.");
    }

    // Prevent multiple concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();

    try {
      const tokenInfo = await this.refreshPromise;
      this.tokenInfo = tokenInfo;
      return tokenInfo;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<TokenInfo> {
    if (!this.tokenInfo?.refresh_token || !this.isOAuthConfigured()) {
      throw new Error("No refresh token available or OAuth not configured");
    }

    const response = await this.httpClient.post<OAuthTokenResponse>(
      "/oauth/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          client_id: this.config!.client_id,
          client_secret: this.config!.client_secret,
          grant_type: "refresh_token",
          refresh_token: this.tokenInfo.refresh_token,
          scope: this.tokenInfo.scopes?.join(" ") || "public",
        },
      }
    );

    return this.processTokenResponse(response.data, this.tokenInfo.scopes);
  }

  /**
   * Get valid access token (automatically refreshes if needed and possible)
   */
  async getValidAccessToken(): Promise<string> {
    if (!this.tokenInfo) {
      throw new Error(
        "No access token available. Please authenticate first using setAccessToken() or OAuth methods."
      );
    }

    // For API keys, don't attempt refresh and assume they're long-lived
    if (this.tokenInfo.is_api_key) {
      return this.tokenInfo.access_token;
    }

    // Check if token is about to expire (5 minute buffer)
    const bufferTime = 5 * 60 * 1000; // 5 minutes
    const isExpiringSoon = this.tokenInfo.expires_at - Date.now() < bufferTime;

    if (
      isExpiringSoon &&
      this.tokenInfo.refresh_token &&
      this.isOAuthConfigured()
    ) {
      try {
        await this.refreshAccessToken();
      } catch (error) {
        throw new Error(`Failed to refresh access token: ${error}`);
      }
    } else if (isExpiringSoon) {
      throw new Error(
        "Access token is expiring and no refresh token is available"
      );
    }

    return this.tokenInfo.access_token;
  }

  /**
   * Get authorization header for API requests
   */
  async getAuthorizationHeader(): Promise<string> {
    const token = await this.getValidAccessToken();
    return `Bearer ${token}`;
  }

  /**
   * Check if currently authenticated
   */
  isAuthenticated(): boolean {
    return !!this.tokenInfo && this.tokenInfo.expires_at > Date.now();
  }

  /**
   * Revoke current token
   */
  async revokeToken(): Promise<void> {
    if (this.tokenInfo) {
      try {
        await this.httpClient.delete("/oauth/tokens/current", {
          headers: {
            Authorization: `Bearer ${this.tokenInfo.access_token}`,
          },
        });
      } catch (error) {
        // Ignore errors when revoking
      }
    }
    this.tokenInfo = null;
  }

  /**
   * Clear stored token information
   */
  clearTokens(): void {
    this.tokenInfo = null;
  }

  /**
   * Get current token info
   */
  getTokenInfo(): TokenInfo | null {
    return this.tokenInfo;
  }

  private processTokenResponse(
    response: OAuthTokenResponse,
    scopes?: string[]
  ): TokenInfo {
    return {
      access_token: response.access_token,
      token_type: response.token_type,
      expires_at: Date.now() + response.expires_in * 1000,
      refresh_token: response.refresh_token,
      scopes,
    };
  }
}
