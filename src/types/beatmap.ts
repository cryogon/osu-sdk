import type { RankStatus, Ruleset, Timestamp } from "./common";

export interface Beatmap {
    beatmapset_id: number;
    difficulty_rating: number;
    id: number;
    mode: Ruleset;
    status: RankStatus;
    total_length: number;
    user_id: number;
    version: string;
    accuracy?: number;
    ar?: number;
    bpm?: number;
    convert?: boolean;
    count_circles?: number;
    count_sliders?: number;
    count_spinners?: number;
    cs?: number;
    deleted_at?: Timestamp;
    drain?: number;
    hit_length?: number;
    is_scoreable?: boolean;
    last_updated?: Timestamp;
    mode_int?: number;
    passcount?: number;
    playcount?: number;
    ranked?: number;
    url?: string;
    checksum?: string;
  }

  export interface BeatmapExtended extends Beatmap {
    beatmapset?: BeatmapsetExtended;
    failtimes?: {
      exit?: number[];
      fail?: number[];
    };
    max_combo?: number;
  }

  export interface Beatmapset {
    artist: string;
    artist_unicode: string;
    covers: {
      cover: string;
      'cover@2x': string;
      card: string;
      'card@2x': string;
      list: string;
      'list@2x': string;
      slimcover: string;
      'slimcover@2x': string;
    };
    creator: string;
    favourite_count: number;
    hype?: {
      current: number;
      required: number;
    };
    id: number;
    nsfw: boolean;
    offset: number;
    play_count: number;
    preview_url: string;
    source: string;
    spotlight: boolean;
    status: RankStatus;
    title: string;
    title_unicode: string;
    track_id?: number;
    user_id: number;
    video: boolean;
  }

  export interface BeatmapsetExtended extends Beatmapset {
    availability: {
      download_disabled: boolean;
      more_information?: string;
    };
    bpm: number;
    can_be_hyped: boolean;
    deleted_at?: Timestamp;
    discussion_enabled: boolean;
    discussion_locked: boolean;
    is_scoreable: boolean;
    last_updated: Timestamp;
    legacy_thread_url?: string;
    nominations_summary: {
      current: number;
      required: number;
    };
    ranked: number;
    ranked_date?: Timestamp;
    storyboard: boolean;
    submitted_date: Timestamp;
    tags: string;
    has_favourited?: boolean;
    beatmaps?: Beatmap[];
  }
