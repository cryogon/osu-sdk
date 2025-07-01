export interface OAuthTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    token_type: string;
  }

  export interface ClientCredentials {
    client_id: string;
    client_secret: string;
  }

  export interface AuthConfig extends ClientCredentials {
    redirect_uri?: string;
    scopes?: string[];
  }
