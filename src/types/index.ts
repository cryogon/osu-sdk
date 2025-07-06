// src/types/auth.ts
export interface OAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type: string;
}

export interface ClientCredentials {
  client_id: string;
  client_secret: string;
}

export interface AuthConfig extends ClientCredentials {
  redirect_uri?: string;
  scopes?: string[];
}

// src/types/common.ts
export type Timestamp = string;
export type CursorString = string | null;

export interface Cursor {
  [key: string]: any;
}

export type Ruleset = "osu" | "taiko" | "fruits" | "mania";
export type RankStatus =
  | "graveyard"
  | "wip"
  | "pending"
  | "ranked"
  | "approved"
  | "qualified"
  | "loved";

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
  // Additional optional attributes that can be included
  account_history?: UserAccountHistory[];
  active_tournament_banner?: UserProfileBanner;
  active_tournament_banners?: UserProfileBanner[];
  badges?: UserBadge[];
  beatmap_playcounts_count?: number;
  favourite_beatmapset_count?: number;
  follower_count?: number;
  graveyard_beatmapset_count?: number;
  groups?: UserGroup[];
  loved_beatmapset_count?: number;
  mapping_follower_count?: number;
  monthly_playcounts?: UserMonthlyPlaycount[];
  page?: UserProfilePage;
  pending_beatmapset_count?: number;
  previous_usernames?: string[];
  rank_highest?: UserRankHighest;
  rank_history?: UserRankHistory;
  ranked_beatmapset_count?: number;
  replays_watched_counts?: UserReplayWatchCount[];
  scores_best_count?: number;
  scores_first_count?: number;
  scores_recent_count?: number;
  session_verified?: boolean;
  statistics_rulesets?: Record<Ruleset, UserStatistics>;
  support_level?: number;
  user_achievements?: UserAchievement[];
}

// Additional user-related types
export interface UserAccountHistory {
  id: number;
  type: "note" | "restriction" | "silence";
  timestamp: Timestamp;
  length: number;
  permanent: boolean;
  description?: string;
}

export interface UserProfileBanner {
  id: number;
  tournament_id: number;
  image?: string;
  "image@2x"?: string;
}

export interface UserBadge {
  awarded_at: Timestamp;
  description: string;
  "image@2x_url": string;
  image_url: string;
  url: string;
}

export interface UserGroup {
  id: number;
  identifier: string;
  name: string;
  short_name: string;
  description: string;
  colour: string;
  playmodes?: Ruleset[];
  has_listing?: boolean;
  has_playmodes?: boolean;
}

export interface UserMonthlyPlaycount {
  start_date: string;
  count: number;
}

export interface UserProfilePage {
  html: string;
  raw: string;
}

export interface UserRankHighest {
  rank: number;
  updated_at: Timestamp;
}

export interface UserRankHistory {
  mode: Ruleset;
  data: number[];
}

export interface UserReplayWatchCount {
  start_date: string;
  count: number;
}

export interface UserAchievement {
  achieved_at: Timestamp;
  achievement_id: number;
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

// src/types/beatmap.ts
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
    "cover@2x": string;
    card: string;
    "card@2x": string;
    list: string;
    "list@2x": string;
    slimcover: string;
    "slimcover@2x": string;
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
  current_nominations?: Nomination[];
  description?: BeatmapsetDescription;
  genre?: BeatmapsetGenre;
  language?: BeatmapsetLanguage;
  pack_tags?: string[];
  ratings?: number[];
  recent_favourites?: User[];
  related_users?: User[];
  user?: User;
}

// Additional beatmapset-related types
export interface Nomination {
  beatmapset_id: number;
  rulesets: Ruleset[];
  reset: boolean;
  user_id: number;
}

export interface BeatmapsetDescription {
  bbcode?: string;
  description?: string;
}

export interface BeatmapsetGenre {
  id: number;
  name: string;
}

export interface BeatmapsetLanguage {
  id: number;
  name: string;
}

// Additional types for multiplayer and forum that might be referenced
export interface ForumTopic {
  id: number;
  title: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  user_id: number;
  username: string;
  forum_id: number;
  type: "normal" | "sticky" | "announcement";
  poll?: ForumPoll;
  post_count: number;
  last_post_id: number;
  last_post_created_at?: Timestamp;
}

export interface ForumPost {
  id: number;
  topic_id: number;
  forum_id: number;
  user_id: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at?: Timestamp;
  edited_at?: Timestamp;
  edited_by_id?: number;
  body?: {
    html: string;
    raw: string;
  };
}

