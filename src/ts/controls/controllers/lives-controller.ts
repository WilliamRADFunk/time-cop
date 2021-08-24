import {
    PlaneGeometry,
    Mesh,
    MeshBasicMaterial,
    Scene } from 'three';
import { RAD_90_DEG_RIGHT } from '../../utils/radians-x-degrees-right';
import { ASSETS_CTRL } from './assets-controller';

/**
 * @class
 * Keeps track of all things score related.
 */
export class LifeCtrl {
    /**
     * Keeps track of lives (bullet) material.
     */
    private _material: MeshBasicMaterial;

    /**
     * Keeps track of player's current number of remaining lives.
     */
    private _currentLives: number = 3;

    /**
     * Reference to the scene, used to remove text in order to change it.
     */
    private _scene: Scene;

    /**
     * Controls size and shape of the score
     */
    private _livesGeometry: PlaneGeometry;

    /**
     * A better way to iterate through the digit meshes.
     */
    private _lives: Mesh[] = [];

    /**
     * Constructor for the ScoreHandler class
     * @param scene         graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param level         level the player is currently on.
     * @hidden
     */
    constructor(scene: Scene, level: number, lives?: number) {
        this._scene = scene;
        this._currentLives = !!lives ? lives : 3;
        this._material = new MeshBasicMaterial({
            color: 0xFFFFFF,
            map: ASSETS_CTRL.textures.bulletLife,
            transparent: true
        });

        for (let i = 0; i < 5; i++) {
            this._livesGeometry = new PlaneGeometry(0.25, 0.5, 32, 32);
            this._lives[i] = new Mesh( this._livesGeometry, this._material );
            this._lives[i].position.set(-4.25 + (i * 0.5), 1, -5.7);
            this._lives[i].rotation.set(RAD_90_DEG_RIGHT, 0, 0);
            this._lives[i].name = `bullet-life-${i}`;
            this._lives[i].visible = i < this._currentLives ? true : false;

            this._scene.add(this._lives[i]);
        }
    }

    private _refreshBulletCount(): void {
        for (let i = 0; i < this._lives.length; i++) {
            this._lives[i].visible = i < this._currentLives ? true : false;
        }
    }

    /**
     * Adds a new life symbol.
     */
    public addLife(): void {
        if (this._currentLives >= 5) {
            return;
        }
        this._currentLives++;
        this._refreshBulletCount();
    }

    /**
     * At the end of each loop iteration, life symbols hide or show depending on input.
     * @param hide hide the life symbols if in certain modes.
     */
    public endCycle(hide?: boolean): void {
        if (hide) {
            this._lives.forEach(life => life.visible = false);
        } else if (this._lives[0].visible) {
            this._refreshBulletCount();
        }
    }

    /**
     * Passes current number of remaining lives value back to caller.
     * @returns the current number of remaining lives at time of function call.
     */
    public getLives(): number {
        return this._currentLives;
    }

    /**
     * Removes a new life symbol.
     * @returns TRUE if player still has lives. FALSE is that was the last of the player's lives.
     */
    public loseLife(): boolean {
        this._currentLives--;
        this._refreshBulletCount();
        if (this._currentLives > 0) {
            return true;
        }
    }
}