import {
    CircleGeometry,
    Color,
    Mesh,
    PlaneGeometry,
    Scene,
    Texture } from 'three';
    
import { Collidable } from "../collidable";
import { CollisionatorSingleton, CollisionType } from '../collisionator';
import { SOUNDS_CTRL } from '../controls/controllers/sounds-controller';
import { Entity, EntityDirection } from '../models/entity';
import { animateEntity, showCurrentEntityFrame } from '../utils/animate-entity';
import { makeEntity } from '../utils/make-entity';
import { makeEntityMaterial } from '../utils/make-entity-material';
import { Projectile } from './projectile';
import { rotateEntity } from '../utils/rotate-entity';
import { Explosion } from './explosion';
import { ExplosionType } from '../models/explosions';
import { ScoreCtrl } from '../controls/controllers/score-controller';
import { SlowMo_Ctrl } from '../controls/controllers/slow-mo-controller';
import {
    BANDIT_RADIUS,
    BANDIT_INSIDE_RADIUS,
    BANDIT_SCALE_GOAL,
    BANDIT_RADIUS_DIFF } from '../utils/standard-entity-radii';
import { RAD_90_DEG_RIGHT } from '../utils/radians-x-degrees-right';

export const banditMovePoints: [number, number, EntityDirection][] = [
    [ -5, 5, EntityDirection.Up ],      // Lower Left Corner
    [ 5, 5, EntityDirection.Left ],     // Lower Right Corner
    [ 5, -5, EntityDirection.Down ],    // Upper Right Corner
    [ -5, -5, EntityDirection.Right ]   // Upper Left Corner
];

export const banditIntMovePoints: [number, number, EntityDirection][] = [
    [ -2.5, 2.5, EntityDirection.Up ],      // Lower Left Corner
    [ 2.5, 2.5, EntityDirection.Left ],     // Lower Right Corner
    [ 2.5, -2.5, EntityDirection.Down ],    // Upper Right Corner
    [ -2.5, -2.5, EntityDirection.Right ]   // Upper Left Corner
];

export const banditStartPositions: [number, number, number][] = [
    [ -5, -5, 0 ], // Left Going down
    [ -5, -4, 0 ],
    [ -5, -3, 0 ],
    [ -5, -2, 0 ],
    [ -5, -1, 0 ],
    [ -5, 0, 0 ],
    [ -5, 1, 0 ],
    [ -5, 2, 0 ],
    [ -5, 3, 0 ],
    [ -5, 4, 0 ],

    [ -5, 5, 1 ], // Bottom Going Right
    [ -4, 5, 1 ],
    [ -3, 5, 1 ],
    [ -2, 5, 1 ],
    [ -1, 5, 1 ],
    [ 0, 5, 1 ],
    [ 1, 5, 1],
    [ 2, 5, 1],
    [ 3, 5, 1],
    [ 4, 5, 1],

    [ 5, 5, 2 ], // Right Going Up
    [ 5, 4, 2 ],
    [ 5, 3, 2 ],
    [ 5, 2, 2 ],
    [ 5, 1, 2 ],
    [ 5, 0, 2 ],
    [ 5, -1, 2 ],
    [ 5, -2, 2 ],
    [ 5, -3, 2 ],
    [ 5, -4, 2 ],

    [ 5, -5, 3 ], // Top Going Left
    [ -4, -5, 3 ],
    [ -3, -5, 3 ],
    [ -2, -5, 3 ],
    [ -1, -5, 3 ],
    [ 0, -5, 3 ],
    [ 1, -5, 3],
    [ 2, -5, 3],
    [ 3, -5, 3],
    [ 4, -5, 3],
];

