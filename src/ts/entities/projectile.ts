import {
    CircleGeometry,
    Color,
    Geometry,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Scene,
    Vector3 } from 'three';

import { Collidable } from '../collidable';
import { Explosion } from './explosion';
import { CollisionatorSingleton, CollisionType, getCollisionType } from '../collisionator';
import { SOUNDS_CTRL } from '../controls/controllers/sounds-controller';
import { ExplosionType } from '../models/explosions';
import { ScoreCtrl } from '../controls/controllers/score-controller';
import { SlowMo_Ctrl } from '../controls/controllers/slow-mo-controller';

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
     * Holds color.
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
     * Flag to signal if the missile has been destroyed.
     * True is not destroyed. False is destroyed.
     */
    private _isActive: boolean = true;

    /**
     * Flag to signal if the missile can be considered for collisions.
     * True is collidable. False is not collidable.
     */
    private _isCollidable: boolean = true;

    /**
     * Keeps track of the x,z point where missile fired from.
     */
    private _originalStartingPoint: number[];

    /**
     * Number of points scored for destroying enemy projectile.
     */
    private _points: number = 5;

    /**
     * Controls the overall rendering of the glowing head and tail.
     */
    private _projectileObject: Object3D;

    /**
     * Reference to the scene, used to remove projectile from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The instance of scoreboard used for this level instance.
     */
    private _scoreboard: ScoreCtrl;

    /**
     * The speed at which the missile travels.
     */
    private _speed: number = 0.03;

    /**
     * The total distance from projectile origin to projectile's final point.
     */
    private _totalDistance: number;

    /**
     * The collision type of the projectile (ie. Player_Projectile or Enemy_Projectile).
     */
    private _type: CollisionType;

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
     * @param color              color of the missile.
     * @param colllidableAtBirth Enemy missiles need to be destructable before hitting target, where player's don't.
     * @param speed              optional speed modifier for missiles.
     * @param y                  optional y value for missile (for help screen demo).
     * @param waitToFire         optional wait time (instead of randomized wait time).
     * @param playerMissile      signals if this projectile was fired by the player.
     * @param scoreboard         reference to the scoreboard used to get and add points throughout play.
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
        waitToFire?: number,
        playerMissile?: boolean,
        scoreboard?: ScoreCtrl) {
        index++;
        this._scoreboard = scoreboard;
        const headY = y || 0.51;
        const tailY = (y && (y + 0.04)) || 0.55;
        this._color = color;
        this._speed = speed || this._speed;
        this._isCollidable = !!colllidableAtBirth;
        this._type = !!playerMissile ? CollisionType.Player_Projectile : CollisionType.Enemy_Projectile;
        this._scene = scene;
        this._originalStartingPoint = [x1, z1];
        this._currentPoint = [x1, z1];
        this._endingPoint = [x2, z2];
        this._totalDistance = dist;
        this._distanceTraveled = 0;
        // Calculates the first (second vertices) point.
        this._calculateNextPoint();
        // Glowing head of the missile.
        const headGeometry = new CircleGeometry(0.06, 32);
        const headMaterial = new MeshBasicMaterial({
            color: this._color,
            opacity: 1,
            transparent: true
        });
        const head = new Mesh(headGeometry, headMaterial);
        head.position.set(0, headY, 0);
        head.rotation.set(-1.5708, 0, 0);
        
        this._projectileObject = new Object3D();
        this._projectileObject.add(head);

        // Creates the missile's fiery trail.
        const startX = Number(this._currentPoint[0].toFixed(3));
        const startZ = Number(this._currentPoint[1].toFixed(3));
        const endX = Number(this._endingPoint[0].toFixed(3));
        const endZ = Number(this._endingPoint[1].toFixed(3));
        const xDir = -((endX - startX) / Math.abs(endX - startX));
        const zDir = -((endZ - startZ) / Math.abs(endZ - startZ));
        // Straight line
        let tailGeometry = new Geometry();
        tailGeometry.vertices.push(
            new Vector3(
                startX === endX ? 0 : xDir * 0.2,
                tailY,
                startZ === endZ ? 0 : zDir * 0.2),
            new Vector3(
                0,
                tailY,
                0));
        let tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
        let line = new Line(tailGeometry, tailMaterial);
        this._projectileObject.add(line);

        // Angled lines for projectiles traveling horizontally.
        if (isNaN(zDir)) {
            // First 60 degree line.
            tailGeometry = new Geometry();
            tailGeometry.vertices.push(
                new Vector3(
                    xDir * (Math.sin(1.0472) * 0.15),
                    tailY,
                    0.15),
                new Vector3(
                    0,
                    tailY,
                    0));
            tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
            line = new Line(tailGeometry, tailMaterial);
            this._projectileObject.add(line);
            
            // Second 60 degree line.
            tailGeometry = new Geometry();
            tailGeometry.vertices.push(
                new Vector3(
                    xDir * (Math.sin(1.0472) * 0.15),
                    tailY,
                    -0.15),
                new Vector3(
                    0,
                    tailY,
                    0));
            tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
            line = new Line(tailGeometry, tailMaterial);
            this._projectileObject.add(line);

        // Angled lines for projectiles traveling vertically.
        } else if (isNaN(xDir)) {
            // First 60 degree line.
            tailGeometry = new Geometry();
            tailGeometry.vertices.push(
                new Vector3(
                    0.15,
                    tailY,
                    zDir * (Math.sin(1.0472) * 0.15)),
                new Vector3(
                    0,
                    tailY,
                    0));
            tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
            line = new Line(tailGeometry, tailMaterial);
            this._projectileObject.add(line);
            
            // Second 60 degree line.
            tailGeometry = new Geometry();
            tailGeometry.vertices.push(
                new Vector3(
                    -0.15,
                    tailY,
                    zDir * (Math.sin(1.0472) * 0.15)),
                new Vector3(
                    0,
                    tailY,
                    0));
            tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
            line = new Line(tailGeometry, tailMaterial);
            this._projectileObject.add(line);
            
        // Angled lines for projectiles traveling diagonally.
        } else {
            // First 60 degree line.
            tailGeometry = new Geometry();
            tailGeometry.vertices.push(
                new Vector3(
                    xDir * (Math.sin(0.261799) * 0.1),
                    tailY,
                    zDir * 0.25),
                new Vector3(
                    0,
                    tailY,
                    0));
            tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
            line = new Line(tailGeometry, tailMaterial);
            this._projectileObject.add(line);
            
            // Second 60 degree line.
            tailGeometry = new Geometry();
            tailGeometry.vertices.push(
                new Vector3(
                    xDir * 0.25,
                    tailY,
                    zDir * (Math.sin(0.261799) * 0.1)),
                new Vector3(
                    0,
                    tailY,
                    0));
            tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
            line = new Line(tailGeometry, tailMaterial);
            this._projectileObject.add(line);
        }

        this._scene.add(this._projectileObject);

        if (this._type === CollisionType.Enemy_Projectile) {
            this._projectileObject.name = `projectile-enemy-${index}`;
            this._waitToFire = waitToFire || Math.floor((Math.random() * 900) + 1);
        }
        scene.add(this._projectileObject);
    }

    /**
     * Calculates the next point in the missile's path.
     */
    private _calculateNextPoint(): void {
        if (SlowMo_Ctrl.getSlowMo() && this._projectileObject) {
            const posB = SlowMo_Ctrl.getBubbleCenter();
            const posP = this.getCurrentPosition();
            const radB = 1;
            const radP = this.getCollisionRadius();
            const dist = Math.sqrt(
                (posB[0] - posP[0]) * (posB[0] - posP[0]) +
                (posB[1] - posP[1]) * (posB[1] - posP[1])
            );
            // Inside the time bubble, move at normal speed.
            if (radP + radB > dist) {
                this._distanceTraveled += this._speed;
            // Outside the time bubble, move at 1/8th speed.
            } else {
                this._distanceTraveled += this._speed / 8;
            }
        } else {
            this._distanceTraveled += this._speed
        }
        // (xt, yt) = ( ( (1 − t) * x0 + t * x1 ), ( (1 − t) * y0 + t * y1) )
        const t = this._distanceTraveled / this._totalDistance;
        this._currentPoint[0] = ((1 - t) * this._originalStartingPoint[0]) + (t * this._endingPoint[0]);
        this._currentPoint[1] = ((1 - t) * this._originalStartingPoint[1]) + (t * this._endingPoint[1]);
    }

    /**
     * Creates an explosion during collision and adds it to the collidables list.
     * @param isInert flag to let explosion know it isn't a 'real' explosion (hit shield).
     */
    private _createExplosion(isInert: boolean): void {
        this._explosion = new Explosion(
            this._scene,
            this._projectileObject.position.x,
            this._projectileObject.position.z,
            {
                color: isInert ? ExplosionType.Electric : ExplosionType.Fire,
                radius: 0.12,
                y: this._projectileObject.position.y + 0.26
            });
        if (!isInert) CollisionatorSingleton.add(this._explosion);
    }

    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    public destroy(): void {
        if (this._explosion) {
            CollisionatorSingleton.remove(this._explosion);
            this._scene.remove(this._explosion.getMesh());
            this._explosion = null;
        }
        this.removeFromScene(this._scene);
    }

    /**
     * At the end of each loop iteration, move the projectile a little.
     * @returns whether or not the projectile is done, and should be removed from list.
     */
    public endCycle(): boolean {
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
            this._projectileObject.position.set(this._currentPoint[0], 0, this._currentPoint[1]);

            if (this._distanceTraveled >= this._totalDistance) {
                this._createExplosion(false);
                // SOUNDS_CTRL.playFooPang();
                this.removeFromScene(this._scene);
            }
        }
        return true;
    }

    /**
     * Gets the viability of the explosive blast head.
     * @returns flag to signal non-destruction. True = not destroyed. False = destroyed.
     */
    public getActive(): boolean {
        return this._isCollidable;
    }

    /**
     * Gets the current radius of the bounding box (circle) of the collidable.
     * @returns number to represent pixel distance from object center to edge of bounding box.
     */
    public getCollisionRadius(): number {
        return this._projectileObject.scale.x * 0.06;
    }

    /**
     * Gets the current position of the explosive blast head.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    public getCurrentPosition(): number[] {
        return [this._projectileObject.position.x, this._projectileObject.position.z];
    }

    /**
     * Gets the name of the missile.
     * @returns the name of the missile.
     */
    public getName(): string {
        return this._projectileObject.name;
    }

    /**
     * Gets the type of the collidable.
     * @returns the type of the collidable.
     */
    public getType(): CollisionType {
        return this._type;
    }

    /**
     * Called when something collides with projectile blast radius, which does nothing unless it hasn't exploded yet.
     * @param self the thing to remove from collidables...and scene.
     * @param otherCollidable   the name of the other thing in collision (mainly for shield).
     * @returns whether or not impact means removing item from the scene.
     */
    public impact(self: Collidable, otherCollidable: CollisionType): boolean {
        if (this._isActive) {
            this._isActive = false;
            if (self.getType() === CollisionType.Enemy_Projectile && otherCollidable === CollisionType.Post) {
                SOUNDS_CTRL.playFooPang();
            } else {
                SOUNDS_CTRL.playExplosionSmall();
            }
            if (this._scoreboard && otherCollidable === CollisionType.Enemy_Projectile) {
                this._scoreboard.addPoints(this._points);
            }
            this._createExplosion(false);
            return true;
        }
        return false;
    }

    /**
     * States it is a passive type or not. Two passive types cannot colllide with each other.
     * @returns True is passive | False is not passive
     */
    public isPassive(): boolean {
        return false;
    }

    /**
     * Removes missile object from the 'visible' scene by removing non-explosion parts from scene.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public removeFromScene(scene: Scene): void {
        this._isCollidable = false;
        this._isActive = false;
        this._scene.remove(this._projectileObject);
    }
}