import {
    BoxGeometry,
    Mesh,
    MeshPhongMaterial,
    Scene } from "three";

import { CollisionatorSingleton, CollisionType, getCollisionType } from '../collisionator';
import { Collidable } from "../collidable";

/**
 * Static index to help name one barricade differenly than another.
 */
 let index: number = 0;

 /**
  * @class
  * An barricade that blocks bullets but is destroyed when hit.
  */
 export class BarricadeLevelPiece implements Collidable {
    /**
     * Point around which barricade rotates.
     */
    private _centerPoint: [ number, number ];

    /**
     * Flag to signal if barricade has been destroyed or not.
     * True = not destroyed. False = destroyed.
     */
    private _isActive: boolean = true;

    /**
     * Controls the overall rendering of the barricade
     */
    private _barricade: Mesh;

    /**
     * Controls size and shape of the barricade
     */
    private _barricadeGeometry: BoxGeometry;

    /**
     * Controls the color of the barricade material
     */
	private _barricadeMaterial: MeshPhongMaterial;

    /**
     * The radius of the barricade circle.
     */
	private _radius: number = 0.025;

    /**
     * Reference to the scene, used to remove barricade from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The distance to and from the camera that the barricade should exist...its layer.
     */
    private _yPos: number;

    /**
     * Constructor for the Post class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param x     coordinate on x-axis where barricade should instantiate.
     * @param z     coordinate on z-axis where barricade should instantiate.
     * @param yPos  layer level for barricade to appear.
     */
    constructor(scene: Scene, x:number, z: number, isLabelBlock: number, yPos?: number) {
        index++;
        this._scene = scene;
        this._centerPoint = [x, z];
        this._yPos = yPos || 1;

        const dimension = this._radius * 2;
        this._barricadeGeometry = new BoxGeometry(dimension, dimension, dimension);
        this._barricadeMaterial = new MeshPhongMaterial({
            color: !!isLabelBlock ? 0xFFFFFF : 0x0000FF,
            opacity: 1,
            specular: 0x505050,
            shininess: 100,
            transparent: true
        });

        this._barricade = new Mesh(this._barricadeGeometry, this._barricadeMaterial);
        this._barricade.position.set(this._centerPoint[0], this._yPos, this._centerPoint[1]);
        this._barricade.name = `barricade-level-${index}`;
        this._scene.add(this._barricade);
    }

    /**
     * Adds player object to the three.js scene.
     */
    public addToScene(): void {
        this._scene.add(this._barricade);
    }
    
    /**
     * Gets the viability of the barricade.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    public getActive(): boolean {
        return this._isActive;
    }

    /**
     * Gets the current radius of the bounding box (circle) of the barricade.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    public getCollisionRadius(): number {
        return this._radius;
    }

    /**
     * Gets the current position of the barricade.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    public getCurrentPosition(): number[] {
        return this._centerPoint.slice();
    }

    /**
     * Gets the name of the barricade.
     * @returns the name of the barricade.
     */
    public getName(): string {
        return this._barricade.name;
    }

    /**
     * Call to barricade that it has been struck.
     * @param self              the thing to remove from collidables...and scene.
     * @param otherCollidable   the name of the other thing in collision.
     * @returns whether or not impact means removing item from the scene.
     */
    public impact(self: Collidable, otherCollidable?: string): boolean {
        if (this._isActive && getCollisionType(otherCollidable) !== CollisionType.Post) {
            this._isActive = false;
            this._scene.remove(this._barricade);
            CollisionatorSingleton.remove(self);
            return true;
        }
        return false;
    }

    /**
     * States it is a passive type or not. Two passive types cannot collide with each other.
     * @returns True is passive | False is not passive
     */
    public isPassive(): boolean {
        return false;
    }

    /**
     * Removes object from the three.js scene.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public removeFromScene(): void {
        this._isActive = false;
        this._scene.remove(this._barricade);
        CollisionatorSingleton.remove(this);
    }
 }