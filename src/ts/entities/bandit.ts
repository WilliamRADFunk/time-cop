import {
    CircleGeometry,
    Color,
    LinearFilter,
    Mesh,
    MeshPhongMaterial,
    Scene,
    Texture } from 'three';
    
import { Collidable } from "../collidable";
import { Explosion } from '../entities/explosion';
import { CollisionatorSingleton } from '../collisionator';
import { SOUNDS_CTRL } from '../controls/controllers/sounds-controller';
import { Projectile } from './projectile';

let index: number = 0;

export class Bandit implements Collidable {
    /**
     * Controls the overall rendering of the bandit
     */
    private _bandit: Mesh;

    /**
     * Controls size and shape of the bandit
     */
    private _banditGeometry: CircleGeometry;

    /**
     * Controls the color of the bandit material
     */
	private _banditMaterial: MeshPhongMaterial;

    /**
     * Keeps track of the x,z point the bandit is at currently.
     */
    private _currentPoint: number[];

    /**
     * Tracks the distance traveled thus far to update the calculateNextPoint calculation.
     */
    private _distanceTraveled: number;

    /**
     * Keeps track of the x,z point of bandit's destination point.
     */
    private _endingPoint: number[];

    /**
     * Explosion from impacted bandit
     */
    private explosion: Explosion;

    /**
     * Flag to signal if bandit has been destroyed or not.
     * True = not destroyed. False = destroyed.
     */
    private _isActive: boolean = true;

    /**
     * Optional constructor param that determines if bandit is on help screen. If so, don't play sounds.
     */
    private isHelpBandit: boolean = false;

    /**
     * Keeps track of the x,z point where bandit fired from.
     */
    private _originalStartingPoint: number[];

    /**
     * Keeps track of live projectiles, to pass along endCycle signals, and destroy calls.
     */
    private _projectiles: Projectile[] = [];

    /**
     * Reference to the scene, used to remove bandit from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The speed at which the bandit travels.
     */
    private _speed: number = 0.008;

    /**
     * The total distance from bandit to final destination.
     */
    private _totalDistance: number;

    /**
     * The wait number of iterations before loosing the bandit.
     * Prevents new level creation from bandit immediately.
     */
    private _waitToFire: number = 0;

    /**
     * The distance to and from the camera that the bandit should exist...its layer.
     */
    private _yPos: number;

