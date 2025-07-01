import type { AuthManager } from "../auth/auth-manager";
import type { CursorString, Score } from "../types/index-old";
import type { HttpClient } from "../utils/http-client";

export class ScoresEndpoint {
    constructor(
      private httpClient: HttpClient,
      private authManager: AuthManager
    ) {}

    /**
     * Get scores
     */
    async getScores(options: { ruleset?: string; cursor_string?: CursorString } = {}): Promise<{
      scores: Score[];
      cursor_string?: CursorString;
    }> {
      const response = await this.httpClient.get('/scores', {
        headers: {
          'Authorization': await this.authManager.getAuthorizationHeader()
        },
        params: options
      });

      return response.data;
    }

    /**
     * Get score by ID
     */
    async getScore(rulesetOrScore: string, scoreId?: string): Promise<Score> {
      let endpoint = `/scores/${rulesetOrScore}`;
      if (scoreId) {
        endpoint += `/${scoreId}`;
      }

      const response = await this.httpClient.get<Score>(endpoint, {
        headers: {
          'Authorization': await this.authManager.getAuthorizationHeader()
        }
      });

      return response.data;
    }

    /**
     * Download score replay
     */
    async downloadScore(rulesetOrScore: string, scoreId?: string): Promise<Blob> {
      let endpoint = `/scores/${rulesetOrScore}`;
      if (scoreId) {
        endpoint += `/${scoreId}`;
      }
      endpoint += '/download';

      const response = await this.httpClient.get<Blob>(endpoint, {
        headers: {
          'Authorization': await this.authManager.getAuthorizationHeader()
        }
      });

      return response.data;
    }
  }