export const banditIntStartPositions: [number, number, number][] = [
    [ -5, -5, 0 ], // Left Going down
    [ -5, -4, 0 ],
    [ -5, -3, 0 ],
    [ -5, -2, 0 ],
    [ -5, -1, 0 ],
    [ -5, 0, 0 ],
    [ -5, 1, 0 ],
    [ -5, 2, 0 ],
    [ -5, 3, 0 ],
    [ -5, 4, 0 ],

    [ -5, 5, 1 ], // Bottom Going Right
    [ -4, 5, 1 ],
    [ -3, 5, 1 ],
    [ -2, 5, 1 ],
    [ -1, 5, 1 ],
    [ 0, 5, 1 ],
    [ 1, 5, 1],
    [ 2, 5, 1],
    [ 3, 5, 1],
    [ 4, 5, 1],

    [ 5, 5, 2 ], // Right Going Up
    [ 5, 4, 2 ],
    [ 5, 3, 2 ],
    [ 5, 2, 2 ],
    [ 5, 1, 2 ],
    [ 5, 0, 2 ],
    [ 5, -1, 2 ],
    [ 5, -2, 2 ],
    [ 5, -3, 2 ],
    [ 5, -4, 2 ],

    [ 5, -5, 3 ], // Top Going Left
    [ -4, -5, 3 ],
    [ -3, -5, 3 ],
    [ -2, -5, 3 ],
    [ -1, -5, 3 ],
    [ 0, -5, 3 ],
    [ 1, -5, 3],
    [ 2, -5, 3],
    [ 3, -5, 3],
    [ 4, -5, 3],
];

let index: number = 0;

export class Bandit implements Collidable, Entity {
    /**
     * Tracks position in walking animation sequence to know which animation to switch to next frame.
     */
     _animationCounter: number = 0;

    /**
     * The three meshes to flip through to simulate a walking animation.
     */
     _animationMeshes: [Mesh, Mesh, Mesh] = [ null, null, null ];

     /**
      * The list of blood explosions the bandit has around them as they die.
      */
     private _bloodExplosions: Explosion[] = [];

     /**
      * Current direction crew member should be facing.
      */
    _currDirection: EntityDirection = EntityDirection.Right;

    /**
     * Controls size and shape of the bandit
     */
    private _banditGeometry: CircleGeometry;

    /**
     * Keeps track of the x,z point the bandit is at currently.
     */
    private _currentPoint: number[];

    /**
     * Keeps track of the banditMovePoint index.
     */
    private _currentWalkIndex: number;

    /**
     * The mesh that shows bandit's character dead.
     */
    private _deathMesh: Mesh;

    /**
     * Tracks the distance traveled thus far to update the calculateNextPoint calculation.
     */
    private _distanceTraveled: number;

    /**
     * Tracks position in dying animation sequence to know which animation to switch to next frame.
     */
    private _dyingAnimationCounter: number = 0;

    /**
     * Keeps track of the x,z point of bandit's destination point.
     */
    private _endingPoint: number[];

    /**
     * Flag to signal if bandit has been destroyed or not.
     * True = not destroyed. False = destroyed.
     */
    private _isActive: boolean = true;

    /**
     * Tracks if bandit is going through death animation.
     */
    private _inDeathSequence: boolean = false;

    /**
     * Optional constructor param that determines if bandit is on help screen. If so, don't play sounds.
     */
    private isHelpBandit: boolean = false;

    /**
     * Flag to signal walking animation should be active.
     */
    _isMoving?: boolean = true;

    /**
     * Flag to signal walking animation sound isPlaying.
     */
    _isMovingSound?: boolean;

    /**
     * Flag to signal running is possible if level is ready.
     */
    private _isRunCapable?: boolean = false;

    /**
     * Flag to signal running animation and speed should be active.
     */
    private _isRunning?: boolean = false;

    /**
     * The current level.
     */
    private _level: number = 1;

    /**
     * Keeps track of the x,z point where bandit fired from.
     */
    private _originalStartingPoint: number[];

    /**
     * Tiles in order that make up the crew member's path to travel.
     * Row, Column coordinates for each tile.
     */
    _path: [number, number][] = [];

    /**
     * Number of points scored for killing this bandit.
     */
    private _points: number = 50;

    /**
     * Keeps track of live projectiles, to pass along endCycle signals, and destroy calls.
     */
    private _projectiles: Projectile[] = [];

