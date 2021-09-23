/**
 * Collision radius and graphic circle radius of the enemy when traveling in the outer ring.
 */
export const ENEMY_RADIUS = 0.35;

/**
 * Graphic circle radius of the player's character.
 */
export const PLAYER_GRAPHIC_RADIUS = 0.75;

/**
 * Collision radius of the player's character.
 */
export const PLAYER_COLLISION_RADIUS = PLAYER_GRAPHIC_RADIUS / 2.5;

/**
 * Collision radius and graphic circle radius of the enemy when traveling in the inner ring.
 */
export const ENEMY_INSIDE_RADIUS = ENEMY_RADIUS + ((PLAYER_GRAPHIC_RADIUS - ENEMY_RADIUS) / 3);

/**
 * Scale goal used for transitioning a enemy's graphic from smaller to larger as it moves from outer ring to inner ring.
 */
export const ENEMY_SCALE_GOAL = ENEMY_INSIDE_RADIUS / ENEMY_RADIUS;

/**
 * Radius goal used for transitioning a enemy's collision radius from smaller to larger as it moves from outer ring to inner ring.
 */
export const ENEMY_RADIUS_DIFF = ENEMY_INSIDE_RADIUS - ENEMY_RADIUS;
