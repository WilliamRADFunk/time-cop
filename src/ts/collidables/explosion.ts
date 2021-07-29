import { CircleGeometry, Mesh, MeshBasicMaterial, Scene } from 'three';

import { Collidable } from '../collidable';
import { ExplosionOptions } from '../models/explosions';

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
    private currentExplosionScale: number = 1;

    /**
     * Controls size and shape of the explosion
     */
    private explosionGeometry: CircleGeometry;

    /**
     * Controls the color of the explosion material
     */
	private explosionMaterial: MeshBasicMaterial;

    /**
     * Controls the overall rendering of the explosion
     */
    private explosion: Mesh;

    /**
     * Flag to signal if explosion is in its collidable state.
     * True = collidable. False = not collidable.
     */
    private isActive: boolean = true;

    /**
     * Flag to signal if the explosion is expanding/contracting.
     * True is expanding. False is contracting..
     */
    private isExplosionGrowing: boolean = true;

    /**
     * Starting size of the explosion. Usually the size of the thing that went boom.
     */
    private radius: number;

    /**
     * Reference to the scene, used to remove projectile from rendering cycle once destroyed.
     */
    private scene: Scene;

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
        this.scene = scene;
        this.radius = _options.radius || 0.25;
        index++;
        this.explosionGeometry = new CircleGeometry(_options.radius, 32);
        this.explosionMaterial = new MeshBasicMaterial({
            color: (!!_options.renderedInert) ? 0x05EDFF : 0xF9A602,
            opacity: 1,
            transparent: false
        });
        this.explosion = new Mesh(this.explosionGeometry, this.explosionMaterial);
        this.explosion.position.set(x, (_options.y || -0.25), z);
        this.explosion.rotation.set(-1.5708, 0, 0);
        this.explosion.name = `explosion-${index}`;
        this.scene.add(this.explosion);
    }
    /**
     * At the end of each loop iteration, expand or contract the explosion a little.
     * @returns whether or not the explosion is done, and should be removed from owner (false).
     */
    endCycle(): boolean {
        if (this.isActive) {
            if (this.isExplosionGrowing) {
                this.currentExplosionScale += 0.02;
                this.explosion.scale.set(this.currentExplosionScale, this.currentExplosionScale, this.currentExplosionScale);
            } else {
                this.currentExplosionScale -= 0.02;
                this.explosionMaterial.transparent = true;
                this.explosionMaterial.opacity = this.currentExplosionScale;
            }
            if (this.isExplosionGrowing && this.currentExplosionScale >= 2) {
                this.currentExplosionScale = 1;
                this.isExplosionGrowing = false;
            } else if (!this.isExplosionGrowing && this.currentExplosionScale <= 0) {
                this.isActive = false;
            }
            return true;
        }
        return false;
    }
    /**
     * Gets the viability of the object.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    getActive(): boolean {
        return this.isActive;
    }
    /**
     * Gets the current radius of the bounding box (circle) of the collidable.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    getCollisionRadius(): number {
        return this.explosion.scale.x * this.radius;
    }
    /**
     * Gets the current position of the collidable object.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    getCurrentPosition(): number[] {
        return [this.explosion.position.x, this.explosion.position.z];
    }
    /**
     * Gets the name of the explosion.
     * @returns the name of the explosion.
     */
    getName(): string {
        return this.explosion.name;
    }
    /**
     * Call to collidable object that it has been struck.
     * @param self the thing to remove from collidables...and scene.
     * @returns whether or not impact means removing item from the scene.
     */
    impact(self: Collidable): boolean {
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
     * Returns mesh so it can be removed from scene.
     * @returns the explosion mesh
     */
    getMesh(): Mesh {
        return this.explosion;
    }
}