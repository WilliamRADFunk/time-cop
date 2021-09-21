
import { Scene } from 'three';

import { Collidable } from './collidable';

/**
 * Assigns number values to the collision type to make certain sum decisions that speed detection along faster.
 */
export const enum CollisionType {
    'Player' = 1,
    'Player_Projectile' = 2,
    // 1 + 2 = 3 should not collide
    'Enemy' = 21,
    'Enemy_Projectile' = 22,
    // 21 + 22 = 43 should not collide
    'Post' = 51,
    // 51 + 21 = 72 should not collide
    // 51 + 1 = 52 should not collide
    'Explosion' = 81,
    'Ricochet' = 81,
    'Barricade' = 200,
    // 200 + 1 = 201 should not collide
    // 200 + 21 = 221 should not collide
}

/**
 * Trnaslates object name to collidable type.
 * @param name the name given to the entity object.
 * @returns the type of entity to which the name belongs.
 */
export function getCollisionType(name: string): CollisionType {
    if (name.indexOf('projectile-enemy') === 0) {
        return CollisionType.Enemy_Projectile;
    }

    if (name.indexOf('projectile-player') === 0) {
        return CollisionType.Player_Projectile;
    }

    if (name.indexOf('player') === 0) {
        return CollisionType.Player;
    }

    if (name.indexOf('enemy-bandit') === 0) {
        return CollisionType.Enemy;
    }

    if (name.indexOf('post') === 0) {
        return CollisionType.Post;
    }

    if (name.indexOf('explosion') === 0) {
        return CollisionType.Explosion;
    }

    if (name.indexOf('ricochet') === 0) {
        return CollisionType.Ricochet;
    }

    if (name.indexOf('barricade') === 0) {
        return CollisionType.Barricade;
    }
}

/**
 * @class
 * The collision detection system.
 */
class Collisionator {
    /**
     * Registered list of things that can are collidable.
     */
    private _collisionItems: Collidable[] = [];

    /**
     * Constructor for the Collisionator class
     * @hidden
     */
    constructor() {}

    /**
     * Adds a collidable object to the list.
     * @param collidable the object with collidable characteristics to add to the collidables list.
     */
    public add(collidable: Collidable): void {
        this._collisionItems.push(collidable);
    }

