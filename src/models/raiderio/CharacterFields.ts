/**
 * retrieve high level item information for player
 */
export const gear: string = "gear";

/**
 * retrieve basic information about guild the player is in
 */
export const guild: string = "guild";

/**
 * retrieve raid progression data for character
 */
export const raidProgression: string = "raid_progression";

/**
 * retrieve current season mythic plus scores for player.
 */
export const mythicPlusScores: string = "mythic_plus_scores";

/**
 * retrieve current season mythic plus rankings for player.
 */
export const mythicPlusRanks: string = "mythic_plus_ranks";

/**
 * retrieve three most recent mythic plus runs for player (current season only).
 */
export const mythicPlusRecentRuns: string = "mythic_plus_recent_runs";

/**
 * retrieve three most high scoring mythic plus runs for player (current season only).
 */
export const mythicPlusBestRuns: string = "mythic_plus_best_runs";

/**
 * retrieve all highest scoring mythic plus runs for player (current season only).
 */
export const mythicPlusAllBestRuns: string = "mythic_plus_best_runs:all";

/**
 * retrieve the player's three highest Mythic+ runs by Mythic+ level (current season only)
 */
export const mythicPlusHighestLevelRuns: string = "mythic_plus_highest_level_runs";

/**
 * retrieve the player's three highest Mythic+ runs by Mythic+ level for the current raid week (current season only)
 */
export const mythicPlusWeeklyHighestLevelRuns: string = "mythic_plus_weekly_highest_level_runs";

/**
 * retrieve mythic plus scores for player.
 */
export const previousMythicPlusScores: string = "previous_mythic_plus_scores";

/**
 * retrieve mythic plus rankings for player.
 */
export const previousMythicPlusRanks: string = "previous_mythic_plus_ranks";

/**
 * retrieve raid achievement meta status for a player. This request requires that you specify parameters for the specific tiers you're looking for. For example if you add ':tier21' to the field you will get the status of Tier 21's meta. Multiple tiers can be added to a single request: ':tier21:tier20:tier19'.
 */
export const raidAchievementData: string = "raid_achievement_meta";