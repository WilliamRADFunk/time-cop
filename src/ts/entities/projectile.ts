import {
    CircleGeometry,
    Color,
    Geometry,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Scene,
    Vector3 } from 'three';

import { Collidable } from '../collidable';
import { Explosion } from './explosion';
import { CollisionatorSingleton } from '../collisionator';
import { SOUNDS_CTRL } from '../controls/controllers/sounds-controller';
/**
 * Static index to help name one projectile differenly than another.
 */
let index: number = 0;
/**
 * @class
 * Projectile that represents missile unit in the game. It hits something, it blows up.
 */
export class Projectile implements Collidable {
    /**
     * Holds tail color.
     */
    private _color: Color;
    /**
     * Keeps track of the x,z point the missile is at currently.
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
     * Explosion from impacted missile
     */
    private _explosion: Explosion;
    /**
     * Controls size and shape of the missile's glowing head.
     */
    private _headGeometry: CircleGeometry;
    /**
     * Controls the color of the missile's glowing head material.
     */
    private _headMaterial: MeshBasicMaterial;
    /**
     * Controls the overall rendering of the glowing head.
     */
    private _headMesh: Mesh;
    /**
     * Allows for a variable y value in head of missile
     */
    private _headY: number;
    /**
     * Flag to signal if the missile has been destroyed.
     * True is not destroyed. False is destroyed.
     */
    private _isActive: boolean = true;
    /**
     * Flag to signal if the missile can be considered for collisions.
     * True is collidable. False is not collidable.
     */
    private _isCollidable: boolean = false;
    /**
     * Flag to determine enemy allegiance of missile.
     */
    private _isEnemyMissile: boolean;
    /**
     * Keeps track of the x,z point where missile fired from.
     */
    private _originalStartingPoint: number[];
    /**
     * Reference to the scene, used to remove projectile from rendering cycle once destroyed.
     */
    private _scene: Scene;
    /**
     * The speed at which the missile travels.
     */
    private _speed: number = 0.03;
    /**
     * Controls size and shape of the missile's fiery trail.
     */
    private _tailGeometry: Geometry;
    /**
     * Controls the color of the missile's fiery trail material.
     */
    private _tailMaterial: LineBasicMaterial;
    /**
     * Controls the overall rendering of the missile's fiery trail.
     */
    private _tailMesh: Line;
    /**
     * Allows for a variable y value in tail of missile
     */
    private _tailY: number;
    /**
     * The total distance from satellite to player's click point.
     */
    private _totalDistance: number;
    /**
     * The wait number of iterations before loosing the enemy missile.
     * Prevents new level creation from throwing all missiles at once.
     */
    private _waitToFire: number = 0;
    /**
     * Constructor for the Projectile class
     * @param scene              graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param x1                 origin point x of where the missile starts.
     * @param z1                 origin point z of where the missile starts.
     * @param x2                 final point x of where the missile starts.
     * @param z2                 final point z of where the missile starts.
     * @param dist               total distance the missile must travel.
     * @param color              color of the missile's fiery tail (matches satellite body color from which it came).
     * @param colllidableAtBirth Enemy missiles need to be destructable before hitting target, where player's don't.
     * @param speed              optional speed modifier for missiles.
     * @param y                  optional y value for missile (for help screen demo).
     * @param waitToFire         optional wait time (instead of randomized wait time).
     * @hidden
     */
    constructor(
        scene: Scene,
        x1: number,
        z1: number,
        x2: number,
        z2: number,
        dist: number,
        color: Color,
        colllidableAtBirth?: boolean,
        speed?: number,
        y?: number,
        waitToFire?: number) {
        index++;
        this._headY = y || 0.51;
        this._tailY = (y && (y + 0.04)) || 0.55;
        this._color = color;
        this._speed = speed || this._speed;
        this._isCollidable = !!colllidableAtBirth;
        this._isEnemyMissile = this._isCollidable;
        this._scene = scene;
        this._originalStartingPoint = [x1, z1];
        this._currentPoint = [x1, z1];
        this._endingPoint = [x2, z2];
        this._totalDistance = dist;
        this._distanceTraveled = 0;
        // Calculates the first (second vertices) point.
        this._calculateNextPoint();
        // Glowing head of the missile.
        this._headGeometry = new CircleGeometry(0.06, 32);
        this._headMaterial = new MeshBasicMaterial({
            color: 0xFF3F34,
            opacity: 1,
            transparent: true
        });
        this._headMesh = new Mesh(this._headGeometry, this._headMaterial);
        this._headMesh.position.set(this._currentPoint[0], this._headY, this._currentPoint[1]);
        this._headMesh.rotation.set(-1.5708, 0, 0);
        this._headMesh.name = `projectile-${index}`;
        if (this._isEnemyMissile) {
            this._headMesh.name = `projectile-${index}-enemy`;
            this._waitToFire = waitToFire || Math.floor((Math.random() * 900) + 1);
        }
        scene.add(this._headMesh);
    }

