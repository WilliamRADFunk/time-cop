import { CircleGeometry, Mesh, MeshBasicMaterial, Scene } from 'three';

import { Collidable } from '../collidable';
import { CollisionType } from '../collisionator';
import { SlowMo_Ctrl } from '../controls/controllers/slow-mo-controller';
import { ExplosionOptions, ExplosionType } from '../models/explosions';

/**
 * Static index to help name one explosion differenly than another.
 */
let index: number = 0;

/**
 * @class
 * An expanding explosion of force that dissolves over time, but can cause other things to explode on contanct.
 */
export class Explosion implements Collidable {
    /**
     * Keeps track of how big explosions scale is at moment.
     */
    private _currentExplosionScale: number = 1;

    /**
     * Controls size and shape of the explosion
     */
    private _explosionGeometry: CircleGeometry;

    /**
     * Controls the color of the explosion material
     */
	private _explosionMaterial: MeshBasicMaterial;

    /**
     * Controls the overall rendering of the explosion
     */
    private _explosion: Mesh;

    /**
     * Flag to signal if explosion is in its collidable state.
     * True = collidable. False = not collidable.
     */
    private _isActive: boolean = true;

    /**
     * Flag to signal if the explosion is expanding/contracting.
     * True is expanding. False is contracting..
     */
    private _isExplosionGrowing: boolean = true;

    /**
     * Starting size of the explosion. Usually the size of the thing that went boom.
     */
    private _radius: number;

    /**
     * Reference to the scene, used to remove projectile from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The speed at which the graphics of the explosion expand and fade away.
     */
    private _speed: number = 0.02;

    /**
     * Constructor for the Explosion class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param x coordinate on x-axis where explosion should instantiate.
     * @param z coordinate on z-axis where explosion should instantiate.
     * @param options available options for adjust size, lvel, and color of the explosion.
     * @hidden
     */
    constructor(scene: Scene, x:number, z: number, options?: ExplosionOptions) {
        const _options = options || ({} as ExplosionOptions);
        this._scene = scene;
        this._radius = _options.radius || 0.25;
        this._speed = (!!_options.speed) ? _options.speed : this._speed;
        index++;
        this._explosionGeometry = new CircleGeometry(_options.radius, 32);
        this._explosionMaterial = new MeshBasicMaterial({
            color: (!!_options.color) ? _options.color : ExplosionType.Fire,
            opacity: 1,
            transparent: false
        });
        this._explosion = new Mesh(this._explosionGeometry, this._explosionMaterial);
        this._explosion.position.set(x, (_options.y || -0.25), z);
        this._explosion.rotation.set(-1.5708, 0, 0);
        this._explosion.name = `explosion-${index}`;
        this._scene.add(this._explosion);
    }

    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    public destroy(): void {
        if (this._explosion) {
            this._scene.remove(this._explosion);
            this._explosion = null;
        }
    }

    /**
     * At the end of each loop iteration, expand or contract the explosion a little.
     * @returns whether or not the explosion is done, and should be removed from owner (false).
     */
    public endCycle(): boolean {
        let speed = this._speed;

        if (this._isActive) {
            if (this._isExplosionGrowing) {
                this._currentExplosionScale += speed;
                this._explosion.scale.set(this._currentExplosionScale, this._currentExplosionScale, this._currentExplosionScale);
            } else {
                this._currentExplosionScale -= speed;
                this._explosionMaterial.transparent = true;
                this._explosionMaterial.opacity = this._currentExplosionScale;
                this._explosionMaterial.needsUpdate = true;
            }
            if (this._isExplosionGrowing && this._currentExplosionScale >= 2) {
                this._currentExplosionScale = 1;
                this._isExplosionGrowing = false;
            } else if (!this._isExplosionGrowing && this._currentExplosionScale <= 0) {
                this._isActive = false;
            }
            return true;
        }
        return false;
    }

    /**
     * Gets the viability of the object.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    public getActive(): boolean {
        return this._isActive;
    }

    /**
     * Gets the current _radius of the bounding box (circle) of the collidable.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    public getCollisionRadius(): number {
        return this._explosion.scale.x * this._radius;
    }

    /**
     * Gets the current position of the collidable object.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    public getCurrentPosition(): number[] {
        return [this._explosion.position.x, this._explosion.position.z];
    }

    /**
     * Gets the name of the explosion.
     * @returns the name of the explosion.
     */
    public getName(): string {
        return this._explosion.name;
    }

    /**
     * Gets the type of the collidable.
     * @returns the type of the collidable.
     */
    public getType(): CollisionType {
        return CollisionType.Explosion;
    }

    /**
     * Call to collidable object that it has been struck.
     * @param self the thing to remove from collidables...and scene.
     * @returns whether or not impact means removing item from the scene.
     */
    public impact(self: Collidable): boolean {
        return false;
    }

    /**
     * States it is a passive type or not. Two passive types cannot colllide with each other.
     * @returns True is passive | False is not passive
     */
    public isPassive(): boolean {
        return true;
    }

    /**
     * Returns mesh so it can be removed from scene.
     * @returns the explosion mesh
     */
    public getMesh(): Mesh {
        return this._explosion;
    }

    /**
     * Removes explosion from scene.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public removeFromScene(scene: Scene): void {
        this.destroy();
    }
}