import type { AuthManager } from '../auth/auth-manager';
import type { Rankings, Spotlight } from '../types';
import type { HttpClient } from '../utils/http-client';

export class RankingsEndpoint {
  constructor(
    private httpClient: HttpClient,
    private authManager: AuthManager
  ) {}

  /**
   * Get rankings
   */
  async getRankings(mode: string, type: string, options: {
    country?: string;
    filter?: string;
    variant?: string;
    cursor?: any;
  } = {}): Promise<Rankings> {
    const { country, filter, variant, cursor } = options;

    const params: Record<string, any> = {};
    if (country) params.country = country;
    if (filter) params.filter = filter;
    if (variant) params.variant = variant;
    if (cursor) {
      Object.entries(cursor).forEach(([key, value]) => {
        params[`cursor[${key}]`] = value;
      });
    }

    const response = await this.httpClient.get<Rankings>(`/rankings/${mode}/${type}`, {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params
    });

    return response.data;
  }

  /**
   * Get kudosu rankings
   */
  async getKudosuRankings(page?: number): Promise<Rankings> {
    const params: Record<string, any> = {};
    if (page) params.page = page;

    const response = await this.httpClient.get<Rankings>('/rankings/kudosu', {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params
    });

    return response.data;
  }

  /**
   * Get spotlights
   */
  async getSpotlights(): Promise<{ spotlights: Spotlight[] }> {
    const response = await this.httpClient.get<{ spotlights: Spotlight[] }>('/spotlights', {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      }
    });

    return response.data;
  }
}
