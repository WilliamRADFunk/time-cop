import {
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PlaneGeometry,
    Scene } from 'three';

import { Collidable } from '../collidable';
import { CollisionType } from '../collisionator';
import { RicochetOptions, RicochetType } from '../models/ricochets';

/**
 * Static index to help name one ricochet differenly than another.
 */
let index: number = 0;

/**
 * @class
 * An expanding ricochet of force that dissolves over time, but can cause other things to explode on contanct.
 */
export class Ricochet implements Collidable {
    /**
     * Keeps track of the count of frames so far for the ricochet animation.
     */
    private _currentRicochetCount: number = 1;

    /**
     * Keeps track of the current of index of objects in animation to display.
     */
    private _currentRicochetFrame: number = 0;

    /**
     * Controls the overall rendering of the glowing head and tail.
     */
    private _ricochetObjects: Object3D[] = [];

    /**
     * Flag to signal if ricochet is in its collidable state.
     * True = collidable. False = not collidable.
     */
    private _isActive: boolean = true;

    /**
     * Flag to signal if the ricochet is expanding/contracting.
     * True is expanding. False is contracting..
     */
    private _isRicochetGrowing: boolean = true;

    /**
     * Starting size of the ricochet. Usually the size of the thing that went boom.
     */
    private _radius: number;

    /**
     * Reference to the scene, used to remove projectile from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The speed at which the graphics of the ricochet expand and fade away.
     */
    private _speed: number = 0.02;

    /**
     * Constructor for the Ricochet class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param x coordinate on x-axis where ricochet should instantiate.
     * @param z coordinate on z-axis where ricochet should instantiate.
     * @param options available options for adjust size, lvel, and color of the ricochet.
     * @hidden
     */
    constructor(scene: Scene, x:number, z: number, options?: RicochetOptions) {
        const _options = options || ({} as RicochetOptions);
        this._scene = scene;
        this._radius = _options.radius || 0.25;
        this._speed = (!!_options.speed) ? _options.speed : this._speed;
        index++;

        const color = (!!_options.color) ? _options.color : RicochetType.Fire;
        const materialOptions = {
            color,
            opacity: 1,
            transparent: false
        };
        const y = (_options.y || -0.25);

        this._ricochetObjects[0] = new Object3D();
        let ricochetGeometry = new PlaneGeometry(0.1, 0.1, 32, 32);
        let ricochetMaterial = new MeshBasicMaterial(materialOptions);
        let ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x, y, z);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[0].add(ricochet);

        this._ricochetObjects[0].name = `ricochet-${index}`;
        this._ricochetObjects[0].visible = true;
        this._scene.add(this._ricochetObjects[0]);

        this._ricochetObjects[1] = new Object3D();
        ricochetGeometry = new PlaneGeometry(0.1, 0.1, 32, 32);
        ricochetMaterial = new MeshBasicMaterial(materialOptions);
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x, y, z);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[1].add(ricochet);

        ricochetGeometry = new PlaneGeometry(0.05, 0.05, 32, 32);
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x + 0.05, y, z + 0.05);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[1].add(ricochet);
        
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x + 0.05, y, z - 0.05);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[1].add(ricochet);
        
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x - 0.05, y, z + 0.05);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[1].add(ricochet);
        
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x - 0.05, y, z - 0.05);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[1].add(ricochet);

        this._ricochetObjects[1].name = `ricochet-${index}`;
        this._ricochetObjects[1].visible = false;
        this._scene.add(this._ricochetObjects[1]);

        this._ricochetObjects[2] = new Object3D();
        ricochetGeometry = new PlaneGeometry(0.1, 0.1, 32, 32);
        ricochetMaterial = new MeshBasicMaterial(materialOptions);
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x, y, z);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[2].add(ricochet);

        ricochetGeometry = new PlaneGeometry(0.05, 0.05, 32, 32);
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x + 0.1, y, z + 0.1);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[2].add(ricochet);
        
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x + 0.1, y, z - 0.1);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[2].add(ricochet);
        
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x - 0.1, y, z + 0.1);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[2].add(ricochet);
        
        ricochet = new Mesh(ricochetGeometry, ricochetMaterial);
        ricochet.position.set(x - 0.1, y, z - 0.1);
        ricochet.rotation.set(-1.5708, 0, 0);
        this._ricochetObjects[2].add(ricochet);

        this._ricochetObjects[2].name = `ricochet-${index}`;
        this._ricochetObjects[2].visible = false;
        this._scene.add(this._ricochetObjects[2]);
    }

    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    public destroy(): void {
        if (this._ricochetObjects[0]) {
            this._ricochetObjects.forEach(obj => this._scene.remove(obj));
            this._ricochetObjects.length = 0;
        }
    }

    /**
     * At the end of each loop iteration, expand or contract the ricochet a little.
     * @returns whether or not the ricochet is done, and should be removed from owner (false).
     */
    public endCycle(): boolean {
        let speed = this._speed;

        if (this._isActive) {
            this._currentRicochetCount++;

            if (this._currentRicochetCount < 60) {
                this._isRicochetGrowing = true;
            } else if (this._currentRicochetCount >= 100) {
                this._currentRicochetCount = 0;
                this._isActive = false;
                return false;
            } else {
                this._isRicochetGrowing = false;
            }
            
            let shouldChangeFrame = false;
            if (this._currentRicochetCount % 20 === 0) {
                shouldChangeFrame = true;
            }

            if (shouldChangeFrame) {
                this._ricochetObjects.forEach(obj => obj.visible = false);
                if (this._isRicochetGrowing) {
                    this._currentRicochetFrame++;
                } else {
                    this._currentRicochetFrame--;
                }
                
                if (this._currentRicochetFrame >= 3) {
                    this._currentRicochetFrame = 2;
                } else if (this._currentRicochetFrame < 0) {
                    this._currentRicochetFrame = 0;
                }
                this._ricochetObjects[this._currentRicochetFrame].visible = true;
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
        return this._radius;
    }

    /**
     * Gets the current position of the collidable object.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    public getCurrentPosition(): number[] {
        return [this._ricochetObjects[0].position.x, this._ricochetObjects[0].position.z];
    }

    /**
     * Gets the name of the ricochet.
     * @returns the name of the ricochet.
     */
    public getName(): string {
        return this._ricochetObjects[0].name;
    }

    /**
     * Gets the type of the collidable.
     * @returns the type of the collidable.
     */
    public getType(): CollisionType {
        return CollisionType.Ricochet;
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
     * Removes ricochet from scene.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public removeFromScene(scene: Scene): void {
        this.destroy();
    }
}