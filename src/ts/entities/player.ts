import {
    CircleGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    Scene,
    Texture } from 'three';
    
import { Collidable } from "../collidable";
import { CollisionatorSingleton } from '../collisionator';
import { SOUNDS_CTRL } from '../controls/controllers/sounds-controller';
import { Entity, EntityDirection } from '../models/entity';
import { ExplosionType } from '../models/explosions';
import { animateEntity } from '../utils/animate-entity';
import { calculateEntityProjectilePathMain, calculateEntityProjectilePathSecondary } from '../utils/calculate-entity-projectile-path';
import { calculateNewEntityDirection } from '../utils/calculate-new-entity-direction';
import { makeEntity } from '../utils/make-entity';
import { makeEntityMaterial } from '../utils/make-entity-material';
import { rotateEntity } from '../utils/rotate-entity';
import { Explosion } from './explosion';
import { Projectile } from './projectile';

let index: number = 0;
const showHitBox = true;

export class Player implements Collidable, Entity {
    /**
     * Tracks position in walking animation sequence to know which animation to switch to next frame.
     */
     _animationCounter: number = 0;

    /**
     * The three meshes to flip through to simulate a walking animation.
     */
     _animationMeshes: [Mesh, Mesh, Mesh] = [ null, null, null ];

     /**
      * Current direction crew member should be facing.
      */
    _currDirection: EntityDirection = EntityDirection.Right;

    /**
     * Keeps track of the x,z point the player is at currently.
     */
    private _currentPoint: number[];

    /**
     * Flag to signal if player has been destroyed or not.
     * True = not destroyed. False = destroyed.
     */
    private _isActive: boolean = true;

    /**
     * Optional constructor param that determines if player is on help screen. If so, don't play sounds.
     */
    private _isHelpPlayer: boolean = false;

    /**
     * Flag to signal walking animation should be active.
     */
    _isMoving?: boolean;

    /**
     * Flag to signal walking animation sound isPlaying.
     */
    _isMovingSound?: boolean;

    /**
     * Tiles in order that make up the crew member's path to travel.
     * Row, Column coordinates for each tile.
     */
    _path: [number, number][] = [];

    /**
     * Controls size and shape of the player
     */
    private _playerGeometry: CircleGeometry;

    /**
     * Keeps track of live projectiles, to pass along endCycle signals, and destroy calls.
     */
    private _projectiles: Projectile[] = [];

    /**
     * Radius of the circle geometry on which the texture in imprinted and also the collision radius for hit box detection.
     */
    private _radius: number = 0.75;

    /**
     * Reference to the scene, used to remove player from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The list of smoke explosions the player has fired.
     */
    private _smokeExplosions: Explosion[] = [];

    /**
     * The speed at which the player travels.
     */
    private _speed: number = 0.02;

    /**
     * The distance to and from the camera that the player should exist...its layer.
     */
    private _yPos: number;

    private mesh: Mesh;

    /**
     * Constructor for the Bandit class
     * @param scene        graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param x1           origin point x of where the player starts.
     * @param z1           origin point z of where the player starts.
     * @param x2           final point x of where the player starts.
     * @param z2           final point z of where the player starts.
     * @param dist         total distance the player must travel.
     * @param speed        speed for player instantiation.
     * @param yPos         layer level for player to appear.
     * @param fireNow      optional choice not to wait to have player start moving.
     * @param isHelpScreen lets player know it's a help screen iteration and not to play sound effects.
     * @hidden
     */
    constructor(
        scene: Scene,
        playerTexture: Texture,
        x1:number,
        z1: number,
        speed?: number,
        yPos?: number,
        isHelpScreen?: boolean) {
        index++;
        this._yPos = yPos || 0.6;
        this._speed = speed || this._speed;
        this._currentPoint = [x1, z1];
        this._isHelpPlayer = isHelpScreen;

        this._scene = scene;
		this._playerGeometry = new CircleGeometry(this._radius, 16, 16);
		const hitBoxGeometry = new CircleGeometry(this._radius / 2.5, 64, 64);
        const material: MeshBasicMaterial = new MeshBasicMaterial({
            color: 0xFFFFFF,
            opacity: 1,
            transparent: true
        });

        if (showHitBox) {
            this.mesh = new Mesh(hitBoxGeometry, material);
            this.mesh.position.set(this._currentPoint[0], 2, this._currentPoint[1]);
            this.mesh.rotation.set(-1.5708, 0, 0);
            this._scene.add(this.mesh);
        }

        [0, 1, 2].forEach((val: number) => {
            const offCoordsX = val;
            const offCoordsY = 0;
            const size = [3, 1];
            const material = makeEntityMaterial(playerTexture, offCoordsX, offCoordsY, size);
            makeEntity(
                this._animationMeshes,
                this._playerGeometry,
                material,
                val,
                [this._currentPoint[0], this._yPos, this._currentPoint[1]],
                `player-${index}-${val}`);
        });

        rotateEntity(this);
    }

    /**
     * 
     * (Re)activates the player, usually at beginning of new level.
     */
    public activate(): void {
        this._isActive = true;
    }

    /**
     * Adds player object to the three.js scene.
     */
    public addToScene(): void {
        this._animationMeshes.forEach(mesh => this._scene.add(mesh));
    }

    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    public destroy() {
        CollisionatorSingleton.remove(this);
        this._animationMeshes.forEach(mesh => this._scene.remove(mesh));
    }

