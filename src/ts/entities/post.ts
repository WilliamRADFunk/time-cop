import {
    Mesh,
    MeshPhongMaterial,
    Scene,
    SphereGeometry } from "three";

import { CollisionatorSingleton, CollisionType, getCollisionType } from '../collisionator';
import { Collidable } from "../collidable";

export const PostPositions: [number, number][] = [
    [ -4, -3 ], [ 4, -3 ],
    [ -4, -2.5 ], [ 4, -2.5 ],
    [ -4, -2 ], [ 4, -2 ],
    [ -4, -1.5 ], [ 4, -1.5 ],
    [ -4, -1 ], [ 4, -1 ],
    [ -4, -0.5 ], [ 4, -0.5 ],
    [ -4, 0 ], [ 4, 0 ],
    [ -4, 0.5 ], [ 4, 0.5 ],
    [ -4, 1 ], [ 4, 1 ],
    [ -4, 1.5 ], [ 4, 1.5 ],
    [ -4, 2 ], [ 4, 2 ],
    [ -4, 2.5 ], [ 4, 2.5 ],
    [ -4, 3 ], [ 4, 3 ],

    [ -3, 4 ], [ 3, 4 ],
    [ -2.5, 4 ], [ 2.5, 4 ],
    [ -2, 4 ], [ 2, 4 ],
    [ -1.5, 4 ], [ 1.5, 4 ],
    [ -1, 4 ], [ 1, 4 ],
    [ 0.6, 4 ],
    [ -0.6, 4 ],
    [ -1, -4 ], [ 1, -4 ],
    [ -1.5, -4 ], [ 1.5, -4 ],
    [ -2, -4 ], [ 2, -4 ],
    [ -2.5, -4 ], [ 2.5, -4 ],
    [ -3, -4 ], [ 3, -4 ],
    [ -0.6, -4 ],
    [ 0.6, -4 ]
];

/**
 * Static index to help name one post differenly than another.
 */
 let index: number = 0;

 /**
  * @class
  * An post that blocks bullets but is destroyed when hit.
  */
 export class Post implements Collidable {
    /**
     * Point around which post rotates.
     */
    private _centerPoint: [ number, number ];

    /**
     * Flag to signal if post has been destroyed or not.
     * True = not destroyed. False = destroyed.
     */
    private _isActive: boolean = true;

    /**
     * Controls the overall rendering of the post
     */
    private _post: Mesh;

    /**
     * Controls size and shape of the post
     */
    private _postGeometry: SphereGeometry;

    /**
     * Controls the color of the post material
     */
	private _postMaterial: MeshPhongMaterial;

    /**
     * The radius of the post circle.
     */
	private _radius: number = 0.05;

    /**
     * Reference to the scene, used to remove post from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The distance to and from the camera that the post should exist...its layer.
     */
    private _yPos: number;

    /**
     * Constructor for the Post class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param x     coordinate on x-axis where post should instantiate.
     * @param z     coordinate on z-axis where post should instantiate.
     * @param yPos  layer level for post to appear.
     */
    constructor(scene: Scene, x:number, z: number, yPos?: number) {
        index++;
        this._scene = scene;
        this._centerPoint = [x, z];
        this._yPos = yPos || 1;

        this._postGeometry = new SphereGeometry(this._radius, 32, 32);
        this._postMaterial = new MeshPhongMaterial({
            color: 0x966F33,
            opacity: 0.75,
            specular: 0x505050,
            shininess: 100,
            transparent: true
        });

        this._post = new Mesh(this._postGeometry, this._postMaterial);
        this._post.position.set(this._centerPoint[0], this._yPos, this._centerPoint[1]);
        this._post.name = `post-${index}`;
        this._scene.add(this._post);
    }

    /**
     * Adds player object to the three.js scene.
     */
    public addToScene(): void {
        this._scene.add(this._post);
    }

    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    public destroy(): void {
        this.removeFromScene();
    }
    
    /**
     * Gets the viability of the post.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    public getActive(): boolean {
        return this._isActive;
    }

    /**
     * Gets the current radius of the bounding box (circle) of the post.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    public getCollisionRadius(): number {
        return this._radius;
    }

    /**
     * Gets the current position of the post.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    public getCurrentPosition(): number[] {
        return this._centerPoint.slice();
    }

    /**
     * Gets the name of the post.
     * @returns the name of the post.
     */
    public getName(): string {
        return this._post.name;
    }

    /**
     * Gets the type of the collidable.
     * @returns the type of the collidable.
     */
    public getType(): CollisionType {
        return CollisionType.Post;
    }

    /**
     * Call to post that it has been struck.
     * @param self              the thing to remove from collidables...and scene.
     * @param otherCollidable   the type of the other thing in collision.
     * @returns whether or not impact means removing item from the scene.
     */
    public impact(self: Collidable, otherCollidable?: CollisionType): boolean {
        if (this._isActive) {
            this._isActive = false;
            this._scene.remove(this._post);
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
        this._scene.remove(this._post);
        CollisionatorSingleton.remove(this);
    }
 }