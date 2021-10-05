import {
    CircleGeometry,
    Color,
    Geometry,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PlaneGeometry,
    Scene,
    Vector3 } from 'three';

import { Collidable } from '../collidable';
import { Ricochet } from './ricochet';
import { CollisionatorSingleton, CollisionType } from '../collisionator';
import { SOUNDS_CTRL } from '../controls/controllers/sounds-controller';
import { RicochetType } from '../models/ricochets';
import { ScoreCtrl } from '../controls/controllers/score-controller';
import { SlowMo_Ctrl } from '../controls/controllers/slow-mo-controller';
import { makeBullet } from '../utils/make-projectile';

/**
 * Static index to help name one projectile differenly than another.
 */
let index: number = 0;

/**
 * The options necessary to create a regular projectile.
 * This allows progressive changes in speed and color to be applied as needed.
 */
export interface ProjectileOptions {
    /**
     * Graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    scene: Scene;

    /**
     * Origin point x of where the projectile starts.
     */              
    x1: number;

    /**
     * Origin point z of where the projectile starts.
     */                 
    z1: number;

    /**
     * Final point x of where the projectile starts.
     */                 
    x2: number;

    /**
     * Final point z of where the projectile starts.
     */                 
    z2: number;

    /**
     * Total distance the projectile must travel.
     */                 
    dist: number;

    /**
     * Color of the projectile.
     */               
    color: Color;

    /**
     * Enemy projectiles need to be destructable before hitting target, where player's don't.
     */              
    colllidableAtBirth?: boolean;

    /**
     * Optional speed modifier for projectiles.
     */
    speed?: number;
    
    /**
     * Optional y value for projectile (for help screen demo).
     */
    y?: number;
    
    /**
     * Signals if this projectile was fired by the player.
     */
    playerMissile?: boolean;
    
    /**
     * Reference to the scoreboard used to get and add points throughout play.
     */
    scoreboard?: ScoreCtrl;
}

/**
 * @class
 * Projectile that represents projectile unit in the game. It hits something, it blows up.
 */
export class Projectile implements Collidable {
    /**
     * Holds color.
     */
    private _color: Color;

    /**
     * Keeps track of the x,z point the projectile is at currently.
     */
    private _currentPoint: number[];

    /**
     * Tracks the distance traveled thus far to update the _calculateNextPoint calculation.
     */
    private _distanceTraveled: number;

    /**
     * Keeps track of the x,z point of player's click point.
     */
    private _endingPoint: number[];

    /**
     * Ricochet from impacted projectile
     */
    private _ricochet: Ricochet;

    /**
     * Tracks the frame number up to a max and resets.
     */
    private _frameCounter: number = 0;

    /**
     * Flag to signal if the projectile has been destroyed.
     * True is not destroyed. False is destroyed.
     */
    private _isActive: boolean = true;

    /**
     * Flag to signal if the projectile can be considered for collisions.
     * True is collidable. False is not collidable.
     */
    private _isCollidable: boolean = true;

    /**
     * Keeps track of the x,z point where projectile fired from.
     */
    private _originalStartingPoint: number[];

    /**
     * Number of points scored for destroying enemy projectile.
     */
    private _points: number = 5;

    /**
     * Controls the overall rendering of the glowing head and tail.
     */
    private _projectileObjects: Object3D[] = [];

    /**
     * Reference to the scene, used to remove projectile from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The instance of scoreboard used for this level instance.
     */
    private _scoreboard: ScoreCtrl;

    /**
     * The speed at which the projectile travels.
     */
    private _speed: number = 0.03;

    /**
     * The total distance from projectile origin to projectile's final point.
     */
    private _totalDistance: number;

    /**
     * Tracks what frame the projectile trail should be using.
     */
    private _trailCounter: number = 0;

    /**
     * The collision type of the projectile (ie. Player_Projectile or Enemy_Projectile).
     */
    private _type: CollisionType;

