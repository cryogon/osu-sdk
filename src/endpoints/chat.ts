import type { AuthManager } from "../auth/auth-manager";
import type { ChatChannel, ChatMessage, UserSilence } from "../types";
import type { HttpClient } from "../utils/http-client";

export class ChatEndpoint {
  constructor(
    private httpClient: HttpClient,
    private authManager: AuthManager
  ) {}

  /**
   * Get chat updates
   */
  async getUpdates(historyScince?: number): Promise<{
    presence: ChatChannel[];
    silences: UserSilence[];
  }> {
    const params: Record<string, any> = {};
    if (historyScince) params.history_since = historyScince;

    const response = await this.httpClient.get("/chat/updates", {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
      params,
    });

    return response.data;
  }

  /**
   * Get channel list
   */
  async getChannels(): Promise<ChatChannel[]> {
    const response = await this.httpClient.get<ChatChannel[]>(
      "/chat/channels",
      {
        headers: {
          Authorization: await this.authManager.getAuthorizationHeader(),
        },
      }
    );

    return response.data;
  }

  /**
   * Get channel
   */
  async getChannel(channelId: number): Promise<{
    channel: ChatChannel;
    users: any[];
  }> {
    const response = await this.httpClient.get(`/chat/channels/${channelId}`, {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
    });

    return response.data;
  }

  /**
   * Get channel messages
   */
  async getChannelMessages(
    channelId: number,
    options: {
      limit?: number;
      since?: number;
      until?: number;
    } = {}
  ): Promise<ChatMessage[]> {
    const response = await this.httpClient.get<ChatMessage[]>(
      `/chat/channels/${channelId}/messages`,
      {
        headers: {
          Authorization: await this.authManager.getAuthorizationHeader(),
        },
        params: options,
      }
    );

    return response.data;
  }

  /**
   * Send message to channel
   */
  async sendMessage(
    channelId: number,
    message: string,
    isAction: boolean = false
  ): Promise<ChatMessage> {
    const response = await this.httpClient.post<ChatMessage>(
      `/chat/channels/${channelId}/messages`,
      {
        headers: {
          Authorization: await this.authManager.getAuthorizationHeader(),
        },
        params: {
          message,
          is_action: isAction,
        },
      }
    );

    return response.data;
  }

  /**
   * Join channel
   */
  async joinChannel(channelId: number, userId: number): Promise<ChatChannel> {
    const response = await this.httpClient.put<ChatChannel>(
      `/chat/channels/${channelId}/users/${userId}`,
      {
        headers: {
          Authorization: await this.authManager.getAuthorizationHeader(),
        },
      }
    );

    return response.data;
  }

  /**
   * Leave channel
   */
  async leaveChannel(channelId: number, userId: number): Promise<void> {
    await this.httpClient.delete(
      `/chat/channels/${channelId}/users/${userId}`,
      {
        headers: {
          Authorization: await this.authManager.getAuthorizationHeader(),
        },
      }
    );
  }

  /**
   * Create new PM
   */
  async createPM(
    targetId: number,
    message: string,
    isAction: boolean = false,
    uuid?: string
  ): Promise<{
    channel: ChatChannel;
    message: ChatMessage;
    new_channel_id: number;
  }> {
    const response = await this.httpClient.post("/chat/new", {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
      params: {
        target_id: targetId,
        message,
        is_action: isAction,
        uuid,
      },
    });

    return response.data;
  }

  /**
   * Chat keepalive
   */
  async keepalive(
    historyScince?: number
  ): Promise<{ silences: UserSilence[] }> {
    const params: Record<string, any> = {};
    if (historyScince) params.history_since = historyScince;

    const response = await this.httpClient.post("/chat/ack", {
      headers: {
        Authorization: await this.authManager.getAuthorizationHeader(),
      },
      params,
    });

    return response.data;
  }
}