    /**
     * Check for collisions between two or more object, and signal them to impact.
     * @param scene  graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public checkForCollisions(scene: Scene): void {
        const collItems = this._collisionItems.filter(c => !c.isPassive() && c.getActive());
        const sorted = collItems.reduce((acc, c) => {
            const type = c.getType();
            if (type === CollisionType.Barricade || type === CollisionType.Post) {
                acc.static.push(c);
            } else if (type === CollisionType.Enemy) {
                acc.enemies.push(c);
            } else if (type === CollisionType.Enemy_Projectile) {
                acc.eProjectiles.push(c);
            } else if (type === CollisionType.Player_Projectile) {
                acc.pProjectiles.push(c);
            } else if (type === CollisionType.Player) {
                acc.player = c;
            }
            return acc;
        }, { static: [], enemies: [], eProjectiles: [], pProjectiles: [], player: null });

        // If player is dead, stop checking collisions.
        if (!sorted.player) {
            return;
        }

        const playerPos = sorted.player.getCurrentPosition();
        const playerRad = sorted.player.getCollisionRadius();

        // Checks if enemies collide with player.
        for (let e = 0; e < sorted.enemies.length; e++) {
            const enemy = sorted.enemies[e];
            const enemyPos = enemy.getCurrentPosition();
            const dist = Math.sqrt(
                (enemyPos[0] - playerPos[0]) * (enemyPos[0] - playerPos[0]) +
                (enemyPos[1] - playerPos[1]) * (enemyPos[1] - playerPos[1])
            );
            if (playerRad + enemy.getCollisionRadius() > dist) {
                if (sorted.player.impact(sorted.player, CollisionType.Enemy)) {
                    sorted.player.removeFromScene(scene);
                }
                if (enemy.impact(enemy, CollisionType.Player)) {
                    enemy.removeFromScene(scene);
                }
            }
        }

        // Checks if enemy projectiles collide with player.
        for (let e = 0; e < sorted.eProjectiles.length; e++) {
            const enemyProj = sorted.eProjectiles[e];
            const enemyProjPos = enemyProj.getCurrentPosition();
            const dist = Math.sqrt(
                (enemyProjPos[0] - playerPos[0]) * (enemyProjPos[0] - playerPos[0]) +
                (enemyProjPos[1] - playerPos[1]) * (enemyProjPos[1] - playerPos[1])
            );
            if (playerRad + enemyProj.getCollisionRadius() > dist) {
                if (sorted.player.impact(sorted.player, CollisionType.Enemy_Projectile)) {
                    sorted.player.removeFromScene(scene);
                }
                if (enemyProj.impact(enemyProj, CollisionType.Player)) {
                    enemyProj.removeFromScene(scene);
                }
            }
        }

        // Checks if Enemy Projectiles collide with destructable static objects.
        for (let e = 0; e < sorted.eProjectiles.length; e++) {
            for (let s = 0; s < sorted.static.length; s++) {
                const enemyProj = sorted.eProjectiles[e];
                const staticObj = sorted.static[s];
                const posE = enemyProj.getCurrentPosition();
                const posS = staticObj.getCurrentPosition();
                const radE = enemyProj.getCollisionRadius();
                const radS = staticObj.getCollisionRadius();
                const dist = Math.sqrt(
                    (posS[0] - posE[0]) * (posS[0] - posE[0]) +
                    (posS[1] - posE[1]) * (posS[1] - posE[1])
                );
                if (radE + radS > dist) {
                    if (enemyProj.impact(enemyProj, staticObj.getType())) {
                        enemyProj.removeFromScene(scene);
                    }
                    if (staticObj.impact(staticObj, CollisionType.Enemy_Projectile)) {
                        staticObj.removeFromScene(scene);
                    }
                }
            }
        }

        // Checks if Player Projectiles collide with destructable static objects.
        for (let p = 0; p < sorted.pProjectiles.length; p++) {
            for (let s = 0; s < sorted.static.length; s++) {
                const playerProj = sorted.pProjectiles[p];
                const staticObj = sorted.static[s];
                const posP = playerProj.getCurrentPosition();
                const posS = staticObj.getCurrentPosition();
                const radP = playerProj.getCollisionRadius();
                const radS = staticObj.getCollisionRadius();
                const dist = Math.sqrt(
                    (posS[0] - posP[0]) * (posS[0] - posP[0]) +
                    (posS[1] - posP[1]) * (posS[1] - posP[1])
                );
                if (radP + radS > dist) {
                    if (playerProj.impact(playerProj, staticObj.getType())) {
                        playerProj.removeFromScene(scene);
                    }
                    if (staticObj.impact(staticObj, CollisionType.Player_Projectile)) {
                        staticObj.removeFromScene(scene);
                    }
                }
            }
        }

        // Checks if Enemy Projectiles collide with Player Projectiles.
        for (let e = 0; e < sorted.eProjectiles.length; e++) {
            for (let p = 0; p < sorted.pProjectiles.length; p++) {
                const playerProj = sorted.pProjectiles[p];
                const enemyProj = sorted.eProjectiles[e];
                const posP = playerProj.getCurrentPosition();
                const posE = enemyProj.getCurrentPosition();
                const radP = playerProj.getCollisionRadius();
                const radE = enemyProj.getCollisionRadius();
                const dist = Math.sqrt(
                    (posE[0] - posP[0]) * (posE[0] - posP[0]) +
                    (posE[1] - posP[1]) * (posE[1] - posP[1])
                );
                if (radP + radE > dist) {
                    if (playerProj.impact(playerProj, CollisionType.Enemy_Projectile)) {
                        playerProj.removeFromScene(scene);
                    }
                    if (enemyProj.impact(enemyProj, CollisionType.Player_Projectile)) {
                        enemyProj.removeFromScene(scene);
                    }
                }
            }
        }

        // Checks if Enemies collide with Player Projectiles.
        for (let e = 0; e < sorted.enemies.length; e++) {
            for (let p = 0; p < sorted.pProjectiles.length; p++) {
                const playerProj = sorted.pProjectiles[p];
                const enemy = sorted.enemies[e];
                const posP = playerProj.getCurrentPosition();
                const posE = enemy.getCurrentPosition();
                const radP = playerProj.getCollisionRadius();
                const radE = enemy.getCollisionRadius();
                const dist = Math.sqrt(
                    (posE[0] - posP[0]) * (posE[0] - posP[0]) +
                    (posE[1] - posP[1]) * (posE[1] - posP[1])
                );
                if (radP + radE > dist) {
                    if (playerProj.impact(playerProj, CollisionType.Enemy)) {
                        playerProj.removeFromScene(scene);
                    }
                    if (enemy.impact(enemy, CollisionType.Player_Projectile)) {
                        enemy.removeFromScene(scene);
                    }
                }
            }
        }
    }

    /**
     * Removes a collidable object to the list.
     * @param collidable the object with collidable characteristics to remove to the collidables list.
     */
    public remove(collidable: Collidable): void {
        const index = this._collisionItems.indexOf(collidable);
        if (index > -1) {
            this._collisionItems.splice(index, 1);
        }
    }
}

/**
 * Singleton reference to all things collision detection.
 */
export const CollisionatorSingleton = new Collisionator();