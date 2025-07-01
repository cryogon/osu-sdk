import type { Ruleset } from "../types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateUserId(userId: any): number {
  if (typeof userId === "string") {
    const parsed = parseInt(userId, 10);
    if (isNaN(parsed)) {
      throw new ValidationError("User ID must be a valid number");
    }
    return parsed;
  }

  if (typeof userId === "number" && userId > 0) {
    return Math.floor(userId);
  }

  throw new ValidationError("User ID must be a positive number");
}

export function validateBeatmapId(beatmapId: any): number {
  if (typeof beatmapId === "string") {
    const parsed = parseInt(beatmapId, 10);
    if (isNaN(parsed)) {
      throw new ValidationError("Beatmap ID must be a valid number");
    }
    return parsed;
  }

  if (typeof beatmapId === "number" && beatmapId > 0) {
    return Math.floor(beatmapId);
  }

  throw new ValidationError("Beatmap ID must be a positive number");
}

export function validateRuleset(ruleset: any): Ruleset {
  const validRulesets: Ruleset[] = ["osu", "taiko", "fruits", "mania"];

  if (
    typeof ruleset === "string" &&
    validRulesets.includes(ruleset as Ruleset)
  ) {
    return ruleset as Ruleset;
  }

  throw new ValidationError(
    `Ruleset must be one of: ${validRulesets.join(", ")}`
  );
}

export function validateLimit(limit: any, max: number = 100): number {
  if (limit === undefined || limit === null) {
    return 50; // Default limit
  }

  const parsed = typeof limit === "string" ? parseInt(limit, 10) : limit;

  if (isNaN(parsed) || parsed < 1) {
    throw new ValidationError("Limit must be a positive number");
  }

  if (parsed > max) {
    throw new ValidationError(`Limit cannot exceed ${max}`);
  }

  return Math.floor(parsed);
}