    /**
     * At the end of each loop iteration, move the player a little.
     * @returns whether or not the player is done, and its points calculated.
     */
    public endCycle(dirKeys: { [key: string]: number }): boolean {
        if (this._isActive) {
            // Calculates how far to move the player when moving and walls them in by the post barrier.
            if (dirKeys.up && this._currentPoint[1] >= -3.8) {
                this._isMoving = true;
                this._currentPoint[1] -= this._speed;
            } else if (dirKeys.down && this._currentPoint[1] <= 3.8) {
                this._isMoving = true;
                this._currentPoint[1] += this._speed;
            } else {
                this._isMoving = false;
            }

            if (dirKeys.left && this._currentPoint[0] >= -3.8) {
                this._isMoving = true;
                this._currentPoint[0] -= this._speed;
            } else if (dirKeys.right && this._currentPoint[0] <= 3.8) {
                this._isMoving = true;
                this._currentPoint[0] += this._speed;
            }
            this._animationMeshes.forEach(mesh => mesh.position.set(this._currentPoint[0], this._yPos, this._currentPoint[1]));
            showHitBox && this.mesh.position.set(this._currentPoint[0], 2, this._currentPoint[1]);

            // Cycle through movement meshes to animate walking, and to rotate according to current keys pressed.
            if (this._isMoving) {
                animateEntity(this);
                this._currDirection = calculateNewEntityDirection(dirKeys.right - dirKeys.left, dirKeys.up - dirKeys.down);
                rotateEntity(this);
            }

            // Work through each projectile the player has fired.
            let tempProjectiles = [];
            for (let i = 0; i < this._projectiles.length; i++) {
                let projectile = this._projectiles[i];
                if (projectile && !projectile.endCycle()) {
                    CollisionatorSingleton.remove(projectile);
                    this._projectiles[i] = null;
                }
                projectile = this._projectiles[i];
                if (projectile) {
                    tempProjectiles.push(projectile);
                }
            }
            this._projectiles = tempProjectiles.slice();
            tempProjectiles = null;

            // Work through each smoke explosion the bandit has fired.
            let tempSmokeExplosion = [];
            for (let i = 0; i < this._smokeExplosions.length; i++) {
                let smokeExplosion = this._smokeExplosions[i];
                if (smokeExplosion && !smokeExplosion.endCycle()) {
                    CollisionatorSingleton.remove(smokeExplosion);
                    this._smokeExplosions[i] = null;
                }
                smokeExplosion = this._smokeExplosions[i];
                if (smokeExplosion) {
                    tempSmokeExplosion.push(smokeExplosion);
                }
            }
            this._smokeExplosions = tempSmokeExplosion.slice();
            tempSmokeExplosion = null;
        }
        return true;
    }

    public fire(isSecondary: boolean): void {
        let bulletPoints;
        if (isSecondary) {
            bulletPoints = calculateEntityProjectilePathSecondary(this._currDirection, this._currentPoint, this._radius);
        } else {
            bulletPoints = calculateEntityProjectilePathMain(this._currDirection, this._currentPoint, this._radius);
        }
        let targetX = bulletPoints[2];
        let targetZ = bulletPoints[3];
        const xStep = (targetX - bulletPoints[0]) * (targetX - bulletPoints[0]);
        const zStep = (targetZ - bulletPoints[1]) * (targetZ - bulletPoints[1]);
        const dist = Math.sqrt(xStep + zStep);
        this._projectiles.push(new Projectile(
            this._scene,
            bulletPoints[0],
            bulletPoints[1],
            targetX,
            targetZ,
            dist,
            new Color(0xF6C123),
            true,
            this._speed + 0.02,
            -1,
            0.00000001,
            true));
        CollisionatorSingleton.add(this._projectiles[this._projectiles.length - 1]);
        SOUNDS_CTRL.playFire();

        this._smokeExplosions.push(new Explosion(
            this._scene,
            bulletPoints[0],
            bulletPoints[1],
            {
                color: ExplosionType.Smoke,
                radius: 0.08,
                speed: 0.04,
                y: this._yPos - 0.26
            }
        ));
    }

    /**
     * Gets the viability of the object.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    public getActive(): boolean {
        return this._isActive;
    }

    /**
     * Gets the current radius of the bounding box (circle) of the collidable.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    public getCollisionRadius(): number {
        return this._radius / 2.5;
    }

    /**
     * Gets the current position of the collidable object.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    public getCurrentPosition(): number[] {
        return this._currentPoint.slice();
    }

    /**
     * Gets the name of the player.
     * @returns the name of the player.
     */
    public getName(): string {
        return this._animationMeshes[0].name;
    }

    /**
     * Called when something collides with player, which destroys it.
     * @param self         the thing to remove from collidables...and scene.
     * @param otherThing   the name of the other thing in collision (mainly for shield).
     * @returns whether or not impact means calling removeFromScene by collisionator.
     */
    public impact(self: Collidable, otherThing: string): boolean {
        if (this._isActive) {
            this._isActive = false;
            // SOUNDS_CTRL.stop
            return true;
        }
        return false;
    }

    /**
     * States it is a passive type or not. Two passive types cannot colllide with each other.
     * @returns True is passive | False is not passive
     */
    public isPassive(): boolean {
        // Becomes passive when dead.
        return !this._isActive;
    }

    /**
     * Removes player object from the 'visible' scene by sending it back to its starting location.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public removeFromScene(scene: Scene): void {
        this._animationMeshes.forEach(mesh => this._scene.remove(mesh));
        this._projectiles.forEach(projectile => projectile.destroy());
        this._smokeExplosions.forEach(smokeExplosion => smokeExplosion.destroy());
        this._projectiles.length = 0;
        CollisionatorSingleton.remove(this);
    }
}