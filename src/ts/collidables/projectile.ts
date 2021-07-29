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
    private color: Color;
    /**
     * Keeps track of the x,z point the missile is at currently.
     */
    private currentPoint: number[];
    /**
     * Tracks the distance traveled thus far to update the calculateNextPoint calculation.
     */
    private distanceTraveled: number;
    /**
     * Keeps track of the x,z point of player's click point.
     */
    private endingPoint: number[];
    /**
     * Explosion from impacted missile
     */
    private explosion: Explosion;
    /**
     * Controls size and shape of the missile's glowing head.
     */
    private headGeometry: CircleGeometry;
    /**
     * Controls the color of the missile's glowing head material.
     */
    private headMaterial: MeshBasicMaterial;
    /**
     * Controls the overall rendering of the glowing head.
     */
    private headMesh: Mesh;
    /**
     * Allows for a variable y value in head of missile
     */
    private headY: number;
    /**
     * Flag to signal if the missile has been destroyed.
     * True is not destroyed. False is destroyed.
     */
    private isActive: boolean = true;
    /**
     * Flag to signal if the missile can be considered for collisions.
     * True is collidable. False is not collidable.
     */
    private isCollidable: boolean = false;
    /**
     * Flag to determine enemy allegiance of missile.
     */
    private isEnemyMissile: boolean;
    /**
     * Keeps track of the x,z point where missile fired from.
     */
    private originalStartingPoint: number[];
    /**
     * Reference to the scene, used to remove projectile from rendering cycle once destroyed.
     */
    private scene: Scene;
    /**
     * The speed at which the missile travels.
     */
    private speed: number = 0.03;
    /**
     * Controls size and shape of the missile's fiery trail.
     */
    private tailGeometry: Geometry;
    /**
     * Controls the color of the missile's fiery trail material.
     */
    private tailMaterial: LineBasicMaterial;
    /**
     * Controls the overall rendering of the missile's fiery trail.
     */
    private tailMesh: Line;
    /**
     * Allows for a variable y value in tail of missile
     */
    private tailY: number;
    /**
     * The total distance from satellite to player's click point.
     */
    private totalDistance: number;
    /**
     * The wait number of iterations before loosing the enemy missile.
     * Prevents new level creation from throwing all missiles at once.
     */
    private waitToFire: number = 0;
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
        this.headY = y || 0.51;
        this.tailY = (y && (y + 0.04)) || 0.55;
        this.color = color;
        this.speed = speed || this.speed;
        this.isCollidable = !!colllidableAtBirth;
        this.isEnemyMissile = this.isCollidable;
        this.scene = scene;
        this.originalStartingPoint = [x1, z1];
        this.currentPoint = [x1, z1];
        this.endingPoint = [x2, z2];
        this.totalDistance = dist;
        this.distanceTraveled = 0;
        // Calculates the first (second vertices) point.
        this.calculateNextPoint();
        // Glowing head of the missile.
        this.headGeometry = new CircleGeometry(0.06, 32);
        this.headMaterial = new MeshBasicMaterial({
            color: 0xFF3F34,
            opacity: 1,
            transparent: true
        });
        this.headMesh = new Mesh(this.headGeometry, this.headMaterial);
        this.headMesh.position.set(this.currentPoint[0], this.headY, this.currentPoint[1]);
        this.headMesh.rotation.set(-1.5708, 0, 0);
        this.headMesh.name = `Projectile-${index}`;
        if (this.isEnemyMissile) {
            this.headMesh.name = `Projectile-${index}-enemy`;
            this.waitToFire = waitToFire || Math.floor((Math.random() * 900) + 1);
        }
        scene.add(this.headMesh);
    }
    /**
     * Calculates the next point in the missile's path.
     */
    private calculateNextPoint(): void {
        this.distanceTraveled += this.speed;
        // (xt, yt) = ( ( (1 − t) * x0 + t * x1 ), ( (1 − t) * y0 + t * y1) )
        const t = this.distanceTraveled / this.totalDistance;
        this.currentPoint[0] = ((1 - t) * this.originalStartingPoint[0]) + (t * this.endingPoint[0]);
        this.currentPoint[1] = ((1 - t) * this.originalStartingPoint[1]) + (t * this.endingPoint[1]);
    }
    /**
     * Creates an explosion during collision and adds it to the collidables list.
     * @param isInert flag to let explosion know it isn't a 'real' explosion (hit shield).
     */
    private createExplosion(isInert: boolean): void {
        this.explosion = new Explosion(
            this.scene,
            this.headMesh.position.x,
            this.headMesh.position.z,
            {
                renderedInert: isInert,
                radius: 0.12,
                y: this.headY + 0.26
            });
        if (!isInert) CollisionatorSingleton.add(this.explosion);
        if (!this.isEnemyMissile) SOUNDS_CTRL.playFire();
    }
    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    destroy() {
        if (this.explosion) {
            CollisionatorSingleton.remove(this.explosion);
            this.scene.remove(this.explosion.getMesh());
            this.explosion = null;
        }
        this.removeFromScene(this.scene);
    }
    /**
     * At the end of each loop iteration, move the projectile a little.
     * @returns whether or not the projectile is done, and should be removed from satellite's list.
     */
    endCycle(): boolean {
        if (this.waitToFire >= 1) {
            this.waitToFire--;
            return true;
        }
        if (this.explosion) {
            if (!this.explosion.endCycle()) {
                CollisionatorSingleton.remove(this.explosion);
                this.scene.remove(this.explosion.getMesh());
                this.explosion = null;
                return false;
            }
        } else {
            this.calculateNextPoint();
            if (!this.tailGeometry &&
                this.currentPoint[0] > -5.95 &&
                this.currentPoint[0] < 5.95 &&
                this.currentPoint[1] > -5.95 && this.currentPoint[1] < 5.95) {
                // Creates the missile's fiery trail.
                this.tailGeometry = new Geometry();
                this.tailGeometry.vertices.push(
                    new Vector3(this.currentPoint[0], this.tailY, this.currentPoint[1]),
                    new Vector3(this.currentPoint[0], this.tailY, this.currentPoint[1]));
                this.tailMaterial = new LineBasicMaterial({color: this.color});
                this.tailMesh = new Line(this.tailGeometry, this.tailMaterial);
                this.scene.add(this.tailMesh);
            }
            if (this.tailGeometry) {
                this.tailGeometry.vertices[1].x = this.currentPoint[0];
                this.tailGeometry.vertices[1].z = this.currentPoint[1];
                this.tailGeometry.verticesNeedUpdate = true;
                this.headMesh.position.set(this.currentPoint[0], this.headY, this.currentPoint[1]);
            }
            if (this.distanceTraveled >= this.totalDistance) {
                this.createExplosion(false);
                this.removeFromScene(this.scene);
            }
        }
        return true;
    }
    /**
     * Gets the viability of the explosive blast head.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    getActive(): boolean {
        return this.isCollidable;
    }
    /**
     * Gets the current radius of the bounding box (circle) of the collidable.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    getCollisionRadius(): number {
        return this.headMesh.scale.x * 0.06;
    }
    /**
     * Gets the current position of the explosive blast head.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    getCurrentPosition(): number[] {
        return [this.headMesh.position.x, this.headMesh.position.z];
    }
    /**
     * Gets the name of the missile.
     * @returns the name of the missile.
     */
    getName(): string {
        return this.headMesh.name;
    }
    /**
     * Called when something collides with projectile blast radius, which does nothing unless it hasn't exploded yet.
     * @param self the thing to remove from collidables...and scene.
     * @param otherThing   the name of the other thing in collision (mainly for shield).
     * @returns whether or not impact means removing item from the scene.
     */
    impact(self: Collidable, otherThing: string): boolean {
        if (this.isActive) {
            this.isActive = false;
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
        this.isCollidable = false;
        this.isActive = false;
        this.scene.remove(this.tailMesh);
        this.scene.remove(this.headMesh);
    }
}