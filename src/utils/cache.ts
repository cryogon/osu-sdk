import type { Score } from "../types";

export interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  maxSize: number;
}

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

export class Cache<T = any> {
  private store = new Map<string, CacheItem<T>>();
  private options: CacheOptions;

  constructor(options: CacheOptions) {
    this.options = options;
  }

  set(key: string, value: T): void {
    // Clean up expired items if we're at max size
    if (this.store.size >= this.options.maxSize) {
      this.cleanup();
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.options.ttl,
    });
  }

  get(key: string): T | null {
    const item = this.store.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
  } {
    return {
      size: this.store.size,
      maxSize: this.options.maxSize,
      hitRate: 0, // Could implement hit tracking if needed
    };
  }
}

// Additional missing types for completeness
export interface BeatmapDifficultyAttributes {
  star_rating: number;
  max_combo: number;
  // osu-specific
  aim_difficulty?: number;
  speed_difficulty?: number;
  slider_factor?: number;
  // taiko-specific
  mono_stamina_factor?: number;
  // mania-specific
  great_hit_window?: number;
}

export interface BeatmapScores {
  scores: Score[];
  userScore?: BeatmapUserScore;
}

export interface BeatmapUserScore {
  position: number;
  score: Score;
}
