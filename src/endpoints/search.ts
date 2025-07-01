import type { AuthManager } from "../auth/auth-manager";
import type { User } from "../types";
import type { HttpClient } from "../utils/http-client";

export interface SearchResult<T> {
  data: T[];
  total: number;
}

export class SearchEndpoint {
  constructor(
    private httpClient: HttpClient,
    private authManager: AuthManager
  ) {}

  /**
   * Search users and wiki pages
   */
  async search(
    query: string,
    options: {
      mode?: "all" | "user" | "wiki_page";
      page?: number;
    } = {}
  ): Promise<{
    user?: SearchResult<User>;
    wiki_page?: SearchResult<any>;
  }> {
    const response = await this.httpClient.get("/search", {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
      params: {
        query,
        ...options,
      },
    });

    return response.data;
  }
}