    /**
     * Radius of the circle geometry used to imprint the texture onto and also the collision radius for hit detection.
     */
    private _radius: number = BANDIT_RADIUS;

    /**
     * Reference to the scene, used to remove bandit from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The instance of scoreboard used for this level instance.
     */
    private _scoreboard: ScoreCtrl;

    /**
     * The list of smoke explosions the bandit has fired.
     */
    private _smokeExplosions: Explosion[] = [];

    /**
     * The speed at which the bandit travels.
     */
    private _speed: number = 0.008;

    /**
     * The speed at which the bandit travels when running toward the interior.
     */
    private _speedRunning: number = 0.012;

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
     * @param scoreboard    the instance of scoreboard used for this level instance.
     * @param level         current level the bandit exists on.
     * @param scene         graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param banditTexture sprite sheet texture used to represent this level's bandit animation frames.
     * @param x1            origin point x of where the bandit starts.
     * @param z1            origin point z of where the bandit starts.
     * @param walkIndex     index in walk positions array for bandits to head towards
     * @param speedMod      speed modifier at time of bandit instantiation.
     * @param yPos          layer level for bandit to appear.
     * @param fireNow       optional choice not to wait to have bandit start moving.
     * @param isHelpScreen  lets bandit know it's a help screen iteration and not to play sound effects.
     * @hidden
     */
    constructor(
        scoreboard: ScoreCtrl,
        level: number,
        scene: Scene,
        banditTexture: Texture,
        x1:number,
        z1: number,
        walkIndex: number,
        speedMod: number,
        yPos?: number,
        fireNow?: boolean,
        isHelpScreen?: boolean) {
        index++;
        this._scoreboard = scoreboard;
        this._level = level;
        this._points *= level;
        this._yPos = yPos || 0.6;
        this._speed += (speedMod / 1000);
        this._speedRunning = this._speed * 2;
        this._originalStartingPoint = [x1, z1];
        this._currentPoint = [x1, z1];
        this._currentWalkIndex = walkIndex;
        this._endingPoint = banditMovePoints[walkIndex].slice(0, 2);
        this._currDirection = banditMovePoints[walkIndex][2];
        const xDiff = this._endingPoint[0] - this._currentPoint[0];
        const zDiff = this._endingPoint[1] - this._currentPoint[1];
        this._totalDistance = Math.sqrt((xDiff * xDiff) + (zDiff * zDiff));
        this._distanceTraveled = 0;
        this.isHelpBandit = isHelpScreen;
        // Calculates the first (second vertices) point.
        this._calculateNextPoint();
        
        this._scene = scene;
		this._banditGeometry = new CircleGeometry(this._radius, 16, 16);
        const variationChoice = Math.random() < 0.5 ? 0 : 1;
        [0, 1, 2].forEach((val: number) => {
            const offCoordsX = val;
            const offCoordsY = variationChoice;
            const size = [4, 2];
            const material = makeEntityMaterial(banditTexture, offCoordsX, offCoordsY, size);
            makeEntity(
                this._animationMeshes,
                this._banditGeometry,
                material,
                val,
                [this._currentPoint[0], this._yPos, this._currentPoint[1]],
                `enemy-bandit-${index}-${val}`);
        });
        rotateEntity(this);
        this._waitToFire = (fireNow) ? 0 : Math.floor((Math.random() * 2000) + 1);

        const offCoordsX = 3;
        const offCoordsY = 0;
        const size = [4, 2];
        const dMesh: Mesh[] = [ null ];
        makeEntity(
            dMesh,
            new PlaneGeometry(this._radius * 2.2, this._radius * 2.2, 16, 16),
            makeEntityMaterial(banditTexture, offCoordsX, offCoordsY, size),
            0,
            [this._currentPoint[0], this._yPos, this._currentPoint[1]],
            `dead-bandit`);
        this._deathMesh = dMesh[0];
        this._deathMesh.visible = false;
    }

