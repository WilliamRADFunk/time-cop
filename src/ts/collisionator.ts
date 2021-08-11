
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
        for (let i = 0; i < this._collisionItems.length; i++) {
            // If first collidable isn't active, don't collide
            if (!this._collisionItems[i].getActive()) continue;
            for (let j = i+1; j < this._collisionItems.length; j++) {
                const entityI = this._collisionItems[i];
                const entityJ = this._collisionItems[j];
                // If second collidable isn't active, don't collide
                if (!entityJ.getActive()) continue;
                // If either collidables are passive (ie. scenery objects) then they should not collide
                if (entityI.isPassive() || entityJ.isPassive()) continue;

                const iType = getCollisionType(entityI.getName());
                const jType = getCollisionType(entityJ.getName());
                
                // Two entities of the same type can't collide.
                if (iType === jType) continue;

                const sum = iType + jType;

                // This unique sum means one is player and the other a player projectile.
                if (sum === 3) continue;

                // This unique sum means one is an enemy and the other an enemy projectile.
                if (sum === 43) continue;

                // This unique sum means one is an player and the other a post.
                if (sum === 52) continue;

                // This unique sum means one is an enemy and the other a post.
                if (sum === 72) continue;

                // This unique sum means one is the player and the other a barricade.
                if (sum === 201) continue;

                // This unique sum means one is an enemy and the other a barricade.
                if (sum === 221) continue;

                const posI = entityI.getCurrentPosition();
                const posJ = entityJ.getCurrentPosition();
                const radI = entityI.getCollisionRadius();
                const radJ = entityJ.getCollisionRadius();
                const dist = Math.sqrt(
                    (posJ[0] - posI[0]) * (posJ[0] - posI[0]) +
                    (posJ[1] - posI[1]) * (posJ[1] - posI[1])
                );
                if (radI + radJ > dist) {
                    if (entityI.impact(entityI, entityJ.getName()) &&
                    typeof entityI.removeFromScene === 'function') {
                        entityI.removeFromScene(scene);
                    }
                    if (entityJ.impact(entityJ, entityI.getName()) &&
                    typeof entityJ.removeFromScene === 'function') {
                        entityJ.removeFromScene(scene);
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