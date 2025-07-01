export type Timestamp = string;
export type CursorString = string | null;

export interface Cursor {
  [key: string]: any;
}

export type Ruleset = 'osu' | 'taiko' | 'fruits' | 'mania';
export type RankStatus = 'graveyard' | 'wip' | 'pending' | 'ranked' | 'approved' | 'qualified' | 'loved';

// src/types/user.ts
export interface User {
  id: number;
  username: string;
  profile_colour: string | null;
  avatar_url: string;
  country_code: string;
  is_active: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_online: boolean;
  is_supporter: boolean;
  last_visit?: Timestamp;
  pm_friends_only: boolean;
  default_group?: string;
}

export interface UserExtended extends User {
  cover_url: string;
  discord?: string;
  has_supported: boolean;
  interests?: string;
  join_date: Timestamp;
  location?: string;
  max_blocks: number;
  max_friends: number;
  occupation?: string;
  playmode: Ruleset;
  playstyle?: string[];
  post_count: number;
  profile_hue?: number;
  profile_order: string[];
  title?: string;
  twitter?: string;
  website?: string;
  country?: {
    code: string;
    name: string;
  };
  cover?: {
    custom_url?: string;
    url: string;
    id?: string;
  };
  is_restricted?: boolean;
  kudosu?: {
    total: number;
    available: number;
  };
  statistics?: UserStatistics;
}

export interface UserStatistics {
  count_100: number;
  count_300: number;
  count_50: number;
  count_miss: number;
  level: {
    current: number;
    progress: number;
  };
  global_rank?: number;
  country_rank?: number;
  pp: number;
  ranked_score: number;
  hit_accuracy: number;
  play_count: number;
  play_time?: number;
  total_score: number;
  total_hits: number;
  maximum_combo: number;
  replays_watched_by_others: number;
  is_ranked: boolean;
  grade_counts: {
    ss: number;
    ssh: number;
    s: number;
    sh: number;
    a: number;
  };
}
