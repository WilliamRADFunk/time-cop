import {
    Color,
    Mesh, 
    MeshPhongMaterial,
    Object3D,
    OrthographicCamera,
    PlaneGeometry,
    Scene } from 'three';

import { CollisionatorSingleton } from '../../collisionator';
import { SOUNDS_CTRL } from '../../controls/controllers/sounds-controller';
import { Actor } from '../../models/actor';
import { SceneType } from '../../models/scene-type';
import { getIntersections } from '../../utils/get-intersections';
import { ButtonBase } from '../../controls/buttons/button-base';
import { StartButton } from '../../controls/buttons/start-button';
import { BUTTON_COLORS } from '../../styles/button-colors';
import { ControlPanel } from '../../controls/panels/control-panel';
import { HelpCtrl } from './controllers/help-controller';
import { TextBase } from '../../controls/text/text-base';
import { SettingsCtrl } from '../../controls/controllers/settings-controllers';
import { ASSETS_CTRL } from '../../controls/controllers/assets-controller';
import { createActor } from '../../utils/create-actor';
import { Post } from '../../entities/post';
import { Bandit } from '../../entities/bandit';
import { Projectile } from '../../entities/projectile';
import { Player } from '../../entities/player';

/*
 * Grid Values
 * 00: Empty space/sky. Null values
 * 01: Escape Zone. Contact means exit
 * 02: Escape Zone Line. Ship Bottom must be above.
 * 03: Water or ice
 * 04: Mined Block.
 * 05: Ore type
 * 06: Common Rock
 * 07: Danger square: lava, acid, explosive gas, etc.
 * 08: Life (plants mostly)
 */

/**
 * Border value used for dev mode to see outline around text content (for positioning and sizing).
 */
const border: string = '1px solid #FFF';
// const border: string = 'none';

/**
 * The game state mode enum for this scene.
 */
export enum MainLevelState {
    'active' = 0,
    'dead' = 1,
    'paused' = 2,
    'newGame' = 3,
    'tutorial' = 4,
    'settings' = 5,
    'autopilot' = 6,
    'win' = 7
}

const banditStartPositions: [number, number][] = [
    [ -5, -5 ], [ 5, -5 ],
    [ -5, -4 ], [ 5, -4 ],
    [ -5, -3 ], [ 5, -3 ],
    [ -5, -2 ], [ 5, -2 ],
    [ -5, -1 ], [ 5, -1 ],
    [ -5, 0 ], [ 5, 0 ],
    [ -5, 1 ], [ 5, 1 ],
    [ -5, 2 ], [ 5, 2 ],
    [ -5, 3 ], [ 5, 3 ],
    [ -5, 4 ], [ 5, 4 ],
    [ -5, 5 ], [ 5, 5 ],

    [ -4, -5 ], [ 4, -5],
    [ -3, -5 ], [ 3, -5],
    [ -2, -5 ], [ 2, -5],
    [ -1, -5 ], [ 1, -5],
    [ 0, -5 ],
    [ -4, 5 ], [ 4, 5],
    [ -3, 5 ], [ 3, 5],
    [ -2, 5 ], [ 2, 5],
    [ -1, 5 ], [ 1, 5],
    [ 0, 5 ],
];

const postPositions: [number, number][] = [
    [ -4, -4 ], [ 4, -4 ],
    [ -4, -3.5 ], [ 4, -3.5 ],
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
    [ -4, 3.5 ], [ 4, 3.5 ],
    [ -4, 4 ], [ 4, 4 ],

    [ -3.5, 4 ], [ 3.5, 4 ],
    [ -3, 4 ], [ 3, 4 ],
    [ -2.5, 4 ], [ 2.5, 4 ],
    [ -2, 4 ], [ 2, 4 ],
    [ -1, 4 ], [ 1, 4 ],
    [ -1.5, 4 ], [ 1.5, 4 ],
    [ 0.5, 4 ],
    [ 0, 4 ],
    [ -0.5, 4 ],
    [ -3.5, -4 ], [ 3.5, -4 ],
    [ -3, -4 ], [ 3, -4 ],
    [ -2.5, -4 ], [ 2.5, -4 ],
    [ -2, -4 ], [ 2, -4 ],
    [ -1.5, -4 ], [ 1.5, -4 ],
    [ -1, -4 ], [ 1, -4 ],
    [ -0.5, -4 ],
    [ 0, -4 ],
    [ 0.5, -4 ]
];

/**
 * @class
 * Screen dedicated to landing the lander on planetary surface to mine.
 */
export class MainPlayLevel {
    /**
     * List of actors in the scene.
     */
    private _actors: { [key: string]: Actor[] };

