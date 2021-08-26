/**
 * Collision radius and graphic circle radius of the bandit when traveling in the outer ring.
 */
export const BANDIT_RADIUS = 0.35;

/**
 * Graphic circle radius of the player's character.
 */
export const PLAYER_GRAPHIC_RADIUS = 0.75;

/**
 * Collision radius of the player's character.
 */
export const PLAYER_COLLISION_RADIUS = PLAYER_GRAPHIC_RADIUS / 2.5;

/**
 * Collision radius and graphic circle radius of the bandit when traveling in the inner ring.
 */
export const BANDIT_INSIDE_RADIUS = BANDIT_RADIUS + ((PLAYER_GRAPHIC_RADIUS - BANDIT_RADIUS) / 3);

/**
 * Scale goal used for transitioning a bandit's graphic from smaller to larger as it moves from outer ring to inner ring.
 */
export const BANDIT_SCALE_GOAL = BANDIT_INSIDE_RADIUS / BANDIT_RADIUS;

/**
 * Radius goal used for transitioning a bandit's collision radius from smaller to larger as it moves from outer ring to inner ring.
 */
export const BANDIT_RADIUS_DIFF = BANDIT_INSIDE_RADIUS - BANDIT_RADIUS;
