import {
    CircleGeometry,
    Color,
    DoubleSide,
    Geometry,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PlaneGeometry,
    Scene,
    Texture, 
    Vector3} from 'three';
    
import { Collidable } from "../collidable";
import { CollisionatorSingleton, CollisionType } from '../collisionator';
import { ASSETS_CTRL } from '../controls/controllers/assets-controller';
import { LifeCtrl } from '../controls/controllers/lives-controller';
import { ScoreCtrl } from '../controls/controllers/score-controller';
import { SlowMo_Ctrl } from '../controls/controllers/slow-mo-controller';
import { SOUNDS_CTRL } from '../controls/controllers/sounds-controller';
import { Entity, EntityDirection } from '../models/entity';
import { ExplosionType } from '../models/explosions';
import { StringMapToNumber } from '../models/string-map-to-number';
import { animateEntity, showCurrentEntityFrame } from '../utils/animate-entity';
import { calculateEntityProjectilePathMain, calculateEntityProjectilePathSecondary } from '../utils/calculate-entity-projectile-path';
import { calculateNewEntityDirection } from '../utils/calculate-new-entity-direction';
import { makeEntity } from '../utils/make-entity';
import { makeEntityMaterial } from '../utils/make-entity-material';
import { RAD_135_DEG_RIGHT, RAD_180_DEG_RIGHT, RAD_60_DEG_RIGHT, RAD_90_DEG_RIGHT } from '../utils/radians-x-degrees-right';
import { rotateEntity } from '../utils/rotate-entity';
import { PLAYER_COLLISION_RADIUS, PLAYER_GRAPHIC_RADIUS } from '../utils/standard-entity-radii';
import { Explosion } from './explosion';
import { Projectile } from './projectile';

let index: number = 0;

const GUN_COOLDOWN_TIME = 30;

/**
 * The options necessary to create a player character.
 * This allows progressive changes in speed and texture to be applied as needed.
 */
export interface PlayerOptions {
    /**
     * The instance of scoreboard used for this level instance.
     */
    scoreboard: ScoreCtrl;

    /**
     * The instance of lifeHandler used for this level instance.
     */
    lifeHandler: LifeCtrl;

    /**
     * Graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    scene: Scene;

    /**
     * Sprite sheet texture used to represent this level's player animation frames.
     */
    texture: Texture;

    /**
     * Origin point x of where the player starts.
     */
    x1: number;

    /**
     * Origin point z of where the player starts.
     */
    z1: number;

    /**
     * Speed for player instantiation.
     */
    speed?: number;

    /**
     * Layer level for player to appear.
     */
    yPos?: number;