    /**
     * Constructor for the Bandit class
     * @param scene        graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param x1           origin point x of where the bandit starts.
     * @param z1           origin point z of where the bandit starts.
     * @param x2           final point x of where the bandit starts.
     * @param z2           final point z of where the bandit starts.
     * @param dist         total distance the bandit must travel.
     * @param speedMod     speed modifier at time of bandit instantiation.
     * @param yPos         layer level for bandit to appear.
     * @param fireNow      optional choice not to wait to have bandit start moving.
     * @param isHelpScreen lets bandit know it's a help screen iteration and not to play sound effects.
     * @hidden
     */
    constructor(
        scene: Scene,
        banditTextures: Texture[],
        x1:number,
        z1: number,
        x2: number,
        z2: number,
        dist: number,
        speedMod: number,
        yPos?: number,
        fireNow?: boolean,
        isHelpScreen?: boolean) {
        index++;
        this._yPos = yPos || 0.6;
        this._speed += (speedMod / 1000);
        this._originalStartingPoint = [x1, z1];
        this._currentPoint = [x1, z1];
        this._endingPoint = [x2, z2];
        this._totalDistance = dist;
        this._distanceTraveled = 0;
        this.isHelpBandit = isHelpScreen;
        // Calculates the first (second vertices) point.
        this._calculateNextPoint();

        this._scene = scene;
		this._banditGeometry = new CircleGeometry(0.35, 16, 16);
        this._banditMaterial = new MeshPhongMaterial();
        this._banditMaterial.map = banditTextures[0];
        this._banditMaterial.map.minFilter = LinearFilter;
        this._banditMaterial.shininess = 0;
        this._banditMaterial.transparent = true;
        this._bandit = new Mesh(this._banditGeometry, this._banditMaterial);
        this._bandit.position.set(this._currentPoint[0], this._yPos, this._currentPoint[1]);
        this._bandit.rotation.set(-1.5708, 0, 0);
        this._bandit.name = `bandit-${index}`;
        this._waitToFire = (fireNow) ? 0 : Math.floor((Math.random() * 2000) + 1);

        // Once created, missile will fly itself, detonate itself, and rease itself.
        // const miss = new Projectile(
        //     this._scene,
        //     this._currentPoint[0], this._currentPoint[1],
        //     this._currentPoint[0], this._currentPoint[1],
        //     Math.abs(this._currentPoint[0]) >= 5 ? 1 : 1,
        //     new Color('#FF0000'),
        //     true, 0.01, this._yPos, 1);
        // this._projectiles.push(miss);
        // CollisionatorSingleton.add(miss);
    }
    /**
     * (Re)activates the bandit, usually at beginning of new level.
     */
    activate(): void {
        // If bandit was never destroyed (game over), let him "wait" on his own loop.
        if (!this._isActive) {
            this._waitToFire = Math.floor((Math.random() * 2000) + 1);
        }
        this._isActive = true;
    }
    /**
     * Adds bandit object to the three.js scene.
     */
    addToScene(): void {
        this._scene.add(this._bandit);
    }
    /**
     * Calculates the next point in the bandit's path.
     */
    private _calculateNextPoint(): void {
        this._distanceTraveled += this._speed;
        // (xt, yt) = ( ( (1 − t) * x0 + t * x1 ), ( (1 − t) * y0 + t * y1) )
        const t = this._distanceTraveled / this._totalDistance;
        this._currentPoint[0] = ((1 - t) * this._originalStartingPoint[0]) + (t * this._endingPoint[0]);
        this._currentPoint[1] = ((1 - t) * this._originalStartingPoint[1]) + (t * this._endingPoint[1]);
        if (this._distanceTraveled >= this._totalDistance - 0.5) {
            this._currentPoint[0] = this._originalStartingPoint[0];
            this._currentPoint[1] = this._originalStartingPoint[1];
            this._distanceTraveled = 0;
        }
    }
    /**
     * Creates an explosion during collision and adds it to the collildables list.
     * @param isInert flag to let explosion know it isn't a 'real' explosion (hit shield).
     */
    private createExplosion(isInert: boolean): void {
        this.explosion = new Explosion(
            this._scene,
            this._bandit.position.x,
            this._bandit.position.z,
            {
                radius: 0.4,
                renderedInert: isInert
            });
        if (!isInert) {
            CollisionatorSingleton.add(this.explosion);
            SOUNDS_CTRL.playExplosionSmall(false);
        } else {
            SOUNDS_CTRL.playExplosionSmall(true);
        }
    }
    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    destroy() {
        if (this.explosion) {
            CollisionatorSingleton.remove(this.explosion);
            this._scene.remove(this.explosion.getMesh());
            this.explosion = null;
        }
        CollisionatorSingleton.remove(this);
        this._scene.remove(this._bandit);
    }
    /**
     * At the end of each loop iteration, move the bandit a little.
     * @returns whether or not the bandit is done, and its points calculated.
     */
    endCycle(): boolean {
        if (this.explosion) {
            if (!this.explosion.endCycle()) {
                CollisionatorSingleton.remove(this.explosion);
                this._scene.remove(this.explosion.getMesh());
                this.explosion = null;
                return false;
            }
        }
        if (this._waitToFire >= 1) {
            this._waitToFire--;
            if (!this._waitToFire && !this.isHelpBandit) {
                // SOUNDS_CTRL.play
            }
            return true;
        }
        if (this._isActive) {
            this._calculateNextPoint();
            this._bandit.position.set(this._currentPoint[0], this._yPos, this._currentPoint[1]);
        }
        return true;
    }
    /**
     * Gets the viability of the object.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    getActive(): boolean {
        return this._isActive;
    }
    /**
     * Gets the current radius of the bounding box (circle) of the collidable.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    getCollisionRadius(): number {
        return 0.2;
    }
    /**
     * Gets the current position of the collidable object.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    getCurrentPosition(): number[] {
        return [this._bandit.position.x, this._bandit.position.z];
    }
    /**
     * Gets the name of the bandit.
     * @returns the name of the bandit.
     */
    getName(): string {
        return this._bandit.name;
    }
    /**
     * Called when something collides with bandit, which destroys it.
     * @param self         the thing to remove from collidables...and scene.
     * @param otherThing   the name of the other thing in collision (mainly for shield).
     * @returns whether or not impact means calling removeFromScene by collisionator.
     */
    impact(self: Collidable, otherThing: string): boolean {
        if (this._isActive) {
            this._isActive = false;
            this.createExplosion(!otherThing.indexOf('Shield'));
            // SOUNDS_CTRL.stop
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
     * Removes bandit object from the 'visible' scene by sending it back to its starting location.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    removeFromScene(scene: Scene): void {
        this._bandit.position.set(this._originalStartingPoint[0], this._yPos, this._originalStartingPoint[1]);
        this._currentPoint = [this._originalStartingPoint[0], this._originalStartingPoint[1]];
        this._distanceTraveled = 0;
    }
}