    /**
     * Calculates the next point in the bandit's path.
     */
    private _calculateNextPoint(): void {
        if (SlowMo_Ctrl.getSlowMo()) {
            this._distanceTraveled += 0.0005;
        } else {
            this._distanceTraveled += this._isRunning ? this._speedRunning : this._speed;
        }
        // (xt, yt) = ( ( (1 − t) * x0 + t * x1 ), ( (1 − t) * y0 + t * y1) )
        const t = this._distanceTraveled / this._totalDistance;
        this._currentPoint[0] = ((1 - t) * this._originalStartingPoint[0]) + (t * this._endingPoint[0]);
        this._currentPoint[1] = ((1 - t) * this._originalStartingPoint[1]) + (t * this._endingPoint[1]);
        if (this._distanceTraveled >= this._totalDistance - this._speed) {
            this._distanceTraveled = 0;
            this._currentPoint[0] = this._endingPoint[0];
            this._currentPoint[1] = this._endingPoint[1];
            this._originalStartingPoint[0] = this._endingPoint[0];
            this._originalStartingPoint[1] = this._endingPoint[1];

            if (!this._isRunning) {
                this._isRunCapable = true;
                this._currentWalkIndex = this._currentWalkIndex + 1 >= banditMovePoints.length ? 0 : this._currentWalkIndex + 1;
                this._endingPoint = banditMovePoints[this._currentWalkIndex].slice(0, 2);
                this._currDirection = banditMovePoints[this._currentWalkIndex][2];
            } else {
                this._isRunCapable = false;
                this._currentWalkIndex = this._currentWalkIndex + 1 >= banditIntMovePoints.length ? 0 : this._currentWalkIndex + 1;
                this._endingPoint = banditIntMovePoints[this._currentWalkIndex].slice(0, 2);
                this._currDirection = banditIntMovePoints[this._currentWalkIndex][2];
            }

            const xDiff = this._endingPoint[0] - this._currentPoint[0];
            const zDiff = this._endingPoint[1] - this._currentPoint[1];
            this._totalDistance = Math.sqrt((xDiff * xDiff) + (zDiff * zDiff));
            rotateEntity(this);
            return;
        } else if (this._isRunning && this._radius < BANDIT_INSIDE_RADIUS) {
            const scaleGoal = BANDIT_SCALE_GOAL;
            const steps = (this._totalDistance / this._speedRunning);
            let scaleIncrease = (scaleGoal - 1) / steps;
            
            const currScale = this._animationMeshes[0].scale;
            if (currScale.x + scaleIncrease < scaleGoal) {
                this._animationMeshes.forEach(mesh => mesh.scale.set(currScale.x + scaleIncrease, currScale.y + scaleIncrease, currScale.z + scaleIncrease));
                this._deathMesh.scale.set(currScale.x + scaleIncrease, currScale.y + scaleIncrease, currScale.z + scaleIncrease)
                this._radius += BANDIT_RADIUS_DIFF / steps;
            } else {
                this._animationMeshes.forEach(mesh => mesh.scale.set(scaleGoal, scaleGoal, scaleGoal));
                this._deathMesh.scale.set(scaleGoal + 0.1, scaleGoal + 0.1, scaleGoal + 0.1);
                this._radius = BANDIT_INSIDE_RADIUS;
            }
        }
        this._isRunCapable = false;
    }

