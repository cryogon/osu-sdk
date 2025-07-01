// src/endpoints/beatmaps.ts
import type { AuthManager } from '../auth/auth-manager';
import type { BeatmapDifficultyAttributes, BeatmapScores, BeatmapUserScore } from '../types';
import type {
  Beatmap,
  BeatmapExtended,
  GetBeatmapsOptions,
  GetBeatmapScoresOptions,
  Score
} from '../types/index-old';
import type { HttpClient } from '../utils/http-client';

export class BeatmapsEndpoint {
  constructor(
    private httpClient: HttpClient,
    private authManager: AuthManager
  ) {}

  /**
   * Get beatmap by ID
   */
  async getBeatmap(beatmapId: number): Promise<BeatmapExtended> {
    const response = await this.httpClient.get<BeatmapExtended>(`/beatmaps/${beatmapId}`, {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      }
    });

    return response.data;
  }

  /**
   * Get multiple beatmaps
   */
  async getBeatmaps(options: GetBeatmapsOptions): Promise<{ beatmaps: Beatmap[] }> {
    const response = await this.httpClient.get<{ beatmaps: Beatmap[] }>('/beatmaps', {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params: {
        'ids[]': options.ids
      }
    });

    return response.data;
  }

  /**
   * Lookup beatmap
   */
  async lookupBeatmap(params: { checksum?: string; filename?: string; id?: number }): Promise<Beatmap> {
    const response = await this.httpClient.get<Beatmap>('/beatmaps/lookup', {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params
    });

    return response.data;
  }

  /**
   * Get beatmap scores
   */
  async getBeatmapScores(beatmapId: number, options: GetBeatmapScoresOptions = {}): Promise<BeatmapScores> {
    const { mode, mods, type, legacy_only } = options;

    const params: Record<string, any> = {};
    if (mode) params.mode = mode;
    if (mods) params.mods = mods;
    if (type) params.type = type;
    if (legacy_only !== undefined) params.legacy_only = legacy_only ? 1 : 0;

    const response = await this.httpClient.get<BeatmapScores>(`/beatmaps/${beatmapId}/scores`, {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params
    });

    return response.data;
  }

  /**
   * Get user's score on beatmap
   */
  async getUserBeatmapScore(beatmapId: number, userId: number, options: { mode?: string; mods?: string[]; legacy_only?: boolean } = {}): Promise<BeatmapUserScore> {
    const { mode, mods, legacy_only } = options;

    const params: Record<string, any> = {};
    if (mode) params.mode = mode;
    if (mods) params.mods = mods;
    if (legacy_only !== undefined) params.legacy_only = legacy_only ? 1 : 0;

    const response = await this.httpClient.get<BeatmapUserScore>(`/beatmaps/${beatmapId}/scores/users/${userId}`, {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params
    });

    return response.data;
  }

  /**
   * Get user's scores on beatmap
   */
  async getUserBeatmapScores(beatmapId: number, userId: number, options: { legacy_only?: boolean; ruleset?: string } = {}): Promise<{ scores: Score[] }> {
    const { legacy_only, ruleset } = options;

    const params: Record<string, any> = {};
    if (legacy_only !== undefined) params.legacy_only = legacy_only ? 1 : 0;
    if (ruleset) params.ruleset = ruleset;

    const response = await this.httpClient.get<{ scores: Score[] }>(`/beatmaps/${beatmapId}/scores/users/${userId}/all`, {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params
    });

    return response.data;
  }

  /**
   * Get beatmap difficulty attributes
   */
  async getBeatmapAttributes(beatmapId: number, options: { mods?: string | number; ruleset?: string }): Promise<{ attributes: BeatmapDifficultyAttributes }> {
    const response = await this.httpClient.post<{ attributes: BeatmapDifficultyAttributes }>(`/beatmaps/${beatmapId}/attributes`, {
      headers: {
        'Authorization': await this.authManager.getAuthorizationHeader()
      },
      params: options
    });

    return response.data;
  }
}
