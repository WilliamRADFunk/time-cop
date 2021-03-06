import {
    Mesh,
    MeshPhongMaterial,
    PlaneGeometry,
    Scene } from "three";

import { CollisionatorSingleton, CollisionType } from '../collisionator';
import { Collidable } from "../collidable";
import { RAD_90_DEG_RIGHT } from "../utils/radians-x-degrees-right";
import { LevelBarricadeBaseColorsMap, LevelBarricadeContrastColorsMap } from "../scenes/main-play-level/configs/level-colors";

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
    private _barricadeGeometry: PlaneGeometry;

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
     * @param level current level player is on.
     * @param yPos  layer level for barricade to appear.
     */
    constructor(scene: Scene, x:number, z: number, isLabelBlock: number, level: number, yPos?: number) {
        index++;
        this._scene = scene;
        this._centerPoint = [x, z];
        this._yPos = yPos || 1;

        const dimension = this._radius * 2;
        this._barricadeGeometry = new PlaneGeometry( dimension, dimension, 10, 10 );
        this._barricadeMaterial = new MeshPhongMaterial({
            color: !!isLabelBlock ? LevelBarricadeContrastColorsMap[level] : LevelBarricadeBaseColorsMap[level],
            opacity: 1,
            specular: 0x505050,
            shininess: 100,
            transparent: true
        });

        this._barricade = new Mesh(this._barricadeGeometry, this._barricadeMaterial);
        this._barricade.position.set(this._centerPoint[0], this._yPos, this._centerPoint[1]);
        this._barricade.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
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
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    public destroy(): void {
        this.removeFromScene();
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
     * Gets the type of the collidable.
     * @returns the type of the collidable.
     */
    public getType(): CollisionType {
        return CollisionType.Barricade;
    }

    /**
     * Call to barricade that it has been struck.
     * @param self              the thing to remove from collidables...and scene.
     * @param otherCollidable   the type of the other thing in collision.
     * @returns whether or not impact means removing item from the scene.
     */
    public impact(self: Collidable, otherCollidable?: CollisionType): boolean {
        if (this._isActive) {
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