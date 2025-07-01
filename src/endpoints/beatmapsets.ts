import type { AuthManager } from '../auth/auth-manager';
import type { BeatmapsetExtended, SearchBeatmapsetsOptions, CursorString } from '../types/index-old';
import type { HttpClient } from '../utils/http-client';

export class BeatmapsetsEndpoint {
  constructor(
    private httpClient: HttpClient,
    private authManager: AuthManager
  ) {}

  /**
   * Get beatmapset by ID
   */
  async getBeatmapset(beatmapsetId: number): Promise<BeatmapsetExtended> {
    const response = await this.httpClient.get<BeatmapsetExtended>(`/beatmapsets/${beatmapsetId}`, {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      }
    });

    return response.data;
  }

  /**
   * Search beatmapsets
   */
  async searchBeatmapsets(options: SearchBeatmapsetsOptions = {}): Promise<{
    beatmapsets: BeatmapsetExtended[];
    cursor_string?: CursorString;
    search: any;
  }> {
    const params: Record<string, any> = {};

    if (options.query) params.q = options.query;
    if (options.mode) params.m = options.mode;
    if (options.status) {
      if (Array.isArray(options.status)) {
        params.s = options.status.join('.');
      } else {
        params.s = options.status;
      }
    }
    if (options.category) params.c = options.category;
    if (options.genre) params.g = options.genre;
    if (options.language) params.l = options.language;
    if (options.sort) params.sort = options.sort;
    if (options.cursor_string) params.cursor_string = options.cursor_string;

    const response = await this.httpClient.get('/beatmapsets/search', {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params
    });

    return response.data;
  }

  /**
   * Lookup beatmapset
   */
  async lookupBeatmapset(beatmapId: number): Promise<BeatmapsetExtended> {
    const response = await this.httpClient.get<BeatmapsetExtended>('/beatmapsets/lookup', {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params: { beatmap_id: beatmapId }
    });

    return response.data;
  }
}