    /**
     * Incrementally animates each item in the list.
     * @param explosionsList either the list of smoke explosions or blood splatters.
     */
    private _handleChildCycleList(itemType: (ExplosionType | CollisionType), items: (Explosion[] | Projectile[])): void {
        // Work through each blood explosions around the dying player.
        let temp = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item && !item.endCycle()) {
                CollisionatorSingleton.remove(item);
                items[i] = null;
            }
            item = items[i];
            if (item) {
                temp.push(item);
            }
        }

        switch (itemType) {
            case ExplosionType.Smoke: {
                this._smokeExplosions = temp.slice() as Explosion[];
                break;
            }
            case ExplosionType.Blood: {
                this._bloodExplosions = temp.slice() as Explosion[];
                break;
            }
            case CollisionType.Enemy_Projectile: {
                this._projectiles = temp.slice() as Projectile[];
                break;
            }
            default: {
                return;
            }
        }

        temp = null;
    }

    /**
     * Adds bandit object to the three.js scene.
     */
    public addToScene(): void {
        this._animationMeshes.forEach(mesh => this._scene.add(mesh));
        this._scene.add(this._deathMesh);
    }

    /**
     * (Re)activates the bandit, usually at beginning of new level.
     */
    public activate(): void {
        // If bandit was never destroyed (game over), let him "wait" on his own loop.
        if (!this._isActive) {
            this._waitToFire = Math.floor((Math.random() * 2000) + 1);
        }
        this._isActive = true;
    }

    /**
     * Tells the bandits in the corners to make their way to the interior.
     * @returns true if this bandit was capable of running and false if not.
     */
    public activateRunning(): boolean {
        if (this._isRunCapable && !this._isRunning) {
            this._isRunCapable = false;
            this._isRunning = true;

            this._currentWalkIndex = this._currentWalkIndex - 1 < 0 ? banditIntMovePoints.length - 1 : this._currentWalkIndex - 1;
            this._endingPoint = banditIntMovePoints[this._currentWalkIndex].slice(0, 2);
            this._currDirection = banditIntMovePoints[this._currentWalkIndex][2];
            const xDiff = this._endingPoint[0] - this._currentPoint[0];
            const zDiff = this._endingPoint[1] - this._currentPoint[1];
            this._totalDistance = Math.sqrt((xDiff * xDiff) + (zDiff * zDiff));
            return true;
        }
        return false;
    }

    /**
     * The level manager chose not to have bandits race to the interior.
     */
    public cancelRunCapable(): void {
        this._isRunCapable = false;
    }

    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    public destroy(): void {
        CollisionatorSingleton.remove(this);
        this._animationMeshes.forEach(mesh => this._scene.remove(mesh));
        this._scene.remove(this._deathMesh);
    }

    /**
     * At the end of each loop iteration, move the bandit a little.
     * @param isPlayerDying signal that player death animation is ongoing and all bandit projectiles should be destroyed.
     * @returns whether or not the bandit is done, and its points calculated.
     */
    public endCycle(isPlayerDying?: boolean): boolean {
        // If player has already been hit, destroy all bullets and related graphics until they start again.
        if (isPlayerDying) {
            this._projectiles.forEach(projectile => projectile.destroy());
            this._projectiles.length = 0;
            this._smokeExplosions.forEach(smoke => smoke.destroy());
            this._smokeExplosions.length = 0;
            return this._isActive;
        }

        if (this._waitToFire >= 1) {
            this._waitToFire--;
            if (!this._waitToFire && !this.isHelpBandit) {
                SOUNDS_CTRL.playFooPang();
            }
            return this._isActive;
        }

        if (this._inDeathSequence) {
            if (!this._dyingAnimationCounter) {
                console.log('= 0');

                this._animationMeshes.forEach(mesh => {
                    mesh.visible = false;
                });
                this._deathMesh.position.set(this._currentPoint[0], this._yPos + 2, this._currentPoint[1]);
                this._deathMesh.visible = true;
                this._dyingAnimationCounter++;
            } else if (this._dyingAnimationCounter < 360) {
                console.log('< 360');

                if (this._bloodExplosions.length < 5 && Math.random() > 0.7) {
                    const isXNeg = Math.random() > 0.5;
                    const isZNeg = Math.random() > 0.5;
                    const bloodMaxDistance = this._isRunning ? 0.8 : 0.5;
                    const x = (isXNeg ? -bloodMaxDistance : bloodMaxDistance) * Math.random();
                    const z = (isZNeg ? -bloodMaxDistance : bloodMaxDistance) * Math.random();
                    this._bloodExplosions.push(new Explosion(
                        this._scene,
                        this._currentPoint[0] + x,
                        this._currentPoint[1] + z,
                        {
                            color: ExplosionType.Blood,
                            radius: this._isRunning ? 0.1 : 0.05,
                            speed: 0.04,
                            y: this._yPos - 0.26
                        }
                    ));
                }
                if (this._dyingAnimationCounter % 10 === 0) {
                    this._deathMesh.visible = !this._deathMesh.visible;
                }

                // Work through each blood explosions around the dying player.
                this._handleChildCycleList(ExplosionType.Blood, this._bloodExplosions);
                
                this._dyingAnimationCounter++;
            } else {
                console.log('End');
                this._dyingAnimationCounter = 0;
                this._inDeathSequence = false;
                this._animationMeshes.forEach(mesh => mesh.position.set(0, this._yPos, 0));
                this._currentPoint = [0, 0];
                this._currDirection = EntityDirection.Right;
                rotateEntity(this);
                this._bloodExplosions.forEach(bloodExplosion => bloodExplosion.destroy());
                this._bloodExplosions.length = 0;
                this._deathMesh.visible = false;
                this._isActive = false;
            }
        } else if (this._isActive) {
            // Cycle through movement meshes to animate walking, and to rotate according to current keys pressed.
            if (this._isMoving) {
                animateEntity(this);
                this._calculateNextPoint();
                this._animationMeshes.forEach(mesh => mesh.position.set(this._currentPoint[0], this._yPos, this._currentPoint[1]));
            }

            if (Math.random() <= (0.0008 + (0.0001 * this._level)) && this._projectiles.length < Math.ceil(this._level / 2)) {
                let x1 = this._currentPoint[0];
                let z1 = this._currentPoint[1];
                let x2;
                let z2;
                const dist = (Math.floor(Math.random() * (10 - 6) + 6));
                let skip = true;
                switch(this._currDirection) {
                    case EntityDirection.Right: {
                        if (this._currentPoint[0] < -3.8 || this._currentPoint[0] > 3.8) break;
                        z1 = this._currentPoint[1] + this._radius;
                        z2 = this._currentPoint[1] + dist;
                        x1 = this._currentPoint[0] - 0.02;
                        x2 = this._currentPoint[0] - 0.02;
                        skip = false;
                        break;
                    }
                    case EntityDirection.Up: {
                        if (this._currentPoint[1] < -3.8 || this._currentPoint[1] > 3.8) break;
                        z1 = this._currentPoint[1] + 0.02;
                        z2 = this._currentPoint[1] + 0.02;
                        x1 = this._currentPoint[0] + this._radius;
                        x2 = this._currentPoint[0] + dist;;
                        skip = false;
                        break;
                    }
                    case EntityDirection.Left: {
                        if (this._currentPoint[0] < -3.8 || this._currentPoint[0] > 3.8) break;
                        z1 = this._currentPoint[1] - this._radius;
                        z2 = this._currentPoint[1] - dist;
                        x1 = this._currentPoint[0] + 0.02;
                        x2 = this._currentPoint[0] + 0.02;
                        skip = false;
                        break;
                    }
                    case EntityDirection.Down: {
                        if (this._currentPoint[1] < -3.8 || this._currentPoint[1] > 3.8) break;
                        z1 = this._currentPoint[1] - 0.02;
                        z2 = this._currentPoint[1] - 0.02;
                        x1 = this._currentPoint[0] - this._radius;
                        x2 = this._currentPoint[0] - dist;;
                        skip = false;
                        break;
                    }
                }
                if (!skip) {
                    const miss = new Projectile(
                        this._scene,
                        x1, z1,
                        x2, z2,
                        dist,
                        new Color('#FF0000'),
                        true, 0.0075 + (0.0005 * this._level), this._yPos, 0.0000001, false);
                    this._projectiles.push(miss);
                    CollisionatorSingleton.add(miss);

                    this._smokeExplosions.push(new Explosion(
                        this._scene,
                        x1, z1,
                        {
                            color: ExplosionType.Smoke,
                            radius: 0.08,
                            y: this._yPos - 0.26
                        }
                    ));
                }
            }

            // Work through each projectile the bandit has fired.
            this._handleChildCycleList(CollisionType.Enemy_Projectile, this._projectiles);

            // Work through each smoke explosion the bandit has fired.
            this._handleChildCycleList(ExplosionType.Smoke, this._smokeExplosions);

            // Move the smoke explosions with the bandit.
            for (let i = 0; i < this._smokeExplosions.length; i++) {
                const smokeExplosion = this._smokeExplosions[i];
                if (smokeExplosion) {
                    let x1 = this._currentPoint[0];
                    let z1 = this._currentPoint[1];
                    switch(this._currDirection) {
                        case EntityDirection.Right: {
                            z1 = this._currentPoint[1] + this._radius;
                            x1 = this._currentPoint[0] - 0.02;
                            break;
                        }
                        case EntityDirection.Up: {
                            z1 = this._currentPoint[1] + 0.02;
                            x1 = this._currentPoint[0] + this._radius;
                            break;
                        }
                        case EntityDirection.Left: {
                            z1 = this._currentPoint[1] - this._radius;
                            x1 = this._currentPoint[0] + 0.02;
                            break;
                        }
                        case EntityDirection.Down: {
                            z1 = this._currentPoint[1] - 0.02;
                            x1 = this._currentPoint[0] - this._radius;
                            break;
                        }
                    }
                    smokeExplosion.getMesh().position.set(x1, this._yPos - 0.26, z1);
                }
            }
        }
        return this._isActive;
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
        return this._radius;
    }

    /**
     * Gets the current position of the collidable object.
     * @returns the array is of length 2 with x coordinate being first, and then z coordinate.
     */
    public getCurrentPosition(): number[] {
        return [this._currentPoint[0], this._currentPoint[1]];
    }

    /**
     * Gets the name of the bandit.
     * @returns the name of the bandit.
     */
    public getName(): string {
        return this._animationMeshes[0].name;
    }

    /**
     * Gets the points awarded for killing the bandit.
     * @returns the points awarded for killing the bandit.
     */
    public getPoints(): number {
        return this._points;
    }

    /**
     * Communicates whether this bandit can run to the interior.
     * @returns True if this bandit is in a position to run toward the interior.
     */
    public getRunCapability(): boolean {
        return this._isRunCapable;
    }

    /**
     * Communicates whether this bandit can run to the interior.
     * @returns True if this bandit is in a position to run toward the interior.
     */
    public getRunning(): boolean {
        return this._isRunning;
    }

    /**
     * Gets the type of the collidable.
     * @returns the type of the collidable.
     */
    public getType(): CollisionType {
        return CollisionType.Enemy;
    }

    /**
     * Called when something collides with bandit, which destroys it.
     * @param self         the thing to remove from collidables...and scene.
     * @param otherThing   the type of the other thing in collision.
     * @returns whether or not impact means calling removeFromScene by collisionator.
     */
    public impact(self: Collidable, otherThing: CollisionType): boolean {
        if (this._isActive && otherThing !== CollisionType.Player && !this._inDeathSequence) {
            this._inDeathSequence = true;
            // SOUNDS_CTRL.enemyDies()
            this._scoreboard.addPoints(this._points);
            this._smokeExplosions.forEach(smokeExplosion => smokeExplosion.destroy());
            this._smokeExplosions.length = 0;
        }
        return false;
    }

    /**
     * States it is a passive type or not. Two passive types cannot colllide with each other.
     * @returns True is passive | False is not passive
     */
    public isPassive(): boolean {
        return false || this._inDeathSequence;
    }

    /**
     * Removes bandit object from the 'visible' scene by sending it back to its starting location.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public removeFromScene(scene: Scene): void {
        this._animationMeshes.forEach(mesh => this._scene.remove(mesh));
        this._scene.remove(this._deathMesh);
        this._projectiles.forEach(projectile => projectile.destroy());
        this._smokeExplosions.forEach(smokeExplosion => smokeExplosion.destroy());
        this._projectiles.length = 0;
        CollisionatorSingleton.remove(this);
    }
}