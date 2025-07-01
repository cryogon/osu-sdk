import type { CursorString, RankStatus, Ruleset } from "./common";

export interface GetUserOptions {
    mode?: Ruleset;
    key?: 'id' | 'username';
  }

  export interface GetUserScoresOptions {
    type: 'best' | 'recent' | 'firsts';
    include_fails?: boolean;
    mode?: Ruleset;
    limit?: number;
    offset?: number;
    legacy_only?: boolean;
  }

  export interface GetUserBeatmapsOptions {
    type: 'favourite' | 'graveyard' | 'guest' | 'loved' | 'most_played' | 'nominated' | 'pending' | 'ranked';
    limit?: number;
    offset?: number;
  }

  export interface GetBeatmapScoresOptions {
    mode?: Ruleset;
    mods?: string[];
    type?: 'global' | 'country' | 'friend';
    legacy_only?: boolean;
  }

  export interface GetBeatmapsOptions {
    ids: number[];
  }

  export interface SearchBeatmapsetsOptions {
    query?: string;
    mode?: Ruleset;
    status?: RankStatus | RankStatus[];
    category?: 'any' | 'leaderboard' | 'ranked' | 'qualified' | 'loved' | 'favourites' | 'pending' | 'wip' | 'graveyard' | 'mine';
    genre?: 'any' | 'unspecified' | 'video-game' | 'anime' | 'rock' | 'pop' | 'other' | 'novelty' | 'hip-hop' | 'electronic' | 'metal' | 'classical' | 'folk' | 'jazz';
    language?: 'any' | 'english' | 'japanese' | 'chinese' | 'instrumental' | 'korean' | 'french' | 'german' | 'swedish' | 'spanish' | 'italian' | 'russian' | 'polish' | 'other';
    sort?: 'title_asc' | 'title_desc' | 'artist_asc' | 'artist_desc' | 'difficulty_asc' | 'difficulty_desc' | 'ranked_asc' | 'ranked_desc' | 'rating_asc' | 'rating_desc' | 'plays_asc' | 'plays_desc' | 'favourites_asc' | 'favourites_desc' | 'updated_asc' | 'updated_desc';
    cursor_string?: CursorString;
  }