export interface ForumPoll {
  allow_vote_change: boolean;
  ended_at?: Timestamp;
  hide_incomplete_results: boolean;
  last_vote_at?: Timestamp;
  max_votes: number;
  options: ForumPollOption[];
  started_at: Timestamp;
  title: {
    bbcode: string;
    html: string;
  };
  total_vote_count: number;
}

export interface ForumPollOption {
  id: number;
  text: {
    bbcode: string;
    html: string;
  };
  vote_count?: number;
}

// Comment types
export interface Comment {
  id: number;
  parent_id?: number;
  commentable_id: number;
  commentable_type: string;
  legacy_name?: string;
  message?: string;
  message_html?: string;
  replies_count: number;
  votes_count: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at?: Timestamp;
  edited_at?: Timestamp;
  edited_by_id?: number;
  pinned: boolean;
  user_id: number;
}

export interface CommentBundle {
  commentable_meta: any[];
  comments: Comment[];
  has_more: boolean;
  has_more_id?: number;
  included_comments: Comment[];
  pinned_comments?: Comment[];
  sort: string;
  top_level_count?: number;
  total?: number;
  user_follow: boolean;
  user_votes: number[];
  users: User[];
}

// Search result types
export interface SearchResult<T> {
  data: T[];
  total: number;
}

// Wiki types
export interface WikiPage {
  available_locales: string[];
  layout: string;
  locale: string;
  markdown: string;
  path: string;
  subtitle?: string;
  tags: string[];
  title: string;
}

// Notification types
export interface Notification {
  id: number;
  name: string;
  created_at: Timestamp;
  object_type: string;
  object_id: number;
  source_user_id: number;
  is_read: boolean;
  details: Record<string, any>;
}

