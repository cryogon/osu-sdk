import type { AuthManager } from "../auth/auth-manager";
import type { Event, CursorString } from "../types";
import type { HttpClient } from "../utils/http-client";
export class EventsEndpoint {
  constructor(
    private httpClient: HttpClient,
    private authManager: AuthManager
  ) {}

  /**
   * Get events
   */
  async getEvents(
    options: {
      sort?: string;
      cursor_string?: CursorString;
    } = {}
  ): Promise<{
    events: Event[];
    cursor_string?: CursorString;
  }> {
    const response = await this.httpClient.get("/events", {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
      params: options,
    });

    return response.data;
  }
}
