import type { AuthManager } from "../auth/auth-manager";
import type { NewsPost, CursorString } from "../types";
import type { HttpClient } from "../utils/http-client";

export class NewsEndpoint {
  constructor(
    private httpClient: HttpClient,
    private authManager: AuthManager
  ) {}

  /**
   * Get news listing
   */
  async getNews(
    options: {
      limit?: number;
      year?: number;
      cursor_string?: CursorString;
    } = {}
  ): Promise<{
    news_posts: NewsPost[];
    news_sidebar: any;
    search: any;
    cursor_string?: CursorString;
  }> {
    const response = await this.httpClient.get("/news", {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
      params: options,
    });

    return response.data;
  }

  /**
   * Get news post
   */
  async getNewsPost(newsId: string | number): Promise<NewsPost> {
    const response = await this.httpClient.get<NewsPost>(`/news/${newsId}`, {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
    });

    return response.data;
  }
}
