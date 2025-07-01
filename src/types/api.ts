import type { CursorString } from "./common";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  cursor?: CursorString;
  cursor_string?: CursorString;
}

export interface PaginatedResponse<T> {
  data: T[];
  cursor_string?: CursorString;
  has_more?: boolean;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}