    /**
     * Lets player know it's a help screen iteration and not to play sound effects.
     */
    isHelpScreen?: boolean;
}

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
     * The list of blood explosions the player has around them as they die.
     */
    private _bloodExplosions: Explosion[] = [];

    /**
     * User opted to fire while reloading. This flag ensures the reloading is stopped and the cylinder's alignment is set properly.
     */
    private _canceledMainGunReload: boolean = false;

    /**
     * User opted to fire while reloading. This flag ensures the reloading is stopped and the cylinder's alignment is set properly.
     */
    private _canceledSecondaryGunReload: boolean = false;

    /**
     * Number of frames remaining before the player's main gun can fire again.
     */
    private _cooldownMainGun: number = GUN_COOLDOWN_TIME;

    /**
     * Number of frames remaining before the player's secondary gun can fire again.
     */
    private _cooldownSecondaryGun: number = GUN_COOLDOWN_TIME;

     /**
      * Current direction crew member should be facing.
      */
    _currDirection: EntityDirection = EntityDirection.Right;

    /**
     * Keeps track of the x,z point the player is at currently.
     */
    private _currentPoint: number[];

    /**
     * The mesh that shows player's character dead.
     */
    private _deathMesh: Mesh;

    /**
     * Tracks position in dying animation sequence to know which animation to switch to next frame.
     */
    private _dyingAnimationCounter: number = 0;

    /**
     * Since left clicking on the start button also registers as firing main gun, this flag will help to distinguish on from the other.
     */
    private _gunSafetyOff: boolean = false;

    /**
     * Tracks if player is going through death animation.
     */
    private _inDeathSequence: boolean = false;

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
     * The instance of lifeHandler used for this level instance.
     */
    private _lifeHandler: LifeCtrl;

    /**
     * The graphic containing the blue meter representing cooldown period between shots for main gun.
     */
    private _mainGunRechargeMeter: Line;

    /**
     * Object containing all objects that make up the main gun's chamber and bullets graphic.
     */
    private _mainGunChamber: Object3D = new Object3D();

    /**
     * Meshes for the individual bullets within the main gun's chamber and bullets graphic.
     */
    private _mainGunChamberBullets: Mesh[] = [];

    /**
     * Tracks the points along the arc for the main gun's recharge meter.
     */
    private _gunRechargePointsMain: Vector3[];

    /**
     * Tracks the points along the arc for the secondary gun's recharge meter.
     */
    private _gunRechargePointsSecondary: Vector3[];

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
    private _radius: number = PLAYER_GRAPHIC_RADIUS;

    /**
     * Number of frames the player's main gun takes to reload one round.
     */
    private _reloadMainGun: number = 0;

    /**
     * Number of frames the player's secondary gun takes to reload one round.
     */
    private _reloadSecondaryGun: number = 0;

    /**
     * Reference to the scene, used to remove player from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The instance of scoreboard used for this level instance.
     */
    private _scoreboard: ScoreCtrl;

    /**
     * Object containing all objects that make up the secondary gun's chamber and bullets graphic.
     */
    private _secondaryGunChamber: Object3D = new Object3D();

    /**
     * Meshes for the individual bullets within the secondary gun's chamber and bullets graphic.
     */
    private _secondaryGunChamberBullets: Mesh[] = [];

    /**
     * The graphic containing the blue meter representing cooldown period between shots for secondary gun.
     */
    private _secondaryGunRechargeMeter: Line;

    /**
     * The object in which the player character's shadow (hitbox) and gun chamber are attached.
     */
    private _shadow: Object3D = new Object3D();

    /**
     * Mesh for player's shadow, which also reflects the player's hitbox area.
     */
    private _shadowMesh: Mesh;

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

    /**
     * Constructor for the Player class
     * @param options   options necessary to create this round's specific player character.
     * @hidden
     */
    constructor(options: PlayerOptions) {
        index++;
        this._scoreboard = options.scoreboard;
        this._lifeHandler = options.lifeHandler;
        this._yPos = options.yPos || 0.6;
        this._speed = options.speed || this._speed;
        this._currentPoint = [options.x1, options.z1];
        this._isHelpPlayer = options.isHelpScreen;

        this._scene = options.scene;
		this._playerGeometry = new CircleGeometry(this._radius, 16, 16);
		const shadowGeometry = new CircleGeometry(this._radius / 2.5, 64, 64);
        const material: MeshBasicMaterial = new MeshBasicMaterial({
            color: 0x333333,
            opacity: 1,
            transparent: true
        });

        this._shadowMesh = new Mesh(shadowGeometry, material);
        this._shadowMesh.position.set(this._currentPoint[0], this._yPos + 2, this._currentPoint[1]);
        this._shadowMesh.rotation.set(-1.5708, 0, 0);
        this._shadow.add(this._shadowMesh);
        this._scene.add(this._shadow);

        [0, 1, 2].forEach((val: number) => {
            const offCoordsX = val;
            const offCoordsY = 0;
            const size = [4, 1];
            const material = makeEntityMaterial(options.texture, offCoordsX, offCoordsY, size);
            makeEntity(
                this._animationMeshes,
                this._playerGeometry,
                material,
                val,
                [this._currentPoint[0], this._yPos, this._currentPoint[1]],
                `player-${index}-${val}`);
        });

        const offCoordsX = 3;
        const offCoordsY = 0;
        const size = [4, 1];
        const dMesh: Mesh[] = [ null ];
        makeEntity(
            dMesh,
            new PlaneGeometry(this._radius * 2, this._radius * 2, 16, 16),
            makeEntityMaterial(options.texture, offCoordsX, offCoordsY, size),
            0,
            [this._currentPoint[0], this._yPos, this._currentPoint[1]],
            `dead-player`);
        this._deathMesh = dMesh[0];
        this._deathMesh.visible = false;

        rotateEntity(this);

        this._gunRechargePointsSecondary = [];
        for(var i = 0; i < GUN_COOLDOWN_TIME; i++)
		{
			var x_coord = 1 * Math.cos( ((90 / GUN_COOLDOWN_TIME) * i) * (Math.PI / 180) );
			var y_coord = 1 * Math.sin( ((90 / GUN_COOLDOWN_TIME) * i) * (Math.PI / 180) );
            this._gunRechargePointsSecondary.push(new Vector3(x_coord, 3, y_coord));
		}
        this._gunRechargePointsMain = this._gunRechargePointsSecondary.slice().reverse();

		const gunCylinderGeo = new CircleGeometry(0.2, 16, 16);
        const gunCylinderMat: MeshBasicMaterial = new MeshBasicMaterial({
            color: 0xFFFFFF,
            map: ASSETS_CTRL.textures['gunCylinder'],
            side: DoubleSide,
            transparent: true
        });

        const mainGunCylinderMesh = new Mesh( gunCylinderGeo, gunCylinderMat );
        mainGunCylinderMesh.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._mainGunChamber.add(mainGunCylinderMesh);

        const secondaryGunCylinderMesh = new Mesh( gunCylinderGeo, gunCylinderMat );
        secondaryGunCylinderMesh.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._secondaryGunChamber.add(secondaryGunCylinderMesh);
        
		const bulletGeo = new CircleGeometry(0.055, 16, 16);
        const bulletMat: MeshBasicMaterial = new MeshBasicMaterial({
            color: 0xFFFFFF,
            map: ASSETS_CTRL.textures['gunCylinderBullet'],
            side: DoubleSide,
            transparent: true
        });

        let bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(0, -1, -0.115);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._mainGunChamber.add(bullet);
        this._mainGunChamberBullets.push(bullet);

        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(0.1, -1, -0.06);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._mainGunChamber.add(bullet);
        this._mainGunChamberBullets.push(bullet);

        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(0.1, -1, 0.06);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._mainGunChamber.add(bullet);
        this._mainGunChamberBullets.push(bullet);

        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(0, -1, 0.12);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._mainGunChamber.add(bullet);
        this._mainGunChamberBullets.push(bullet);

        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(-0.1, -1, 0.06);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._mainGunChamber.add(bullet);
        this._mainGunChamberBullets.push(bullet);

        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(-0.1, -1, -0.06);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._mainGunChamber.add(bullet);
        this._mainGunChamberBullets.push(bullet);


        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(0, -1, -0.115);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._secondaryGunChamber.add(bullet);
        this._secondaryGunChamberBullets.push(bullet);

        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(-0.1, -1, -0.06);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._secondaryGunChamber.add(bullet);
        this._secondaryGunChamberBullets.push(bullet);
        
        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(-0.1, -1, 0.06);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._secondaryGunChamber.add(bullet);
        this._secondaryGunChamberBullets.push(bullet);

        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(0, -1, 0.12);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._secondaryGunChamber.add(bullet);
        this._secondaryGunChamberBullets.push(bullet);

        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(0.1, -1, 0.06);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._secondaryGunChamber.add(bullet);
        this._secondaryGunChamberBullets.push(bullet);

        bullet = new Mesh( bulletGeo, bulletMat );
        bullet.position.set(0.1, -1, -0.06);
        bullet.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
        this._secondaryGunChamber.add(bullet);
        this._secondaryGunChamberBullets.push(bullet);

        this._mainGunChamber.position.set(0.5, 3, 0.5);
        this._secondaryGunChamber.position.set(-0.5, 3, 0.5);
        this._shadow.add(this._mainGunChamber);
        this._shadow.add(this._secondaryGunChamber);
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
            case CollisionType.Player_Projectile: {
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
        this._scene.add(this._deathMesh);
    }

    /**
     * Call to eliminate regardless of current state.
     * Mainly used for non-game instantiations of this (ie. help screen animations).
     */
    public destroy() {
        this.removeFromScene();
    }

    /**
     * At the end of each loop iteration, move the player a little.
     * @param dirKeys cuurently held keyboard keys for movement pressed by player.
     * @returns whether or not the player is done, and its points calculated.
     */
    public endCycle(dirKeys: StringMapToNumber): boolean {
        const coolDownBefore = this._cooldownMainGun;
        if (this._cooldownSecondaryGun > 0) {
            this._cooldownSecondaryGun--;
            this._scene.remove(this._secondaryGunRechargeMeter);
            let tailGeometry = new Geometry();
            tailGeometry.vertices.push(...this._gunRechargePointsSecondary.slice(0, this._cooldownSecondaryGun));
            let tailMaterial = new LineBasicMaterial({color: new Color(0x1F51FF)});
            this._secondaryGunRechargeMeter = new Line(tailGeometry, tailMaterial);
            this._scene.add(this._secondaryGunRechargeMeter);
            
            if (this._gunSafetyOff) {
                this._secondaryGunChamber.rotation.y += (RAD_60_DEG_RIGHT / GUN_COOLDOWN_TIME);
            }
        }

        if (this._cooldownMainGun > 0) {
            this._cooldownMainGun--;
            this._scene.remove(this._mainGunRechargeMeter);
            let tailGeometry = new Geometry();
            tailGeometry.vertices.push(...this._gunRechargePointsMain.slice(0, this._cooldownMainGun));
            let tailMaterial = new LineBasicMaterial({color: new Color(0x1F51FF)});
            this._mainGunRechargeMeter = new Line(tailGeometry, tailMaterial);
            this._scene.add(this._mainGunRechargeMeter);
            
            if (this._gunSafetyOff && !this._reloadMainGun) {
                this._mainGunChamber.rotation.y -= (RAD_60_DEG_RIGHT / GUN_COOLDOWN_TIME);
            }
        }

        if (this._reloadSecondaryGun > 0) {
            this._secondaryGunChamber.rotation.y -= (RAD_60_DEG_RIGHT / GUN_COOLDOWN_TIME);
            this._reloadSecondaryGun--;
            if (this._reloadSecondaryGun <= 0) {
                const rounds = this._secondaryGunChamberBullets.slice().reverse();
                const missingBullet = rounds.find(bullet => !bullet.visible);
                missingBullet ? missingBullet.visible = true : null;
                rounds.some(bullet => !bullet.visible) ? this._reloadSecondaryGun = GUN_COOLDOWN_TIME : null;
            }
        }

        if (this._reloadMainGun > 0) {
            this._mainGunChamber.rotation.y += (RAD_60_DEG_RIGHT / GUN_COOLDOWN_TIME);
            this._reloadMainGun--;
            if (this._reloadMainGun <= 0) {
                const rounds = this._mainGunChamberBullets.slice().reverse();
                const missingBullet = rounds.find(bullet => !bullet.visible);
                missingBullet ? missingBullet.visible = true : null;
                rounds.some(bullet => !bullet.visible) ? this._reloadMainGun = GUN_COOLDOWN_TIME : null;
            }
        }
        
        if (coolDownBefore > 0 && this._cooldownMainGun <= 0) {
            this._gunSafetyOff = true;
        }

        if (this._inDeathSequence) {
            if (this._dyingAnimationCounter < 180) {
                this._shadow.visible = false;
                this._animationMeshes.forEach(mesh => {
                    const rot: number[] = mesh.rotation.toArray();
                    mesh.rotation.set(rot[0], rot[1], rot[2] + 0.07);
                });
                this._dyingAnimationCounter++;

                if (this._bloodExplosions.length < 5 && Math.random() > 0.7) {
                    const isXNeg = Math.random() > 0.5;
                    const isZNeg = Math.random() > 0.5;
                    const x = (isXNeg ? -1 : 1) * Math.random();
                    const z = (isZNeg ? -1 : 1) * Math.random();
                    this._bloodExplosions.push(new Explosion(
                        this._scene,
                        this._currentPoint[0] + x,
                        this._currentPoint[1] + z,
                        {
                            color: ExplosionType.Blood,
                            radius: 0.12,
                            speed: 0.04,
                            y: this._yPos - 0.26
                        }
                    ));
                }

                if (this._dyingAnimationCounter % 10 === 0) {
                    const isVisible = this._animationMeshes.some(mesh => mesh.visible);
                    if (isVisible) {
                        showCurrentEntityFrame(this, true);
                    } else {
                        showCurrentEntityFrame(this);
                    }
                }

                // Work through each blood explosions around the dying player.
                this._handleChildCycleList(ExplosionType.Blood, this._bloodExplosions);
            } else if (this._dyingAnimationCounter === 180) {
                this._animationMeshes.forEach(mesh => {
                    mesh.visible = false;
                });
                this._deathMesh.position.set(this._currentPoint[0], this._yPos + 2, this._currentPoint[1]);
                this._deathMesh.rotation.set(RAD_90_DEG_RIGHT, 0, 0);
                this._deathMesh.visible = true;
                
                this._dyingAnimationCounter++;
            } else if (this._dyingAnimationCounter < 360) {
                if (this._dyingAnimationCounter % 10 === 0) {
                    this._deathMesh.visible = !this._deathMesh.visible;
                }

                // Work through each blood explosions around the dying player.
                this._handleChildCycleList(ExplosionType.Blood, this._bloodExplosions);
                
                this._dyingAnimationCounter++;
            } else {
                this._dyingAnimationCounter = 0;
                this._inDeathSequence = false;
                this._animationMeshes.forEach(mesh => mesh.position.set(0, this._yPos, 0));
                this._currentPoint = [0, 0];
                this._currDirection = EntityDirection.Right;
                this._shadow.visible = true;
                rotateEntity(this);
                this._bloodExplosions.forEach(bloodExplosion => bloodExplosion.destroy());
                this._bloodExplosions.length = 0;
                if (this._lifeHandler.getLives() <= 0) {
                    this._isActive = false;
                } else {
                    this._isActive = true;
                    this._deathMesh.visible = false;
                    showCurrentEntityFrame(this);
                    this._lifeHandler.nextLife();
                    SlowMo_Ctrl.exitSlowMo();
                }
            }

            return false;
        } else if (this._isActive) {
            // Calculates how far to move the player when moving and walls them in by the post barrier.
            if (Object.keys(dirKeys).some(key => !!dirKeys[key])) {
                this._isMoving = true;
            } else {
                this._isMoving = false;
            }

            if (dirKeys.up && this._currentPoint[1] >= -3.3) {
                this._currentPoint[1] -= this._speed;
            } else if (dirKeys.down && this._currentPoint[1] <= 3.3) {
                this._currentPoint[1] += this._speed;
            }

            if (dirKeys.left && this._currentPoint[0] >= -3.3) {
                this._currentPoint[0] -= this._speed;
            } else if (dirKeys.right && this._currentPoint[0] <= 3.3) {
                this._currentPoint[0] += this._speed;
            }
            this._animationMeshes.forEach(mesh => mesh.position.set(this._currentPoint[0], this._yPos, this._currentPoint[1]));
            this._shadow.position.set(this._currentPoint[0], this._yPos + 1, this._currentPoint[1]);
            this._mainGunRechargeMeter.position.set(this._currentPoint[0], 3, this._currentPoint[1]);
            this._secondaryGunRechargeMeter.position.set(this._currentPoint[0], 3, this._currentPoint[1]);

            // Cycle through movement meshes to animate walking, and to rotate according to current keys pressed.
            if (this._isMoving) {
                animateEntity(this);
                this._currDirection = calculateNewEntityDirection(dirKeys.right - dirKeys.left, dirKeys.up - dirKeys.down);
                rotateEntity(this);
            }
            this._secondaryGunRechargeMeter.rotation.y = this._animationMeshes[0].rotation.z;
            this._mainGunRechargeMeter.rotation.y = this._animationMeshes[0].rotation.z + RAD_90_DEG_RIGHT;
            this._shadow.rotation.y = this._animationMeshes[0].rotation.z + RAD_180_DEG_RIGHT;

            // Work through each projectile the player has fired.
            this._handleChildCycleList(CollisionType.Player_Projectile, this._projectiles);

            // Work through each smoke explosion the player has fired.
            this._handleChildCycleList(ExplosionType.Smoke, this._smokeExplosions);

            return false;
        }
        return true;
    }

    /**
     * Signals a click of the mouse to fire a projectile from one of the player's weapons.
     * @param isSecondary signals that the player should fire from the opposite direction they are facing.
     */
    public fire(isSecondary: boolean): void {
        if (!this._isActive || this._inDeathSequence) {
            return;
        }

        if (isSecondary) {
            if (this._cooldownSecondaryGun || this._reloadSecondaryGun || !this._secondaryGunChamberBullets.some(bullet => bullet.visible)) {
                return;
            }
            this._cooldownSecondaryGun = GUN_COOLDOWN_TIME;
            const nextBullet = this._secondaryGunChamberBullets.find(bullet => bullet.visible);
            if (nextBullet) {
                nextBullet.visible = false;
                SOUNDS_CTRL.playFire();
            }
        } else {
            if (this._cooldownMainGun || this._reloadMainGun || !this._mainGunChamberBullets.some(bullet => bullet.visible)) {
                return;
            }
            this._cooldownMainGun = GUN_COOLDOWN_TIME;
            const nextBullet = this._mainGunChamberBullets.find(bullet => bullet.visible);
            if (nextBullet) {
                nextBullet.visible = false;
                SOUNDS_CTRL.playFire();
            }
        }

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
        this._projectiles.push(new Projectile({
            scene: this._scene,
            x1: bulletPoints[0],
            z1: bulletPoints[1],
            x2: targetX,
            z2: targetZ,
            dist,
            color: new Color(0xF6C123),
            colllidableAtBirth: true,
            speed: this._speed + 0.02,
            y: -1,
            playerMissile: true,
            scoreboard: this._scoreboard}));
        CollisionatorSingleton.add(this._projectiles[this._projectiles.length - 1]);

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
        return PLAYER_COLLISION_RADIUS;
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
     * Gets the type of the collidable.
     * @returns the type of the collidable.
     */
    public getType(): CollisionType {
        return CollisionType.Player;
    }

    /**
     * Called when something collides with player, which destroys it.
     * @param self         the thing to remove from collidables...and scene.
     * @param otherThing   the type of the other thing in collision.
     * @returns whether or not impact means calling removeFromScene by collisionator.
     */
    public impact(self: Collidable, otherThing: CollisionType): boolean {
        this._lifeHandler.loseLife();
        this._inDeathSequence = true;
        this._projectiles.forEach(projectile => projectile.destroy());
        this._projectiles.length = 0;
        this._smokeExplosions.forEach(smoke => smoke.destroy());
        this._smokeExplosions.length = 0;
        SlowMo_Ctrl.enterSlowMo();
        // SOUNDS_CTRL.stop
        return false;
    }

    /**
     * States it is a passive type or not. Two passive types cannot colllide with each other.
     * @returns True is passive | False is not passive
     */
    public isPassive(): boolean {
        // Becomes passive when dead.
        return !this._isActive || this._inDeathSequence;
    }

    /**
     * Triggers the reload cycle for one of the player's guns.
     * @param isSecondary whether the key press to reload was for the secondary gun or not.
     */
    public reload(isSecondary: boolean): void {
        if (isSecondary && !this._cooldownSecondaryGun && !this._reloadSecondaryGun && this._secondaryGunChamberBullets.some(bullet => !bullet.visible)) {
            this._reloadSecondaryGun = GUN_COOLDOWN_TIME;
        } else if (!isSecondary && !this._cooldownMainGun && !this._reloadMainGun && this._mainGunChamberBullets.some(bullet => !bullet.visible)) {
            this._reloadMainGun = GUN_COOLDOWN_TIME;
        }
    }

    /**
     * Removes player object from the 'visible' scene by sending it back to its starting location.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public removeFromScene(): void {
        this._animationMeshes.forEach(mesh => this._scene.remove(mesh));
        this._scene.remove(this._deathMesh);
        this._projectiles.forEach(projectile => projectile.destroy());
        this._projectiles.length = 0;
        this._smokeExplosions.forEach(smokeExplosion => smokeExplosion.destroy());
        this._smokeExplosions.length = 0;
        this._bloodExplosions.forEach(bloodExplosion => bloodExplosion.destroy());
        this._bloodExplosions.length = 0;
        CollisionatorSingleton.remove(this);
        this._scene.remove(this._shadow);
        this._scene.remove(this._mainGunRechargeMeter);
        this._scene.remove(this._secondaryGunRechargeMeter);
    }
}