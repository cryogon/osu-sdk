import type { Beatmap, Beatmapset } from "./beatmap";
import type { Ruleset, Timestamp, User } from "./common";

export interface Score {
    id?: number;
    user_id: number;
    accuracy: number;
    mods: string[];
    score: number;
    max_combo: number;
    perfect: boolean;
    statistics: {
      count_50?: number;
      count_100?: number;
      count_300?: number;
      count_geki?: number;
      count_katu?: number;
      count_miss?: number;
    };
    passed: boolean;
    pp?: number;
    rank: string;
    created_at: Timestamp;
    mode: Ruleset;
    mode_int: number;
    replay?: boolean;
    beatmap_id?: number;
    best_id?: number;
    build_id?: number;
    ended_at?: Timestamp;
    has_replay?: boolean;
    is_perfect_combo?: boolean;
    legacy_perfect?: boolean;
    legacy_score_id?: number;
    legacy_total_score?: number;
    maximum_statistics?: {
      count_50?: number;
      count_100?: number;
      count_300?: number;
      count_geki?: number;
      count_katu?: number;
      count_miss?: number;
    };
    room_id?: number;
    ruleset_id?: number;
    started_at?: Timestamp;
    total_score?: number;
    type?: string;
    user?: User;
    beatmap?: Beatmap;
    beatmapset?: Beatmapset;
  }