    /**
     * Constructor for the Projectile class
     * @param options   options for this specific projectile.
     * @hidden
     */
    constructor(options: ProjectileOptions) {
        index++;
        this._scoreboard = options.scoreboard;
        const headY = options.y || 0.51;
        const tailY = (options.y && (options.y + 0.04)) || 0.55;
        this._color = options.color;
        this._speed = options.speed || this._speed;
        this._isCollidable = !!options.colllidableAtBirth;
        this._type = !!options.playerMissile ? CollisionType.Player_Projectile : CollisionType.Enemy_Projectile;
        this._scene = options.scene;
        this._originalStartingPoint = [options.x1, options.z1];
        this._currentPoint = [options.x1, options.z1];
        this._endingPoint = [options.x2, options.z2];
        this._totalDistance = options.dist;
        this._distanceTraveled = 0;
        // Calculates the first (second vertices) point.
        this._calculateNextPoint();
        
        const startX = Number(this._currentPoint[0].toFixed(3));
        const startZ = Number(this._currentPoint[1].toFixed(3));
        const endX = Number(this._endingPoint[0].toFixed(3));
        const endZ = Number(this._endingPoint[1].toFixed(3));
        const xDir = -((endX - startX) / Math.abs(endX - startX));
        const zDir = -((endZ - startZ) / Math.abs(endZ - startZ));
        const isDiag = !isNaN(xDir) && !isNaN(zDir);
        const diagRot = (xDir > 0 && zDir < 0)
            ? 2.35619
            : (xDir < 0 && zDir > 0)
                ? 5.49779
                : (xDir < 0 && zDir < 0)
                    ? -2.35619
                    : -5.49779;
        const straightRot = isNaN(zDir) ? xDir * 1.5708 : zDir === 1 ? 0 : 3.14159;
        this._projectileObjects = makeBullet(this._color, headY, tailY, [0, isDiag ? diagRot : straightRot, 0], 2, true);
        
        if (this._type === CollisionType.Enemy_Projectile) {
            this._projectileObjects[0].name = `projectile-enemy-${index}`;
        }
        this._projectileObjects.forEach(obj => this._scene.add(obj));
    }

    /**
     * Calculates the next point in the projectile's path.
     */
    private _calculateNextPoint(): void {
        if (SlowMo_Ctrl.getSlowMo() && this._projectileObjects[0]) {
            const posB = SlowMo_Ctrl.getBubbleCenter();
            const posP = this.getCurrentPosition();
            const radB = 1;
            const radP = this.getCollisionRadius();
            const dist = Math.sqrt(
                (posB[0] - posP[0]) * (posB[0] - posP[0]) +
                (posB[1] - posP[1]) * (posB[1] - posP[1])
            );
            // Inside the time bubble, move at normal speed.
            if (radP + radB > dist) {
                this._distanceTraveled += this._speed;
            // Outside the time bubble, move at 1/8th speed.
            } else {
                this._distanceTraveled += this._speed / 8;
            }
        } else {
            this._distanceTraveled += this._speed
        }
        // (xt, yt) = ( ( (1 − t) * x0 + t * x1 ), ( (1 − t) * y0 + t * y1) )
        const t = this._distanceTraveled / this._totalDistance;
        this._currentPoint[0] = ((1 - t) * this._originalStartingPoint[0]) + (t * this._endingPoint[0]);
        this._currentPoint[1] = ((1 - t) * this._originalStartingPoint[1]) + (t * this._endingPoint[1]);
    }

    /**
     * Creates an ricochet during collision and adds it to the collidables list.
     * @param isInert flag to let ricochet know it isn't a 'real' ricochet (hit shield).
     */
    private _createRicochet(isInert: boolean): void {
        this._ricochet = new Ricochet(
            this._scene,
            this._projectileObjects[0].position.x,
            this._projectileObjects[0].position.z,
            {
                color: isInert ? RicochetType.Electric : RicochetType.Fire,
                radius: 0.12,
                y: this._projectileObjects[0].position.y + 0.26
            });
        if (!isInert) CollisionatorSingleton.add(this._ricochet);
    }

    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    public destroy(): void {
        if (this._ricochet) {
            CollisionatorSingleton.remove(this._ricochet);
            this._ricochet.destroy();
            this._ricochet = null;
        }
        this.removeFromScene(this._scene);
    }

