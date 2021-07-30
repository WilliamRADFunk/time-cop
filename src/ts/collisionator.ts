
import { Scene } from 'three';

import { Collidable } from './collidable';

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
    add(collidable: Collidable): void {
        this._collisionItems.push(collidable);
    }

    /**
     * Check for collisions between two or more object, and signal them to impact.
     * @param scene  graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    checkForCollisions(scene: Scene): void {
        for (let i = 0; i < this._collisionItems.length; i++) {
            // If first collidable isn't active, don't collide
            if (!this._collisionItems[i].getActive()) continue;
            for (let j = i+1; j < this._collisionItems.length; j++) {
                const entityI = this._collisionItems[i];
                const entityJ = this._collisionItems[j];
                // If second collidable isn't active, don't collide
                if (!entityJ.getActive()) continue;
                const isEnemyProjectile = (entityI.getName().indexOf('projectile-enemy') > -1 || entityJ.getName().indexOf('projectile-enemy') > -1);
                // Two unexploded enemy projectile should not collide.
                if (entityI.getName().indexOf('projectile-enemy') > -1 && entityJ.getName().indexOf('projectile-enemy') > -1) continue;
                // If both collidables are passive (ie. scenery objects) then they should not collide
                if (entityI.isPassive() && entityJ.isPassive()) continue;
                // No need to register two explosions colliding; they're already blowing up.
                if (!entityI.getName().indexOf('explosion') &&
                    !entityJ.getName().indexOf('explosion')) continue;
                // Two enemy bandits shouldn't collide.
                if (!entityI.getName().indexOf('bandit') &&
                    !entityJ.getName().indexOf('bandit')) continue;
                // Unexploded enemy projectile and bandits should not collide.
                if ((!entityI.getName().indexOf('bandit') ||
                    !entityJ.getName().indexOf('bandit')) && isEnemyProjectile) continue;

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
    remove(collidable: Collidable): void {
        const index = this._collisionItems.indexOf(collidable);
        if (index > -1) {
            this._collisionItems.splice(index, 1);
        }
    }
}
export const CollisionatorSingleton = new Collisionator();