    /**
     * List of bandits in the scene.
     */
    private _bandits: Bandit[] = [];

    /**
     * List of buttons
     */
    private _buttons: { [key: string]: ButtonBase } = {
        startButton: null
    };

    /**
     * Reference to the ThreeJS camera through which the scene is visible.
     */
    private _camera: OrthographicCamera;

    /**
     * Reference to the main Control Panel.
     */
    private _controlPanel: ControlPanel;

    private _counters = {
        demoWalk: 0,
        demoWalkClear: 120,
        jobs: 0
    };

    /**
     * Direction player is aiming.
     */
    private _directionAim: number[] = [0, 0]; 

    /**
     * Direction player is moving.
     */
    private _directionMove: number[] = [0, 0];

    private _dirKeys: { [key: string]: number } = {
        down: 0,
        left: 0,
        right: 0,
        up: 0
    };

    /**
     * Reference to the Help Controller.
     */
    private _helpCtrl: HelpCtrl;

    /**
     * Reference to _onWindowResize so that it can be removed later.
     */
    private _listenerRef: () => void;

    private _player: Player;

    /**
     * Keeps track of live projectiles, to pass along endCycle signals, and destroy calls.
     */
    private _projectiles: Projectile[] = [];

    /**
     * The list of collidable post objects in the level.
     */
    private _posts: Post[] = [];

    /**
     * Reference to the scene, used to remove elements from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * Reference to this scene's settings controller.
     */
    private _settingsCtrl: SettingsCtrl;

    /**
     * Tracks current game state mode.
     */
    private _state: MainLevelState = MainLevelState.newGame;

    /**
     * Text and button objects that were visible before player entered help or settings mode.
     */
    private _stateStoredObjects: (ButtonBase | TextBase)[] = [];

    /**
     * All the terrain and sky meshes that con't be interacted with, rolled into one Object3D for performace.
     */
    private _staticMeshes: Object3D = new Object3D();

    /**
     * Constructor for the Land and Mine (Scene) class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param level current level being played.
     * @param lives remaining lives left to player.
     * @param score current score player has accumulated.
     */
    constructor(
        scene: SceneType,
        level: number,
        lives: number,
        score: number) {

        this._camera = scene.camera as OrthographicCamera;
        this._scene = scene.scene;

        // Text, Button, and Event Listeners
        this._onInitialize(scene);
        this._listenerRef = this._onWindowResize.bind(this);
        window.addEventListener('resize', this._listenerRef, false);

        this._player = new Player(
            this._scene,
            ASSETS_CTRL.textures.sheriff,
            0, 0,
            0,
            1,
            false);
        this._player.addToScene();

        for (let x = 0; x < postPositions.length; x++) {
            const postPos = postPositions[x];
            const post = new Post(this._scene, postPos[0], postPos[1], 1);
            this._posts.push(post);
            CollisionatorSingleton.add(post);
        }

        for (let y = 0; y < banditStartPositions.length; y++) {
            const banditNormalPathPoints = [
    
            ];
            const startPos = banditStartPositions[y];
            const bandit = new Bandit(
                this._scene,
                [ASSETS_CTRL.textures.astronaut1],
                startPos[0], startPos[1], startPos[0], startPos[1],
                0,
                0.05,
                1,
                true,
                false);
            bandit.addToScene();
            CollisionatorSingleton.add(bandit);
            this._bandits.push(bandit);
        }
        

        this._helpCtrl = new HelpCtrl(
            this._scene,
            border);
        
        this._settingsCtrl = new SettingsCtrl(
            this._scene,
            border);
    }

    /**
     * Makes all existing buttons unclickable.
     */
    private _disableAllButtons(): void {
        Object.keys(this._buttons)
            .filter(key => !!this._buttons[key])
            .forEach(key => this._buttons[key].disable());
    }

    /**
     * Makes all existing buttons clickable.
     */
    private _enableAllButtons(): void {
        Object.keys(this._buttons)
            .filter(key => !!this._buttons[key])
            .forEach(key => this._buttons[key].enable());
    }