    /**
     * At the end of each loop iteration, move the projectile a little.
     * @returns whether or not the projectile is done, and should be removed from list. FALSE --> no longer needed. TRUE --> Keep cycling.
     */
    public endCycle(): boolean {
        if (this._ricochet) {
            if (!this._ricochet.endCycle()) {
                CollisionatorSingleton.remove(this._ricochet);
                this._ricochet.destroy();
                this._ricochet = null;
                return false;
            }
        } else {
            // Track the current frame in sequences of 20.
            this._frameCounter ++;
            if (this._frameCounter  >= 60) {
                this._frameCounter  = 0;
            }
            this._calculateNextPoint();
            this._projectileObjects.forEach(obj => obj.position.set(this._currentPoint[0], 0, this._currentPoint[1]));

            // Every ten frames switch to a different projectile trail.
            if (this._frameCounter % 30 === 0) {
                this._trailCounter = !this._trailCounter ? 1 : 0;
                this._projectileObjects.forEach(obj => obj.visible = false);
                this._projectileObjects[this._trailCounter].visible = true;
            }

            // Projectile has reached its max destination, detonate.
            if (this._distanceTraveled >= this._totalDistance) {
                this._projectileObjects.forEach(obj => obj.visible = false);
                this._frameCounter = 0;
                this._trailCounter = 0;
                this._createRicochet(false);
                SOUNDS_CTRL.playBulletDullRicochet();
                this.removeFromScene(this._scene);
            }
        }
        return true;
    }

    /**
     * Gets the viability of the explosive blast head.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    public getActive(): boolean {
        return this._isCollidable;
    }

    /**
     * Gets the current radius of the bounding box (circle) of the collidable.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    public getCollisionRadius(): number {
        return this._projectileObjects[0].scale.x * 0.06;
    }

    /**
     * Gets the current position of the explosive blast head.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    public getCurrentPosition(): number[] {
        return [this._projectileObjects[0].position.x, this._projectileObjects[0].position.z];
    }

    /**
     * Gets the name of the projectile.
     * @returns the name of the projectile.
     */
    public getName(): string {
        return this._projectileObjects[0].name;
    }

    /**
     * Gets the type of the collidable.
     * @returns the type of the collidable.
     */
    public getType(): CollisionType {
        return this._type;
    }

    /**
     * Called when something collides with projectile blast radius, which does nothing unless it hasn't exploded yet.
     * @param self the thing to remove from collidables...and scene.
     * @param otherCollidable   the name of the other thing in collision (mainly for shield).
     * @returns whether or not impact means removing item from the scene.
     */
    public impact(self: Collidable, otherCollidable: CollisionType): boolean {
        if (this._isActive) {
            this._isActive = false;
            if (otherCollidable === CollisionType.Post || otherCollidable === CollisionType.Barricade) {
                SOUNDS_CTRL.playBulletDullRicochet();
            } else if (this._scoreboard && otherCollidable === CollisionType.Enemy_Projectile) {
                this._scoreboard.addPoints(this._points);
                SOUNDS_CTRL.playBullet2BulletRicochet();
            }
            this._createRicochet(false);
            return true;
        }
        return false;
    }

    /**
     * States it is a passive type or not. Two passive types cannot colllide with each other.
     * @returns True is passive | False is not passive
     */
    public isPassive(): boolean {
        return false;
    }

    /**
     * Removes projectile object from the 'visible' scene by removing non-ricochet parts from scene.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public removeFromScene(scene: Scene): void {
        this._isCollidable = false;
        this._isActive = false;
        this._projectileObjects.forEach(obj => this._scene.remove(obj));
    }
}