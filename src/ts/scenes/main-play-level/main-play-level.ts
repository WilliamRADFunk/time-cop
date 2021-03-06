import {
    Font,
    Mesh,
    MeshLambertMaterial,
    Object3D,
    OrthographicCamera,
    Scene,
    TextGeometry } from 'three';

import { CollisionatorSingleton } from '../../collisionator';
import { SOUNDS_CTRL } from '../../controls/controllers/sounds-controller';
import { SceneType } from '../../models/scene-type';
import { ButtonBase } from '../../controls/buttons/button-base';
import { StartButton } from '../../controls/buttons/start-button';
import { BUTTON_COLORS } from '../../styles/button-colors';
import { ControlPanel } from '../../controls/panels/control-panel';
import { HelpCtrl } from './controllers/help-controller';
import { TextBase } from '../../controls/text/text-base';
import { SettingsCtrl } from '../../controls/controllers/settings-controllers';
import { ASSETS_CTRL } from '../../controls/controllers/assets-controller';
import { Post, PostPositions } from '../../entities/post';
import { Enemy, enemyStartPositions } from '../../entities/enemy';
import { Player } from '../../entities/player';
import { ScoreCtrl } from '../../controls/controllers/score-controller';
import { ActorController } from './controllers/actor-controller';
import { BarricadeLevel } from '../../entities/barricade-level';
import { LifeCtrl } from '../../controls/controllers/lives-controller';
import { StringMapToNumber } from '../../models/string-map-to-number';
import { SlowMo_Ctrl } from '../../controls/controllers/slow-mo-controller';
import { DifficultyMap } from '../../models/difficulty-map';

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
     * List of enemies in the scene.
     */
    private _enemies: Enemy[] = [];

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
     * The loaded font, used for the difficulty label.
     */
    private _font: Font;

    /**
     * Controls size and shape of the difficulty label.
     */
    private _difficultyGeometry: TextGeometry;

    /**
     * Controls the color of the difficulty label material.
     */
    private _difficultyMaterial: MeshLambertMaterial;

    /**
     * Controls the overall rendering of the difficulty label.
     */
    private _difficulty: Mesh;

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
     * @param scene         graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param level         current level being played.
     * @param difficulty    player chosen difficulty level.
     * @param difficulty    font to use for the difficulty label.
     */
    constructor(
        scene: SceneType,
        level: number,
        difficulty: number,
        font: Font) {

        this._camera = scene.camera as OrthographicCamera;
        this._scene = scene.scene;
        this._level = level;
        this._font = font;

        // Text, Button, and Event Listeners
        this._onInitialize();
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

        this._difficultyMaterial = new MeshLambertMaterial( {color: 0xFFCC00} );
        this._createDifficultyText(difficulty);
    }

    private _addEntities(): void {
        this._player = new Player({
            scoreboard: this._scoreboard,
            lifeHandler: this._lifeHandler,
            scene: this._scene,
            texture: ASSETS_CTRL.textures.rebel,
            x1: 0,
            z1: 0,
            speed: 0,
            yPos: 1,
            isHelpScreen: false });
        this._player.addToScene();
        CollisionatorSingleton.add(this._player);

        for (let y = 0; y < enemyStartPositions.length; y++) {
            const startPos = enemyStartPositions[y];
            const enemy = new Enemy({
                scoreboard: this._scoreboard,
                level: this._level,
                scene: this._scene,
                texture: ASSETS_CTRL.textures.banditCowboy,
                x1: startPos[0],
                z1: startPos[1],
                walkIndex: startPos[2],
                speedMod: 0.05,
                yPos: 1,
                isHelpScreen: false });
            enemy.addToScene();
            CollisionatorSingleton.add(enemy);
            this._enemies.push(enemy);
        }
    }
    
    /**
     * Creates the text in one place to obey the DRY rule.
     * @param difficulty player chosen difficulty level.
     */
    private _createDifficultyText(difficulty: number): void {
        // Only remove difficulty label if it was added before.
        if (this._difficulty) {
            this._scene.remove(this._difficulty);
            this._difficulty = null;
        }
        // Added before or not, make a new one and add it.
        // Sadly TextGeometries must be removed and added whenever the text content changes.
        this._difficultyGeometry = new TextGeometry(`MODE: ${DifficultyMap[difficulty]}`,
            {
                font: this._font,
                size: 0.3,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelSegments: 3
            });
        this._difficulty = new Mesh( this._difficultyGeometry, this._difficultyMaterial );
        this._difficulty.position.x = 2.65;
        this._difficulty.position.y = 0.75;
        this._difficulty.position.z = -5.5;
        this._difficulty.rotation.x = -1.5708;
        this._scene.add(this._difficulty);
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
    private _onInitialize(): void {
        // DOM Events
        const container = document.getElementById('mainview');
        document.addEventListener('mouseup', (event) => {
            event.preventDefault();
            const button = event.button;
            if (button) {
                event.stopPropagation();
                return this._player.fire(true);
            }
            return this._player.fire(false);
        });
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        document.addEventListener('keydown', (event) => {
            event.preventDefault();
            if (this._state === MainLevelState.active) {
                const key = (event.key || '').toLowerCase();
                // Up & Down move and aim adjustment.
                if (key === 's' || key === 'arrowdown') {
                    // Move towards down
                    this._dirKeys.down = 1;
                    this._dirKeys.up = 0;
                } else if (key === 'w' || key === 'arrowup') {
                    // Move towards up
                    this._dirKeys.up = 1;
                    this._dirKeys.down = 0;
                }

                // Left and Right move and aim adjustment.
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
        });
        document.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (this._state === MainLevelState.active) {
                const key = (event.key || '').toLowerCase();

                if (key === ' ' || key === 'space') {
                    this._player.reload(false);
                } else if (key === 'shift') {
                    this._player.reload(true);
                }

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
        });

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
        this._addEntities();
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
        SOUNDS_CTRL.stopBullet2BulletRicochet();
        SOUNDS_CTRL.stopEnemyDeath();
        SOUNDS_CTRL.stopMainThrusterSmall();
        SOUNDS_CTRL.stopWalkingFastGravel();
        SOUNDS_CTRL.stopWind();
    
        this._player && this._player.destroy();
        this._player = null;
        this._enemies.forEach(enemy => enemy.destroy());
        this._enemies.length = 0;
        this._posts.forEach(post => post.destroy());
        this._posts.length = 0;
        this._barricadeLevel && this._barricadeLevel.destroy();
        this._barricadeLevel = null;
        
        // Only remove difficulty label if it was added before.
        if (this._difficulty) {
            this._scene.remove(this._difficulty);
            this._difficulty = null;
        }
    }

    /**
     * At the end of each loop iteration, check for end state.
     * @returns whether or not the scene is done.
     */
    public endCycle(): boolean {
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
            this._player && this._player.destroy();
            this._player = null;
            this._enemies.forEach(enemy => enemy.destroy());
            this._enemies.length = 0;
            this._posts.forEach(post => post.destroy());
            this._posts.length = 0;
            this._barricadeLevel && this._barricadeLevel.destroy();
            this._barricadeLevel = null;
            return true;
        }

        // After all enemies are dead.
        if (this._state === MainLevelState.win) {
            this._player && this._player.destroy();
            this._player = null;
            this._enemies.forEach(enemy => enemy.destroy());
            this._enemies.length = 0;
            this._posts.forEach(post => post.destroy());
            this._posts.length = 0;
            this._barricadeLevel && this._barricadeLevel.destroy();
            this._barricadeLevel = null;
            SlowMo_Ctrl.exitSlowMo();
            // Do the victory dance
            return true;
        }

        if (this._state === MainLevelState.active) {
            const playerDeadStatus = this._player.endCycle(this._dirKeys);
            this._enemies = this._enemies.filter(enemy => {
                if (!enemy.endCycle(this._lifeHandler.isDying())) {
                    enemy.destroy();
                    return false;
                }
                return true;
            });

            // Player died. Game over.
            if (playerDeadStatus) {
                this._state = MainLevelState.dead;
                SlowMo_Ctrl.exitSlowMo();
                return;
            }

            if (!this._enemies.length) {
                this._state = MainLevelState.win;
            } else if (this._enemies.filter(enemy => enemy.getRunning()).length) {
                // There are enemies already running, don't activate anyone else.
            } else if (new Date().getTime() - this._delayStartTime > runningDelay && Math.random() > 0.8) {
                this._enemies
                    .filter(enemy => enemy.getRunCapability())
                    .filter(enemy => enemy.activateRunning())
                    .length ? this._actorCtrl.activateArrows() : null;
            }

            this._actorCtrl.endCycle();

            SlowMo_Ctrl.endCycle(this._player.getCurrentPosition());

            const scoreRewards = this._scoreboard.getBonuses() || Object.create(null);
            if (scoreRewards.freeLife) {
                // TODO: Bonus life animation and/or sound effect.
                SOUNDS_CTRL.playRegen();
                this._lifeHandler.addLife();
            }

            // Only activate slow motion mode if there are still enemy units alive.
            if (scoreRewards.timeSlow && this._enemies.filter(enemy => !enemy.getDeathSequeanceStatus()).filter.length) {
                SOUNDS_CTRL.playShieldUp();
                SlowMo_Ctrl.enterSlowMo(true);
            }
        }

        CollisionatorSingleton.checkForCollisions(this._scene);

        return;
    }
}