    /**
     * Calculates the next point in the missile's path.
     */
    private _calculateNextPoint(): void {
        this._distanceTraveled += this._speed;
        // (xt, yt) = ( ( (1 − t) * x0 + t * x1 ), ( (1 − t) * y0 + t * y1) )
        const t = this._distanceTraveled / this._totalDistance;
        this._currentPoint[0] = ((1 - t) * this._originalStartingPoint[0]) + (t * this._endingPoint[0]);
        this._currentPoint[1] = ((1 - t) * this._originalStartingPoint[1]) + (t * this._endingPoint[1]);
    }

    /**
     * Creates an explosion during collision and adds it to the collidables list.
     * @param isInert flag to let explosion know it isn't a 'real' explosion (hit shield).
     */
    private createExplosion(isInert: boolean): void {
        this._explosion = new Explosion(
            this._scene,
            this._headMesh.position.x,
            this._headMesh.position.z,
            {
                renderedInert: isInert,
                radius: 0.12,
                y: this._headY + 0.26
            });
        if (!isInert) CollisionatorSingleton.add(this._explosion);
        if (!this._isEnemyMissile) SOUNDS_CTRL.playFire();
    }
    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    destroy() {
        if (this._explosion) {
            CollisionatorSingleton.remove(this._explosion);
            this._scene.remove(this._explosion.getMesh());
            this._explosion = null;
        }
        this.removeFromScene(this._scene);
    }
    /**
     * At the end of each loop iteration, move the projectile a little.
     * @returns whether or not the projectile is done, and should be removed from satellite's list.
     */
    endCycle(): boolean {
        if (this._waitToFire >= 1) {
            this._waitToFire--;
            return true;
        }
        if (this._explosion) {
            if (!this._explosion.endCycle()) {
                CollisionatorSingleton.remove(this._explosion);
                this._scene.remove(this._explosion.getMesh());
                this._explosion = null;
                return false;
            }
        } else {
            this._calculateNextPoint();
            if (!this._tailGeometry &&
                this._currentPoint[0] > -5.95 &&
                this._currentPoint[0] < 5.95 &&
                this._currentPoint[1] > -5.95 && this._currentPoint[1] < 5.95) {
                // Creates the missile's fiery trail.
                this._tailGeometry = new Geometry();
                this._tailGeometry.vertices.push(
                    new Vector3(this._currentPoint[0], this._tailY, this._currentPoint[1]),
                    new Vector3(this._currentPoint[0], this._tailY, this._currentPoint[1]));
                this._tailMaterial = new LineBasicMaterial({color: this._color});
                this._tailMesh = new Line(this._tailGeometry, this._tailMaterial);
                this._scene.add(this._tailMesh);
            }
            if (this._tailGeometry) {
                this._tailGeometry.vertices[1].x = this._currentPoint[0];
                this._tailGeometry.vertices[1].z = this._currentPoint[1];
                this._tailGeometry.verticesNeedUpdate = true;
                this._headMesh.position.set(this._currentPoint[0], this._headY, this._currentPoint[1]);
            }
            if (this._distanceTraveled >= this._totalDistance) {
                this.createExplosion(false);
                this.removeFromScene(this._scene);
            }
        }
        return true;
    }
    /**
     * Gets the viability of the explosive blast head.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    getActive(): boolean {
        return this._isCollidable;
    }
    /**
     * Gets the current radius of the bounding box (circle) of the collidable.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    getCollisionRadius(): number {
        return this._headMesh.scale.x * 0.06;
    }
    /**
     * Gets the current position of the explosive blast head.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    getCurrentPosition(): number[] {
        return [this._headMesh.position.x, this._headMesh.position.z];
    }
    /**
     * Gets the name of the missile.
     * @returns the name of the missile.
     */
    getName(): string {
        return this._headMesh.name;
    }
    /**
     * Called when something collides with projectile blast radius, which does nothing unless it hasn't exploded yet.
     * @param self the thing to remove from collidables...and scene.
     * @param otherThing   the name of the other thing in collision (mainly for shield).
     * @returns whether or not impact means removing item from the scene.
     */
    impact(self: Collidable, otherThing: string): boolean {
        if (this._isActive) {
            this._isActive = false;
            const shieldHit = !otherThing.indexOf('Shield');
            shieldHit ? SOUNDS_CTRL.playFire() : SOUNDS_CTRL.playFire();
            this.createExplosion(shieldHit);
            return true;
        }
        return false;
    }
    /**
     * States it is a passive type or not. Two passive types cannot colllide with each other.
     * @returns True is passive | False is not passive
     */
    isPassive(): boolean {
        return false;
    }
    /**
     * Removes missile object from the 'visible' scene by removing non-explosion parts from scene.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    removeFromScene(scene: Scene): void {
        this._isCollidable = false;
        this._isActive = false;
        this._scene.remove(this._tailMesh);
        this._scene.remove(this._headMesh);
    }
}