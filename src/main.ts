import { DEFAULT_CONFIG, type OsuApiConfig } from "./config";
import type { AuthConfig } from "./types/auth";
import { HttpClient } from "./utils/http-client";
import { AuthManager, type AuthenticationMode } from "./auth/auth-manager";
import { UsersEndpoint } from "./endpoints/users";
import { BeatmapsEndpoint } from "./endpoints/beatmaps";
import { BeatmapsetsEndpoint } from "./endpoints/beatmapsets";
import { RankingsEndpoint } from "./endpoints/rankings";
import { ScoresEndpoint } from "./endpoints/scores";
import { ChatEndpoint } from "./endpoints/chat";
import { EventsEndpoint } from "./endpoints/events";
import { NewsEndpoint } from "./endpoints/news";
import { SearchEndpoint } from "./endpoints/search";

export class OsuApi {
  private httpClient: HttpClient;
  private authManager: AuthManager;

  // Endpoint instances
  public readonly users: UsersEndpoint;
  public readonly beatmaps: BeatmapsEndpoint;
  public readonly beatmapsets: BeatmapsetsEndpoint;
  public readonly rankings: RankingsEndpoint;
  public readonly scores: ScoresEndpoint;
  public readonly chat: ChatEndpoint;
  public readonly events: EventsEndpoint;
  public readonly news: NewsEndpoint;
  public readonly search: SearchEndpoint;

  /**
   * Create a new OsuApi instance
   * @param authConfigOrApiKey - OAuth configuration object or API key string
   * @param apiConfig - Optional API configuration
   */
  constructor(
    authConfigOrApiKey?: AuthConfig | string,
    apiConfig: Partial<OsuApiConfig> = {}
  ) {
    // Merge configs
    const config = { ...DEFAULT_CONFIG, ...apiConfig };

    // Initialize HTTP client
    this.httpClient = new HttpClient(config);

    // Initialize auth manager based on input type
    if (typeof authConfigOrApiKey === "string") {
      // API key mode
      this.authManager = new AuthManager(this.httpClient);
      this.authManager.setAccessToken(authConfigOrApiKey);
    } else if (authConfigOrApiKey) {
      // OAuth mode
      this.authManager = new AuthManager(this.httpClient, authConfigOrApiKey);
    } else {
      // No auth initially - can be configured later
      this.authManager = new AuthManager(this.httpClient);
    }

    // Initialize endpoints
    this.users = new UsersEndpoint(this.httpClient, this.authManager);
    this.beatmaps = new BeatmapsEndpoint(this.httpClient, this.authManager);
    this.beatmapsets = new BeatmapsetsEndpoint(
      this.httpClient,
      this.authManager
    );
    this.rankings = new RankingsEndpoint(this.httpClient, this.authManager);
    this.scores = new ScoresEndpoint(this.httpClient, this.authManager);
    this.chat = new ChatEndpoint(this.httpClient, this.authManager);
    this.events = new EventsEndpoint(this.httpClient, this.authManager);
    this.news = new NewsEndpoint(this.httpClient, this.authManager);
    this.search = new SearchEndpoint(this.httpClient, this.authManager);
  }

  // Auth convenience methods

  /**
   * Set access token directly (for API key usage)
   */
  setAccessToken(token: string, expiresIn?: number): void {
    this.authManager.setAccessToken(token, expiresIn);
  }

  /**
   * Configure OAuth credentials (can be called after initialization)
   */
  setOAuthConfig(config: AuthConfig): void {
    this.authManager.setOAuthConfig(config);
  }

  /**
   * Get current authentication mode
   */
  getAuthMode(): AuthenticationMode {
    return this.authManager.getAuthMode();
  }

  /**
   * Check if OAuth is configured and available
   */
  isOAuthConfigured(): boolean {
    return this.authManager.isOAuthConfigured();
  }

  /**
   * Get authorization URL for OAuth flow
   * @throws Error if OAuth is not configured
   */
  getAuthorizationUrl(scopes: string[] = ["public"], state?: string): string {
    return this.authManager.getAuthorizationUrl(scopes, state);
  }

  /**
   * Exchange authorization code for access token
   * @throws Error if OAuth is not configured
   */
  async exchangeCodeForToken(code: string) {
    return this.authManager.exchangeCodeForToken(code);
  }

  /**
   * Get client credentials token (for application-only access)
   * @throws Error if OAuth is not configured
   */
  async getClientCredentialsToken(scopes: string[] = ["public"]) {
    return this.authManager.getClientCredentialsToken(scopes);
  }

  /**
   * Check if currently authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return this.authManager.isAuthenticated();
  }

  /**
   * Revoke current token and clear authentication
   */
  async logout(): Promise<void> {
    await this.authManager.revokeToken();
  }

  /**
   * Get current token information
   */
  getTokenInfo() {
    return this.authManager.getTokenInfo();
  }

  /**
   * Create a new instance with API key authentication
   */
  static withApiKey(apiKey: string, apiConfig?: Partial<OsuApiConfig>): OsuApi {
    return new OsuApi(apiKey, apiConfig);
  }

  /**
   * Create a new instance with OAuth configuration
   */
  static withOAuth(
    authConfig: AuthConfig,
    apiConfig?: Partial<OsuApiConfig>
  ): OsuApi {
    return new OsuApi(authConfig, apiConfig);
  }

  /**
   * Create a new instance without authentication (configure later)
   */
  static create(apiConfig?: Partial<OsuApiConfig>): OsuApi {
    return new OsuApi(undefined, apiConfig);
  }
}

// Default export
export default OsuApi;
