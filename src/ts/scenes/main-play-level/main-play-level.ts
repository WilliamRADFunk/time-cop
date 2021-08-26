import {
    Object3D,
    OrthographicCamera,
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
import { Post, PostPositions } from '../../entities/post';
import { Bandit, banditStartPositions } from '../../entities/bandit';
import { Player } from '../../entities/player';
import { ScoreCtrl } from '../../controls/controllers/score-controller';
import { ActorController } from './controllers/actor-controller';
import { BarricadeLevel } from '../../entities/barricade-level';
import { LifeCtrl } from '../../controls/controllers/lives-controller';
import { StringMapToNumber } from '../../models/string-map-to-number';
import { SlowMo_Ctrl } from '../../controls/controllers/slow-mo-controller';

/**
 * Border value used for dev mode to see outline around text content (for positioning and sizing).
 */
// const border: string = '1px solid #FFF';
const border: string = 'none';

const debounceTime = 250;

const runningDelay: number = 10000; // 10 Seconds.

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

/**
 * @class
 * Screen dedicated to landing the lander on planetary surface to mine.
 */
export class MainPlayLevel {
    /**
     * Reference to this scene's actor controller.
     */
    private _actorCtrl: ActorController;

    /**
     * The collection of pieces that make up the barricade contianing the level number.
     */
    private _barricadeLevel: BarricadeLevel;

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

    /**
     * EndCycle counters to help with various timing and animation uses.
     */
    private _counters = {
        demoWalk: 0,
        demoWalkClear: 120,
        jobs: 1
    };

    /**
     * Set when user clicks mouse to have something to compare against for debounce purposes.
     */
    private _delayStartTime: number;

    /**
     * The movement keys the player currently has pressed.
     */
    private _dirKeys: StringMapToNumber = {
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
     * Current level player is on.
     */
    private _level: number;

    /**
     * The instance of life hanlder used for this level instance.
     */
    private _lifeHandler: LifeCtrl;

    /**
     * Reference to _onWindowResize so that it can be removed later.
     */
    private _listenerRef: () => void;

    /**
     * Reference to the Player entity instance.
     */
    private _player: Player;

    /**
     * The list of collidable post objects in the level.
     */
    private _posts: Post[] = [];

    /**
     * Reference to the scene, used to remove elements from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * The instance of scoreboard used for this level instance.
     */
    private _scoreboard: ScoreCtrl;

    /**
     * Reference to this scene's settings controller.
     */
    private _settingsCtrl: SettingsCtrl;

    /**
     * Flag to communicate the start click calculations were already done once.
     */
    private _started: boolean = false;

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
        lives: number) {

        this._camera = scene.camera as OrthographicCamera;
        this._scene = scene.scene;
        this._level = level;

        // Text, Button, and Event Listeners
        this._onInitialize(scene);
        this._listenerRef = this._onWindowResize.bind(this);
        window.addEventListener('resize', this._listenerRef, false);

        for (let x = 0; x < PostPositions.length; x++) {
            const postPos = PostPositions[x];
            const post = new Post(this._scene, postPos[0], postPos[1], 1);
            this._posts.push(post);
            CollisionatorSingleton.add(post);
        }

        this._helpCtrl = new HelpCtrl(
            this._scene,
            border);
        
        this._settingsCtrl = new SettingsCtrl(
            this._scene,
            border);
        
        this._actorCtrl = new ActorController(this._scene);

        this._barricadeLevel = new BarricadeLevel(this._scene, this._level, 2);
    }

    private addEntities(): void {
        this._player = new Player(
            this._scoreboard,
            this._lifeHandler,
            this._scene,
            ASSETS_CTRL.textures.sheriff,
            0, 0,
            0,
            1,
            false);
        this._player.addToScene();
        CollisionatorSingleton.add(this._player);

        for (let y = 0; y < banditStartPositions.length; y++) {
            const startPos = banditStartPositions[y];
            const bandit = new Bandit(
                this._scoreboard,
                this._level,
                this._scene,
                ASSETS_CTRL.textures.banditCowboy,
                startPos[0],
                startPos[1],
                startPos[2],
                0.05,
                1,
                true,
                false);
            bandit.addToScene();
            CollisionatorSingleton.add(bandit);
            this._bandits.push(bandit);
        }
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
            if (this._state === MainLevelState.active) {
                this._player.fire(true);
            }
            return false;
        };
        document.onclick = event => {
            event.preventDefault();
            if (!this._delayStartTime) return;
    
            const timeDiff = this._started ? 10000 : new Date().getTime() - this._delayStartTime;
            if (this._state === MainLevelState.active && timeDiff >= debounceTime) {
                if (!this._started) {
                    this._delayStartTime = new Date().getTime();
                }
                this._started = true;
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
                } else if (key === 's' || key === 'arrowdown') {
                    // Move towards down
                    this._dirKeys.down = 1;
                    this._dirKeys.up = 0;
                }
                
                if (key === 'a' || key === 'arrowleft') {
                    // Move towards left
                    this._dirKeys.left = 1;
                    this._dirKeys.right = 0;
                } else if (key === 'd' || key === 'arrowright') {
                    // Move towards right
                    this._dirKeys.right = 1;
                    this._dirKeys.left = 0;
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



        let onClick = (e: Event) => {
            if (this._state === MainLevelState.newGame) {
                this._delayStartTime = new Date().getTime();
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
     * Passes the instance of the scoreboard to the level for use in adding points and regaining lives.
     * @param scoreBoard the instance of scoreboard used for this level instance.
     */
    public addScoreBoard(scoreBoard: ScoreCtrl): void {
        this._scoreboard = scoreBoard;
    }

    /**
     * Passes the instance of the lifeHandler to the level for use in addingand removing lives.
     * @param scoreBoard the instance of lifeHandler used for this level instance.
     */
    public addLifeHandler(lifeHandler: LifeCtrl): void {
        this._lifeHandler = lifeHandler;
        this.addEntities();
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
        this._barricadeLevel.removeFromScene();
    }

    /**
     * At the end of each loop iteration, check for end state.
     * @returns whether or not the scene is done.
     */
    public endCycle(): StringMapToNumber {
        this._counters.jobs++;
        if (this._counters.jobs > 10) this._counters.jobs = 1;
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
            return {
                score: this._scoreboard.getScore(),
                lives: this._lifeHandler.getLives()
            };
        }

        // After all enemies are dead.
        if (this._state === MainLevelState.win) {
            // Do the victory dance
            return {
                score: this._scoreboard.getScore(),
                lives: this._lifeHandler.getLives()
            };
        }

        if (this._state === MainLevelState.active) {
            const playerDeadStatus = this._player.endCycle(this._dirKeys);
            this._bandits = this._bandits.filter(bandit => {
                if (!bandit.endCycle(this._lifeHandler.isDying())) {
                    bandit.destroy();
                    return false;
                }
                return true;
            });

            // Player died. Game over.
            if (playerDeadStatus) {
                this._state = MainLevelState.dead;
                return;
            }

            if (!this._bandits.length) {
                this._state = MainLevelState.win;
            } else if (this._bandits.filter(bandit => bandit.getRunning()).length) {
                // There are bandits already running, don't activate anyone else.
            } else if (new Date().getTime() - this._delayStartTime > runningDelay && Math.random() > 0.8) {
                this._bandits
                    .filter(bandit => bandit.getRunCapability())
                    .filter(bandit => bandit.activateRunning())
                    .length ? this._actorCtrl.activateArrows() : null;
            }

            this._actorCtrl.endCycle();

            const scoreRewards = this._scoreboard.getBonuses();
            if (scoreRewards?.freeLife) {
                this._lifeHandler.addLife();
            }
            if (scoreRewards?.timeSlow) {
                SlowMo_Ctrl.enterSlowMo(true);
            }
        }

        CollisionatorSingleton.checkForCollisions(this._scene);

        return;
    }
}