// src/types/score.ts
export interface Score {
  id?: number;
  user_id: number;
  accuracy: number;
  mods: string[];
  score: number;
  max_combo: number;
  perfect: boolean;
  statistics: {
    ok: number;
    miss: number;
    great: number;
    ignore_hit: number;
    ignore_miss: number;
    large_bonus: number;
    small_bonus: number;
    slider_tail_hit: number;
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
    great: number;
    ignore_hit: number;
    large_bonus: number;
    small_bonus: number;
    slider_tail_hit: number;
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

// src/types/beatmap-scores.ts
export interface BeatmapScores {
  scores: Score[];
  userScore?: BeatmapUserScore;
}

export interface BeatmapUserScore {
  position: number;
  score: Score;
}

export interface BeatmapDifficultyAttributes {
  star_rating: number;
  max_combo: number;
  // osu-specific
  aim_difficulty?: number;
  speed_difficulty?: number;
  slider_factor?: number;
  aim_difficult_slider_count?: number;
  speed_note_count?: number;
  aim_difficult_strain_count?: number;
  speed_difficult_strain_count?: number;
  // taiko-specific
  mono_stamina_factor?: number;
  // mania-specific
  great_hit_window?: number;
}

export interface BeatmapPlaycount {
  beatmap_id: number;
  count: number;
  beatmap?: Beatmap;
  beatmapset?: Beatmapset;
}

// src/types/chat.ts
export interface ChatChannel {
  channel_id: number;
  name: string;
  description?: string;
  icon?: string;
  type: ChannelType;
  moderated: boolean;
  auto_read?: boolean;
  current_user_attributes?: {
    can_message: boolean;
    can_message_error?: string;
    last_read_id?: number;
  };
  last_read_id?: number;
  last_message_id?: number;
  users?: number[];
  recent_messages?: ChatMessage[];
}

export type ChannelType =
  | "PUBLIC"
  | "PRIVATE"
  | "MULTIPLAYER"
  | "SPECTATOR"
  | "TEMPORARY"
  | "PM"
  | "GROUP"
  | "ANNOUNCE";

export interface ChatMessage {
  channel_id: number;
  content: string;
  is_action: boolean;
  message_id: number;
  sender_id: number;
  timestamp: Timestamp;
  type: string;
  uuid?: string;
  sender?: User;
}

export interface UserSilence {
  id: number;
  user_id: number;
}

// src/types/events.ts
export interface Event {
  id: number;
  type: EventType;
  created_at: Timestamp;
  // Event-specific properties
  achievement?: any;
  user?: EventUser;
  beatmap?: EventBeatmap;
  beatmapset?: EventBeatmapset;
  scoreRank?: string;
  rank?: number;
  mode?: Ruleset;
  approval?: string;
  count?: number;
}

export type EventType =
  | "achievement"
  | "beatmapPlaycount"
  | "beatmapsetApprove"
  | "beatmapsetDelete"
  | "beatmapsetRevive"
  | "beatmapsetUpdate"
  | "beatmapsetUpload"
  | "rank"
  | "rankLost"
  | "userSupportAgain"
  | "userSupportFirst"
  | "userSupportGift"
  | "usernameChange";

export interface EventUser {
  username: string;
  url: string;
  previousUsername?: string;
}

export interface EventBeatmap {
  title: string;
  url: string;
}

export interface EventBeatmapset {
  title: string;
  url: string;
}

// src/types/news.ts
export interface NewsPost {
  id: number;
  author: string;
  edit_url: string;
  first_image?: string;
  "first_image@2x"?: string;
  published_at: Timestamp;
  updated_at: Timestamp;
  slug: string;
  title: string;
  preview?: string;
  content?: string;
  navigation?: {
    newer?: NewsPost;
    older?: NewsPost;
  };
}

// src/types/rankings.ts
export interface Rankings {
  beatmapsets?: Beatmapset[];
  cursor?: Cursor;
  ranking: UserStatistics[];
  spotlight?: Spotlight;
  total: number;
}

export interface Spotlight {
  end_date: Timestamp;
  id: number;
  mode_specific: boolean;
  name: string;
  start_date: Timestamp;
  type: string;
  participant_count?: number;
}

// src/types/kudosu.ts
export interface KudosuHistory {
  id: number;
  action:
    | "give"
    | "vote.give"
    | "reset"
    | "vote.reset"
    | "revoke"
    | "vote.revoke";
  amount: number;
  model: string;
  created_at: Timestamp;
  giver?: {
    url: string;
    username: string;
  };
  post?: {
    url?: string;
    title: string;
  };
}

// src/types/api.ts
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

// src/config/index.ts
export interface OsuApiConfig {
  baseUrl?: string;
  userAgent?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  apiVersion?: string;
}

export const DEFAULT_CONFIG: Required<OsuApiConfig> = {
  baseUrl: "https://osu.ppy.sh/api/v2",
  userAgent: "osu-api-sdk",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  apiVersion: "20220705",
};

// src/types/endpoints.ts
export interface GetUserOptions {
  mode?: Ruleset;
  key?: "id" | "username";
}

export interface GetUserScoresOptions {
  type: "best" | "recent" | "firsts";
  include_fails?: boolean;
  mode?: Ruleset;
  limit?: number;
  offset?: number;
  legacy_only?: boolean;
}

export interface GetUserBeatmapsOptions {
  type:
    | "favourite"
    | "graveyard"
    | "guest"
    | "loved"
    | "most_played"
    | "nominated"
    | "pending"
    | "ranked";
  limit?: number;
  offset?: number;
}

export interface GetBeatmapScoresOptions {
  mode?: Ruleset;
  mods?: string[];
  type?: "global" | "country" | "friend";
  legacy_only?: boolean;
}

export interface GetBeatmapsOptions {
  ids: number[];
}

export interface SearchBeatmapsetsOptions {
  query?: string;
  mode?: Ruleset;
  status?: RankStatus | RankStatus[];
  category?:
    | "any"
    | "leaderboard"
    | "ranked"
    | "qualified"
    | "loved"
    | "favourites"
    | "pending"
    | "wip"
    | "graveyard"
    | "mine";
  genre?:
    | "any"
    | "unspecified"
    | "video-game"
    | "anime"
    | "rock"
    | "pop"
    | "other"
    | "novelty"
    | "hip-hop"
    | "electronic"
    | "metal"
    | "classical"
    | "folk"
    | "jazz";
  language?:
    | "any"
    | "english"
    | "japanese"
    | "chinese"
    | "instrumental"
    | "korean"
    | "french"
    | "german"
    | "swedish"
    | "spanish"
    | "italian"
    | "russian"
    | "polish"
    | "other";
  sort?:
    | "title_asc"
    | "title_desc"
    | "artist_asc"
    | "artist_desc"
    | "difficulty_asc"
    | "difficulty_desc"
    | "ranked_asc"
    | "ranked_desc"
    | "rating_asc"
    | "rating_desc"
    | "plays_asc"
    | "plays_desc"
    | "favourites_asc"
    | "favourites_desc"
    | "updated_asc"
    | "updated_desc";
  cursor_string?: CursorString;
}
