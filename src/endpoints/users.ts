import { HttpClient } from "../utils/http-client";
import { AuthManager } from "../auth/auth-manager";
import type {
  Beatmapset,
  GetUserBeatmapsOptions,
  GetUserOptions,
  GetUserScoresOptions,
  Score,
  User,
  UserExtended,
} from "../types";
import type { BeatmapPlaycount, KudosuHistory } from "../types";

export class UsersEndpoint {
  constructor(
    private httpClient: HttpClient,
    private authManager: AuthManager
  ) {}

  /**
   * Get user information
   */
  async getUser(
    userId: number | string,
    options: GetUserOptions = {}
  ): Promise<UserExtended> {
    const { mode, key } = options;
    let endpoint = `/api/v2/users/${userId}`;

    if (mode) {
      endpoint += `/${mode}`;
    }

    const params: Record<string, any> = {};
    if (key) {
      params.key = key;
    }

    const response = await this.httpClient.get<UserExtended>(endpoint, {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
      params,
    });

    return response.data;
  }

  /**
   * Get own user data
   */
  async getMe(mode?: string): Promise<UserExtended> {
    let endpoint = "/me";
    if (mode) {
      endpoint += `/${mode}`;
    }

    const response = await this.httpClient.get<UserExtended>(endpoint, {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
    });

    return response.data;
  }

  /**
   * Get multiple users
   */
  async getUsers(userIds: number[]): Promise<{ users: User[] }> {
    const response = await this.httpClient.get<{ users: User[] }>("/users", {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
      params: {
        "ids[]": userIds,
      },
    });

    return response.data;
  }

  /**
   * Get user scores
   */
  async getUserScores(
    userId: number,
    options: GetUserScoresOptions
  ): Promise<Score[]> {
    const { type, include_fails, mode, limit, offset, legacy_only } = options;

    const params: Record<string, any> = {};
    if (include_fails !== undefined)
      params.include_fails = include_fails ? 1 : 0;
    if (mode) params.mode = mode;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (legacy_only !== undefined) params.legacy_only = legacy_only ? 1 : 0;

    const response = await this.httpClient.get<Score[]>(
      `/users/${userId}/scores/${type}`,
      {
        headers: {
          Authorization: await this.authManager.getAuthorizationHeader(),
        },
        params,
      }
    );

    return response.data;
  }

  /**
   * Get user beatmaps
   */
  async getUserBeatmaps(
    userId: number,
    options: GetUserBeatmapsOptions
  ): Promise<Beatmapset[] | BeatmapPlaycount[]> {
    const { type, limit, offset } = options;

    const params: Record<string, any> = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    const response = await this.httpClient.get<
      Beatmapset[] | BeatmapPlaycount[]
    >(`/users/${userId}/beatmapsets/${type}`, {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
      params,
    });

    return response.data;
  }

  /**
   * Get user kudosu history
   */
  async getUserKudosu(
    userId: number,
    limit?: number,
    offset?: number
  ): Promise<KudosuHistory[]> {
    const params: Record<string, any> = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    const response = await this.httpClient.get<KudosuHistory[]>(
      `/users/${userId}/kudosu`,
      {
        headers: {
          Authorization: await this.authManager.getAuthorizationHeader(),
        },
        params,
      }
    );

    return response.data;
  }

  /**
   * Get user recent activity
   */
  async getUserRecentActivity(
    userId: number,
    limit?: number,
    offset?: number
  ): Promise<Event[]> {
    const params: Record<string, any> = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    const response = await this.httpClient.get<Event[]>(
      `/users/${userId}/recent_activity`,
      {
        headers: {
          Authorization: await this.authManager.getAuthorizationHeader(),
        },
        params,
      }
    );

    return response.data;
  }
}