    /**
     * Creates all of the html elements for the first time on scene creation.
     */
    private _onInitialize(sceneType: SceneType): void {
        // DOM Events
        const container = document.getElementById('mainview');
        document.oncontextmenu = event => {
            event.preventDefault();
            if (this._state === MainLevelState.active && this._directionAim.find(val => !!val)) {
                this._player.fire(true);
            }
            return false;
        };
        document.onclick = event => {
            event.preventDefault();
            if (this._state === MainLevelState.active && this._directionAim.find(val => !!val)) {
                this._player.fire(false);
            }
            // Three JS object intersections.
            getIntersections(event, container, sceneType).forEach(el => {

            });
        };
        document.onmousemove = event => {

        };
        document.onkeydown = event => {
            if (this._state === MainLevelState.active) {
                const key = (event.key || '').toLowerCase();
                // Up & Down move and aim adjustment.
                if (key === 'w' || key === 'arrowup') {
                    // Move towards up
                    this._dirKeys.up = 1;
                    this._dirKeys.down = 0;
                    // Aim towards up
                    this._directionAim[1] = 1;
                } else if (key === 's' || key === 'arrowdown') {
                    // Move towards down
                    this._dirKeys.down = 1;
                    this._dirKeys.up = 0;
                    // Aim towards up
                    this._directionAim[1] = -1;
                }
                
                if (key === 'a' || key === 'arrowleft') {
                    // Move towards left
                    this._dirKeys.left = 1;
                    this._dirKeys.right = 0;
                    // Aim towards left
                    this._directionAim[0] = -1;
                } else if (key === 'd' || key === 'arrowright') {
                    // Move towards right
                    this._dirKeys.right = 1;
                    this._dirKeys.left = 0;
                    // Aim towards right
                    this._directionAim[0] = 1;
                }
            }
        };
        document.onkeyup = event => {
            if (this._state === MainLevelState.active) {
                const key = (event.key || '').toLowerCase();
                // Up & Down move and aim adjustment.
                if (key === 'w' || key === 'arrowup') {
                    // Cancel move towards vertical.
                    this._dirKeys.up = 0;
                }
                
                if (key === 's' || key === 'arrowdown') {
                    // Cancel move towards vertical.
                    this._dirKeys.down = 0;
                }
                
                if (key === 'a' || key === 'arrowleft') {
                    // Cancel move towards horizontal
                    this._dirKeys.left = 0;
                }
                
                if (key === 'd' || key === 'arrowright') {
                    // Cancel move towards horizontal
                    this._dirKeys.right = 0;
                }
            }
        };

        // Get window dimmensions
        let width = window.innerWidth * 0.99;
        let height = window.innerHeight * 0.99;
        width < height ? height = width : width = height;
        const left = (((window.innerWidth * 0.99) - width) / 2);

        const exitHelp = (prevState: MainLevelState) => {
            this._staticMeshes.visible = true;
            this._enableAllButtons();
            this._helpCtrl.hide();
            this._stateStoredObjects.forEach(obj => obj && obj.show());
            this._stateStoredObjects.length = 0;
            this._state = prevState;
        };

        const exitSettings = (prevState: MainLevelState) => {
            this._settingsCtrl.hide();

            this._staticMeshes.visible = true;
            this._enableAllButtons();
            this._stateStoredObjects.forEach(obj => obj && obj.show());
            this._stateStoredObjects.length = 0;
            this._state = prevState;
        };

        const help = () => {
            this._staticMeshes.visible = false;
            this._disableAllButtons();
            const prevState = this._state;
            this._state = MainLevelState.tutorial;
            this._helpCtrl.show();
            Object.values(this._buttons).filter(x => !!x).forEach(button => {
                if (button.isVisible()) {
                    this._stateStoredObjects.push(button);
                    button.hide();
                }
            });
            this._camera.position.set(0, this._camera.position.y, 0);
            this._camera.zoom = 1;
            this._camera.updateProjectionMatrix();
            return prevState;
        };

        const pause = () => {
            this._disableAllButtons();
            const prevState = this._state;
            this._state = MainLevelState.paused;
            return prevState;
        };

        const play = (prevState: MainLevelState) => {
            this._enableAllButtons();
            this._state = prevState;
        };

        const settings = () => {
            this._settingsCtrl.show();

            this._staticMeshes.visible = false;
            this._disableAllButtons();
            const prevState = this._state;
            this._state = MainLevelState.settings;
            Object.values(this._buttons).filter(x => !!x).forEach(button => {
                if (button.isVisible()) {
                    this._stateStoredObjects.push(button);
                    button.hide();
                }
            });
            this._camera.position.set(0, this._camera.position.y, 0);
            this._camera.zoom = 1;
            this._camera.updateProjectionMatrix();
            return prevState;
        };

        this._controlPanel = new ControlPanel(
            { height, left: left, top: null, width },
            { exitHelp, exitSettings, help, pause, play, settings },
            true);



        let onClick = () => {
            if (this._state === MainLevelState.newGame) {
                this._state = MainLevelState.active;
                this._buttons.startButton.hide();
                // SOUNDS_CTRL.playBackgroundMusicScifi01();
            }
        };

        this._buttons.startButton = new StartButton(
            { left: left + (0.425 * width), height, top: height - (0.75 * height), width },
            BUTTON_COLORS,
            onClick,
            true,
            0.75);
    }

    /**
     * When the browser window changes in size, all html elements are updated in kind.
     */
    private _onWindowResize(): void {
        // Get new window dimmensions
        let width = window.innerWidth * 0.99;
        let height = window.innerHeight * 0.99;
        width < height ? height = width : width = height;
        const left = (((window.innerWidth * 0.99) - width) / 2);

        this._controlPanel.resize({ height, left: left, top: null, width });
        this._settingsCtrl.onWindowResize(height, left, null, width);
        Object.keys(this._buttons)
            .filter(key => !!this._buttons[key])
            .forEach(key => this._buttons[key].resize({ left: left + (0.425 * width), height, top: height - (0.75 * height), width }));
        this._helpCtrl.onWindowResize(height, left, null, width);
    }

    /**
     * Removes any attached DOM elements, event listeners, or anything separate from ThreeJS
     */
    public dispose(): void {
        document.onmousemove = () => {};
        document.onclick = () => {};
        document.oncontextmenu = () => {};
        this._helpCtrl.dispose();
        this._controlPanel.dispose();
        this._settingsCtrl.dispose();
        Object.keys(this._buttons)
            .filter(key => !!this._buttons[key])
            .forEach(key => this._buttons[key].dispose());
        window.removeEventListener( 'resize', this._listenerRef, false);
        SOUNDS_CTRL.stopAirThruster();
        SOUNDS_CTRL.stopAirThruster();
        SOUNDS_CTRL.stopBackgroundMusicScifi01();
        SOUNDS_CTRL.stopDrilling();
        SOUNDS_CTRL.stopMainThrusterSmall();
        SOUNDS_CTRL.stopWalkingFastGravel();
        SOUNDS_CTRL.stopWind();
    }

    /**
     * At the end of each loop iteration, check for end state.
     * @returns whether or not the scene is done.
     */
    public endCycle(): { [key: number]: number } {
        this._counters.jobs++;
        if (this._counters.jobs > 10) this._counters.jobs = 0;
        // Game externally paused from control panel. Nothing should progress.
        if (this._state === MainLevelState.paused) {
            return;
        }
        // Game is in help mode. Play animations from help screen.
        if (this._state === MainLevelState.tutorial) {
            this._helpCtrl.endCycle();
            return;
        }
        // Game is in settings mode. Activate settings screen.
        if (this._state === MainLevelState.settings) {
            this._settingsCtrl.endCycle();
            return;
        }
        // Game not yet started. Nothing should progress.
        if (this._state === MainLevelState.newGame) {
            SOUNDS_CTRL.stopBackgroundMusicScifi01();
            SOUNDS_CTRL.stopWind();
            return;
        }

        // Player died. Nothing should progress.
        if (this._state === MainLevelState.dead) {
            // Return score.
            // Remove things from scene.
            return;
        }

        // After all enemies are dead.
        if (this._state === MainLevelState.win) {
            // Do the victory dance
            // Return level, score, and player lives.
            return;
        }

        if (this._state === MainLevelState.active) {
            this._player.endCycle(this._dirKeys);
            this._bandits = this._bandits.filter(bandit => {
                if (!bandit.endCycle()) {
                    console.log('should destroy bandit');
                    bandit.destroy();
                    return false;
                }
                return true;
            });
        }

        CollisionatorSingleton.checkForCollisions(this._scene);

        // Collision detection (bullets against enemy)
        if (false) {
            
        }

        // Collision detection (bullets against player)
        if (false) {
            
        }

        // Collision detection (barriers)
        if (false) {
            
        }

        if (this._state === MainLevelState.active && this._directionMove.some(x => !!x)) {
            this._counters.demoWalk++;
            const val = this._counters.demoWalk % 3;
            if (val === 0) {
                this._actors.demoActors[0].mesh.visible = true;
                this._actors.demoActors[1].mesh.visible = false;
                this._actors.demoActors[2].mesh.visible = false;
            } else if (val === 1) {
                this._actors.demoActors[0].mesh.visible = false;
                this._actors.demoActors[1].mesh.visible = true;
                this._actors.demoActors[2].mesh.visible = false;
            } else {
                this._actors.demoActors[0].mesh.visible = false;
                this._actors.demoActors[1].mesh.visible = false;
                this._actors.demoActors[2].mesh.visible = true;
            }

            if (this._counters.demoWalk >= this._counters.demoWalkClear) {
                this._counters.demoWalk = 0;
            }
        }

        return;
    }
}