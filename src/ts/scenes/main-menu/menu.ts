import {
    DoubleSide,
    Font,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    PlaneGeometry,
    PointLight,
    Scene,
    TextGeometry,
    TextGeometryParameters,
    AmbientLight} from 'three';

import { HelpHandler } from '../help-screen/help-handler';
import { LoadHandler } from '../load-screen/load-handler';
import { SOUNDS_CTRL } from '../../controls/controllers/sounds-controller';
import { SceneType } from '../../models/scene-type';
import { ASSETS_CTRL } from '../../controls/controllers/assets-controller';
import { getIntersections } from '../../utils/get-intersections';

// const backgroundColor = 0xFF0044;
const backgroundColor: number = null;

// const backgroundOpacity = 1;
const backgroundOpacity = 0;

/**
 * @class
 * Keeps track of all things menu related.
 */
export class Menu {
    /**
     * Click surface for the Easy button.
     */
    private _barrierEasy: Mesh;

    /**
     * Click surface for the Hard button.
     */
    private _barrierHard: Mesh;

    /**
     * Click surface for the Hardcore button.
     */
    private _barrierHardcore: Mesh;

    /**
     * Click surface for the Help button.
     */
    private _barrierHelp: Mesh;

    /**
     * Click surface for the Load button.
     */
    private _barrierLoad: Mesh;

    /**
     * Click surface for the Normal button.
     */
    private _barrierNormal: Mesh;

    /**
     * Click surface for the Off button.
     */
    private _barrierOff: Mesh;

    /**
     * Click surface for the On button.
     */
    private _barrierOn: Mesh;

    /**
     * Click surface for the Start button.
     */
    private _barrierStart: Mesh;

    /**
     * Controls the background click surface of buttons.
     */
    private _clickMaterial: MeshBasicMaterial;

    /**
     * Controls the overall rendering of the copyright display
     */
    private _copyright: Mesh;

    /**
     * Controls size and shape of the copyright text
     */
    private _copyrightGeometry: TextGeometry;

    /**
     * Easy, Medium, Hard, Hardcore
     */
    private _difficultyLevel: number = 3; // Hardcore

    /**
     * Controls the overall rendering of the easy button display
     */
    private _easy: Mesh;

    /**
     * Controls size and shape of the easy button text
     */
    private _easyGeometry: TextGeometry;

    /**
     * Since most of the text on the menu has same parameters, use one variable.
     */
    private _fontDifficultyBtnParams: TextGeometryParameters;

    /**
     * Controls the overall rendering of the hard button display
     */
    private _hard: Mesh;

    /**
     * Controls size and shape of the hard button text
     */
    private _hardGeometry: TextGeometry;

    /**
     * Controls the overall rendering of the hardcore button display
     */
    private _hardcore: Mesh;

    /**
     * Controls size and shape of the hardcore button text
     */
    private _hardcoreGeometry: TextGeometry;

    /**
     * Controls the overall rendering of the help button display
     */
    private _help: Mesh;

    /**
     * Controls size and shape of the help button text
     */
    private _helpGeometry: TextGeometry;

    /**
     * Paints the help screen.
     */
    private _helpHandler: HelpHandler;

    /**
     * Standard ambient light to better see the help menu with.
     */
    private _helpLight: AmbientLight;

    /**
     * Flag to signal the scene is no longer active. Primarily used for a click event to useful during endCycle.
     */
    private _isActive: boolean = true;

    /**
     * Controls the overall rendering of the load button display
     */
    private _load: Mesh;

    /**
     * Controls size and shape of the load button text
     */
    private _loadGeometry: TextGeometry;

    /**
     * Paints the load screen.
     */
    private _loadHandler: LoadHandler;

    /**
     * Controls the overall rendering of the main banner display
     */
    private _mainBanner: Mesh;

    /**
     * Controls size and shape of the main banner text
     */
    private _mainBannerGeometry: TextGeometry;

    /**
     * Loaded font for menu text.
     */
    private _menuFont: Font;

    /**
     * Controls the color of the untouched button display material
     */
    private _menuMaterial: MeshLambertMaterial;

    /**
     * Controls the color of the selected button display material
     */
    private _menuSelectedMaterial: MeshLambertMaterial;

    /**
     * Keeps track of menu mode.
     * 0 --> Menu options
     * 1 --> Help screen
     * 2 --> Load screen
     */
    private _mode: number = 0;

    /**
     * Controls the overall rendering of the normal button display
     */
    private _normal: Mesh;

    /**
     * Controls size and shape of the normal button text
     */
    private _normalGeometry: TextGeometry;

    /**
     * Controls the overall rendering of the off button display
     */
    private _off: Mesh;

    /**
     * Controls size and shape of the off button text
     */
    private _offGeometry: TextGeometry;

    /**
     * Controls the overall rendering of the on button display
     */
    private _on: Mesh;

    /**
     * Controls size and shape of the on button text
     */
    private _onGeometry: TextGeometry;

    /**
     * The distant dim light that allows the shimmer effect to happen.
     */
    private _pointLight: PointLight;

    /**
     * Reference to the scene, used to remove and reinstall text geometries.
     */
    private _scene: Scene;

    /**
     * Controls the light that give the text its shine.
     */
    private _shimmer: PointLight;

    /**
     * Controls the overall rendering of the Sound text display
     */
    private _sound: Mesh;

    /**
     * Controls the overall rendering of the start button display
     */
    private _start: Mesh;

    /**
     * Controls size and shape of the start button text
     */
    private _startGeometry: TextGeometry;

    /**
     * Constructor for the Menu class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    constructor(scene: SceneType) {
        this._menuFont = ASSETS_CTRL.gameFont;
        this._scene = scene.scene;
        this._fontDifficultyBtnParams = {
            font: this._menuFont,
            size: 0.3,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 3
        };

        this._shimmer = new PointLight(0x66FF66, 2);
        this._shimmer.position.set(-20, 2, 0);
        this._scene.add(this._shimmer);

        this._pointLight = new PointLight(0x66FF66, 1);
        this._pointLight.position.set(15, 2, 0);
        this._scene.add(this._pointLight);

        this._menuMaterial = new MeshLambertMaterial({
            color: 0x0066FF,
            opacity: 1,
            transparent: true
        });
        this._menuSelectedMaterial = new MeshLambertMaterial({
            color: 0xFFCC00,
            opacity: 1,
            transparent: true
        });
        this._clickMaterial = new MeshBasicMaterial({
            color: backgroundColor,
            opacity: backgroundOpacity,
            transparent: true,
            side: DoubleSide
        });

        // Create the start collision layer
        const startBarrierGeometry = new PlaneGeometry( 1.5, 0.8, 0, 0 );
        this._barrierStart = new Mesh( startBarrierGeometry, this._clickMaterial );
        this._barrierStart.name = 'Start';
        this._barrierStart.position.set(0, 0, -1);
        this._barrierStart.rotation.set(1.5708, 0, 0);
        this._scene.add(this._barrierStart);

        // Create the easy collision layer
        const easyBarrierGeometry = new PlaneGeometry( 1.4, 0.8, 0, 0 );
        this._barrierEasy = new Mesh( easyBarrierGeometry, this._clickMaterial );
        this._barrierEasy.name = 'Easy';
        this._barrierEasy.position.set(-3.2, 0, 0);
        this._barrierEasy.rotation.set(1.5708, 0, 0);
        this._scene.add(this._barrierEasy);

        // Create the normal collision layer
        const normalBarrierGeometry = new PlaneGeometry( 1.9, 0.8, 0, 0 );
        this._barrierNormal = new Mesh( normalBarrierGeometry, this._clickMaterial );
        this._barrierNormal.name = 'Normal';
        this._barrierNormal.position.set(-1.35, 0, 0);
        this._barrierNormal.rotation.set(1.5708, 0, 0);
        this._scene.add(this._barrierNormal);

        // Create the hard collision layer
        const hardBarrierGeometry = new PlaneGeometry( 1.4, 0.8, 0, 0 );
        this._barrierHard = new Mesh( hardBarrierGeometry, this._clickMaterial );
        this._barrierHard.name = 'Hard';
        this._barrierHard.position.set(0.5, 0, 0);
        this._barrierHard.rotation.set(1.5708, 0, 0);
        this._scene.add(this._barrierHard);

        // Create the hardcore collision layer
        const hardcoreBarrierGeometry = new PlaneGeometry( 2.6, 0.8, 0, 0 );
        this._barrierHardcore = new Mesh( hardcoreBarrierGeometry, this._clickMaterial );
        this._barrierHardcore.name = 'Hardcore';
        this._barrierHardcore.position.set(2.7, 0, 0);
        this._barrierHardcore.rotation.set(1.5708, 0, 0);
        this._scene.add(this._barrierHardcore);

        // Create the load collision layer
        const loadBarrierGeometry = new PlaneGeometry( 1.5, 0.8, 0, 0 );
        this._barrierLoad = new Mesh( loadBarrierGeometry, this._clickMaterial );
        this._barrierLoad.name = 'Load';
        this._barrierLoad.position.set(0, 0, 1);
        this._barrierLoad.rotation.set(1.5708, 0, 0);
        this._scene.add(this._barrierLoad);

        // Create the help collision layer
        const helpBarrierGeometry = new PlaneGeometry( 1.5, 0.8, 0, 0 );
        this._barrierHelp = new Mesh( helpBarrierGeometry, this._clickMaterial );
        this._barrierHelp.name = 'Help';
        this._barrierHelp.position.set(0, 0, 2);
        this._barrierHelp.rotation.set(1.5708, 0, 0);
        this._scene.add(this._barrierHelp);

        // Create the sound off collision layer
        const offBarrierGeometry = new PlaneGeometry( 1, 0.8, 0, 0 );
        this._barrierOff = new Mesh( offBarrierGeometry, this._clickMaterial );
        this._barrierOff.name = 'Off';
        this._barrierOff.position.set(1.2, 0, 3);
        this._barrierOff.rotation.set(1.5708, 0, 0);
        this._scene.add(this._barrierOff);

        // Create the sound on collision layer
        const onBarrierGeometry = new PlaneGeometry( 0.9, 0.8, 0, 0 );
        this._barrierOn = new Mesh( onBarrierGeometry, this._clickMaterial );
        this._barrierOn.name = 'On';
        this._barrierOn.position.set(0, 0, 3);
        this._barrierOn.rotation.set(1.5708, 0, 0);
        this._scene.add(this._barrierOn);

        // Main Banner button text
        this._mainBannerGeometry = new TextGeometry('Time Cop',
            {
                font: this._menuFont,
                size: 0.6,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelSegments: 3
            });
        this._mainBanner = new Mesh( this._mainBannerGeometry, this._menuSelectedMaterial );
        this._mainBanner.position.set(-3.85, -0.5, -3);
        this._mainBanner.rotation.x = -1.5708;
        this._scene.add(this._mainBanner);

        // Copyright text
        this._copyrightGeometry = new TextGeometry('Copyright 2021 Tenacious Teal Games',
            {
                font: this._menuFont,
                size: 0.2,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelSegments: 3
            });
        this._copyright = new Mesh( this._copyrightGeometry, this._menuMaterial );
        this._copyright.position.set(-5.8, -0.5, 5.8);
        this._copyright.rotation.x = -1.5708;
        this._scene.add(this._copyright);

        // Start button text
        this._startGeometry = new TextGeometry('Start', this._fontDifficultyBtnParams);
        this._start = new Mesh( this._startGeometry, this._menuMaterial );
        this._start.position.set(-0.6, -0.5, -0.8);
        this._start.rotation.x = -1.5708;
        this._scene.add(this._start);

        // Easy button text
        this._createDifficultyButtons(0, ((this._difficultyLevel === 0) ? this._menuSelectedMaterial : this._menuMaterial), false);
        // Normal button text
        this._createDifficultyButtons(1, ((this._difficultyLevel === 1) ? this._menuSelectedMaterial : this._menuMaterial), false);
        // Hard button text
        this._createDifficultyButtons(2, ((this._difficultyLevel === 2) ? this._menuSelectedMaterial : this._menuMaterial), false);
        // Hardcore button text
        this._createDifficultyButtons(3, ((this._difficultyLevel === 3) ? this._menuSelectedMaterial : this._menuMaterial), false);

        // Load button text
        this._loadGeometry = new TextGeometry('Load', this._fontDifficultyBtnParams);
        this._load = new Mesh( this._loadGeometry, this._menuMaterial );
        this._load.position.set(-0.5, -0.5, 1.2);
        this._load.rotation.x = -1.5708;
        this._scene.add(this._load);

        // Help button text
        this._helpGeometry = new TextGeometry('Help', this._fontDifficultyBtnParams);
        this._help = new Mesh( this._helpGeometry, this._menuMaterial );
        this._help.position.set(-0.5, -0.5, 2.2);
        this._help.rotation.x = -1.5708;
        this._scene.add(this._help);

        this._helpHandler = new HelpHandler(this._scene, this._menuFont);
        this._helpHandler.deactivate();
        this._loadHandler = new LoadHandler(this._scene, this._menuFont);
        this._loadHandler.deactivate();

        // Sound text
        const soundGeometry = new TextGeometry('Sound: ', this._fontDifficultyBtnParams);
        this._sound = new Mesh( soundGeometry, this._menuMaterial );
        this._sound.position.set(-2.3, -0.5, 3.2);
        this._sound.rotation.x = -1.5708;
        this._scene.add(this._sound);

        // On button text
        this._onGeometry = new TextGeometry('ON', this._fontDifficultyBtnParams);
        this._on = new Mesh(
            this._onGeometry,
            SOUNDS_CTRL.getMute() ? this._menuMaterial : this._menuSelectedMaterial);
        this._on.position.set(-0.3, -0.5, 3.2);
        this._on.rotation.x = -1.5708;
        this._scene.add(this._on);

        // Off button text
        this._offGeometry = new TextGeometry('OFF', this._fontDifficultyBtnParams);
        this._off = new Mesh(
            this._offGeometry,
            SOUNDS_CTRL.getMute() ? this._menuSelectedMaterial : this._menuMaterial);
        this._off.position.set(0.85, -0.5, 3.2);
        this._off.rotation.x = -1.5708;
        this._scene.add(this._off);

        // Click event listener that activates certain menu options.
        document.onclick = event => {
            event.preventDefault();

            // Detection for player clicked on menu option.
            const intersecs = getIntersections(event, document.getElementById('mainview'), scene)
            for (let i = 0; i < intersecs.length; i++) {
                const name = intersecs[i].object.name;
                if (this._mode === 0 && name === 'Start') {
                    this._pressedStart();
                    this._isActive = false;
                    SOUNDS_CTRL.playBidooo();
                    // TODO: Fill game data with empty set + chosen difficulty setting.
                    break;
                } else if (this._mode === 2 && name === 'Load Code') {
                    SOUNDS_CTRL.playBidooo();
                    this._isActive = false;
                    // TODO: Fill game data with decrypted load code.
                    break;
                } else if (this._mode === 0 && name === 'Easy') {
                    this._changeDifficulty(0);
                    SOUNDS_CTRL.playBidooo();
                    break;
                } else if (this._mode === 0 && name === 'Normal') {
                    this._changeDifficulty(1);
                    SOUNDS_CTRL.playBidooo();
                    break;
                } else if (this._mode === 0 && name === 'Hard') {
                    this._changeDifficulty(2);
                    SOUNDS_CTRL.playBidooo();
                    break;
                } else if (this._mode === 0 && name === 'Hardcore') {
                    this._changeDifficulty(3);
                    SOUNDS_CTRL.playBidooo();
                    break;
                } else if (this._mode === 0 && name === 'Load') {
                    this._pressedLoad();
                    SOUNDS_CTRL.playBidooo();
                    break;
                } else if (this._mode === 0 && name === 'Help') {
                    this._pressedHelp();
                    SOUNDS_CTRL.playBidooo();
                    break;
                } else if (this._mode === 0 && name === 'On') {
                    this._pressedOn();
                    break;
                } else if (this._mode === 0 && name === 'Off') {
                    this._pressedOff();
                    break;
                } else if (this._mode === 1 && name === 'Return Help') {
                    this._returnToMainMenu();
                    SOUNDS_CTRL.playBidooo();
                    break;
                } else if (this._mode === 2 && name === 'Return Load') {
                    this._returnToMainMenu();
                    SOUNDS_CTRL.playBidooo();
                    break;
                } else if (this._mode === 2 && name.length === 1) {
                    this._charEntered(name);
                    SOUNDS_CTRL.playBidooo();
                    break;
                }
            };
        };
    }

    /**
     * Changes difficulty level, and instigates the altering of the button texts associated with that choice.
     * @param diff the selected diffulty choice (0 --> easy, 1 --> normal, 2 --> hard, 3 --> hardcore)
     */
    private _changeDifficulty(diff: number): void {
        if (diff === this._difficultyLevel) return;
        this._createDifficultyButtons(this._difficultyLevel, this._menuMaterial, true);
        this._difficultyLevel = diff;
        this._createDifficultyButtons(this._difficultyLevel, this._menuSelectedMaterial, true);
    }

    /**
     * Passes load char onto the loadHandler.
     * @param char player clicked on a specific char. This is that char 0-F
     */
    private _charEntered(char: string): void {
        this._loadHandler.charEntered(char);
    }

    /**
     * Called to (re)create difficulty menu button text
     * @param buttonIndex   the selected diffulty choice (0 --> easy, 1 --> normal, 2 --> hard, 3 --> hardcore)
     * @param material      the material (color mostly) to use in new text mesh
     * @param removeFirst   to determine if text mesh should first be removed from scene (TRUE --> remove | FALSE --> no remove)
     */
    private _createDifficultyButtons(buttonIndex: number, material: MeshLambertMaterial, removeFirst: boolean): void {
        switch(buttonIndex) {
            case 0: {
                if (removeFirst) {
                    this._scene.remove(this._easy);
                }
                // Selected easy button text
                this._easyGeometry = new TextGeometry('Easy', this._fontDifficultyBtnParams);
                this._easy = new Mesh( this._easyGeometry, material );
                this._easy.position.set(-3.65, -0.5, 0.20);
                this._easy.rotation.x = -1.5708;
                this._scene.add(this._easy);
                break;
            }
            case 1: {
                if (removeFirst) {
                    this._scene.remove(this._normal);
                }
                // Selected normal button text
                this._normalGeometry = new TextGeometry('Normal', this._fontDifficultyBtnParams);
                this._normal = new Mesh( this._normalGeometry, material );
                this._normal.position.set(-2.15, -0.5, 0.20);
                this._normal.rotation.x = -1.5708;
                this._scene.add(this._normal);
                break;
            }
            case 2: {
                if (removeFirst) {
                    this._scene.remove(this._hard);
                }
                // Selected hard button text
                this._hardGeometry = new TextGeometry('Hard', this._fontDifficultyBtnParams);
                this._hard = new Mesh( this._hardGeometry, material );
                this._hard.position.set(0, -0.5, 0.20);
                this._hard.rotation.x = -1.5708;
                this._scene.add(this._hard);
                break;
            }
            case 3: {
                if (removeFirst) {
                    this._scene.remove(this._hardcore);
                }
                //  Selected hardcore button text
                this._hardcoreGeometry = new TextGeometry('Hardcore', this._fontDifficultyBtnParams);
                this._hardcore = new Mesh( this._hardcoreGeometry, material );
                this._hardcore.position.set(1.7, -0.5, 0.20);
                this._hardcore.rotation.x = -1.5708;
                this._scene.add(this._hardcore);
                break;
            }
            default: {}
        }
    }

    /**
     * Transitions to help screen.
     * Changes the help menu button text when clicked to signal to user that their click worked.
     */
    private _pressedHelp(): void {
        this._scene.remove(this._help);
        // Selected help button text
        this._helpGeometry = new TextGeometry('Help', this._fontDifficultyBtnParams);
        this._help = new Mesh( this._helpGeometry, this._menuSelectedMaterial );
        this._help.position.set(-0.5, -0.5, 2.2);
        this._help.rotation.x = -1.5708;
        this._scene.add(this._help);
        setTimeout(() => {
            this._mode = 1;
            this.hideMenu();
            this._helpHandler.activate();
        }, 250);
    }

    /**
     * Changes the load menu button text when clicked to signal to user that their click worked (if not hardcore difficulty).
     * @returns TRUE --> valid click, move onto load menu | FALSE --> harcore mode means load is inactive.
     */
    private _pressedLoad(): void {
        this._scene.remove(this._load);
        // Selected load button text
        this._loadGeometry = new TextGeometry('Load', this._fontDifficultyBtnParams);
        this._load = new Mesh( this._loadGeometry, this._menuSelectedMaterial );
        this._load.position.set(-0.5, -0.5, 1.2);
        this._load.rotation.x = -1.5708;
        this._scene.add(this._load);
        setTimeout(() => {
            this._mode = 2;
            this.hideMenu();
            this._loadHandler.activate();
        }, 250);
    }

    /**
     * Turns sound off.
     * Changes the off menu button text when clicked to signal to user that their click worked.
     */
    private _pressedOff(): void {
        this._scene.remove(this._off);
        this._scene.remove(this._on);
        // Selected off button text
        this._off = new Mesh( this._offGeometry, this._menuSelectedMaterial );
        this._off.position.set(0.85, -0.5, 3.2);
        this._off.rotation.x = -1.5708;
        this._scene.add(this._off);
        // Selected on button text
        this._on = new Mesh( this._onGeometry, this._menuMaterial );
        this._on.position.set(-0.3, -0.5, 3.2);
        this._on.rotation.x = -1.5708;
        this._scene.add(this._on);
        SOUNDS_CTRL.playBidooo();
        SOUNDS_CTRL.toggleMute(true);
    }

    /**
     * Turns sound on.
     * Changes the on menu button text when clicked to signal to user that their click worked.
     */
    private _pressedOn(): void {
        this._scene.remove(this._off);
        this._scene.remove(this._on);
        // Selected off button text
        this._off = new Mesh( this._offGeometry, this._menuMaterial );
        this._off.position.set(0.8, -0.5, 3.2);
        this._off.rotation.x = -1.5708;
        this._scene.add(this._off);
        // Selected on button text
        this._on = new Mesh( this._onGeometry, this._menuSelectedMaterial );
        this._on.position.set(-0.3, -0.5, 3.2);
        this._on.rotation.x = -1.5708;
        this._scene.add(this._on);
        SOUNDS_CTRL.toggleMute(false);
        SOUNDS_CTRL.playBidooo();
    }

    /**
     * Changes the start menu button text when clicked to signal to user that their click worked.
     */
    private _pressedStart(): void {
        this._scene.remove(this._start);
        // Selected start button text
        this._startGeometry = new TextGeometry('Start', this._fontDifficultyBtnParams);
        this._start = new Mesh( this._startGeometry, this._menuSelectedMaterial );
        this._start.position.set(-0.6, -0.5, -0.8);
        this._start.rotation.x = -1.5708;
        this._scene.add(this._start);
    }

    /**
     * Reactivates main menu options.
     */
    private _returnToMainMenu(): void {
        if (this._mode === 2) {
            this._scene.remove(this._load);
            // Selected load button text
            this._loadGeometry = new TextGeometry('Load', this._fontDifficultyBtnParams);
            this._load = new Mesh( this._loadGeometry, this._menuMaterial );
            this._load.position.set(-0.5, -0.5, 1.2);
            this._load.rotation.x = -1.5708;
            this._scene.add(this._load);
            this._mode = 0;
            this._showMenu();
            this._loadHandler.deactivate();
        } else if (this._mode === 1) {
            this._scene.remove(this._help);
            // Selected help button text
            this._helpGeometry = new TextGeometry('Help', this._fontDifficultyBtnParams);
            this._help = new Mesh( this._helpGeometry, this._menuMaterial );
            this._help.position.set(-0.5, -0.5, 2.2);
            this._help.rotation.x = -1.5708;
            this._scene.add(this._help);
            this._mode = 0;
            this._showMenu();
            this._helpHandler.deactivate();
        }
        this._createDifficultyButtons(0, this._menuMaterial, true);
        this._createDifficultyButtons(1, this._menuMaterial, true);
        this._createDifficultyButtons(2, this._menuMaterial, true);
        this._createDifficultyButtons(3, this._menuMaterial, true);

        this._createDifficultyButtons(this._difficultyLevel, this._menuSelectedMaterial, true);
    }

    /**
     * Turns visibility for menu items to be seen.
     */
    private _showMenu() {
        this._shimmer.color.set(0x66FF66);
        this._shimmer.intensity = 2;
        this._shimmer.position.y = 2;
        this._start.visible = true;
        this._easy.visible = true;
        this._normal.visible = true;
        this._hard.visible = true;
        this._hardcore.visible = true;
        this._load.visible = true;
        this._help.visible = true;
        this._sound.visible = true;
        this._on.visible = true;
        this._off.visible = true;
        this._barrierEasy.visible = true;
        this._barrierHard.visible = true;
        this._barrierHardcore.visible = true;
        this._barrierHelp.visible = true;
        this._barrierLoad.visible = true;
        this._barrierNormal.visible = true;
        this._barrierOff.visible = true;
        this._barrierOn.visible = true;
        this._barrierStart.visible = true;
    }

    /**
     * Removes any attached DOM elements, event listeners, or anything separate from ThreeJS
     */
    public dispose(): void {
        document.onmousemove = () => {};
        document.onclick = () => {};
        document.oncontextmenu = () => {};
    }

    /**
     * Moves the point light from left to right a little every frame.
     * @returns whether or not the scene has finished. TRUE means the scene is done | FALSE if it isn't.
     */
    public endCycle(): boolean {
        if (!this._isActive) {
            return true;
        }

        if (this._mode === 1) {
            this._shimmer.position.x = 0;
            this._shimmer.intensity = 0;
            this._pointLight.intensity = 0;
            if (!this._helpLight) {
                this._helpLight = new AmbientLight(0xCCCCCC);
                this._scene.add(this._helpLight);
            }
            this._helpHandler.endCycle();
        } else {
            if (this._helpLight) {
                this._scene.remove(this._helpLight);
                this._helpLight = null;
            }
            if (this._shimmer.position.x > 20) {
                this._shimmer.position.x = -20;
            }
            this._shimmer.position.x += 0.2;
        }
        this._loadHandler.endCycle();
    }

    /**
     * Turns visibility for menu items to be unseen.
     */
    public hideMenu() {
        this._shimmer.color.set(0xCCCCCC);
        this._shimmer.intensity = 3.2;
        this._shimmer.position.y = -10;
        this._start.visible = false;
        this._easy.visible = false;
        this._normal.visible = false;
        this._hard.visible = false;
        this._hardcore.visible = false;
        this._load.visible = false;
        this._help.visible = false;
        this._sound.visible = false;
        this._on.visible = false;
        this._off.visible = false;
        this._barrierEasy.visible = false;
        this._barrierHard.visible = false;
        this._barrierHardcore.visible = false;
        this._barrierHelp.visible = false;
        this._barrierLoad.visible = false;
        this._barrierNormal.visible = false;
        this._barrierOff.visible = false;
        this._barrierOn.visible = false;
        this._barrierStart.visible = false;
    }

    /**
     * Retrieves the currently chosen difficulty level.
     * @returns the difficulty level currently selected in the menu.
     */
    public getDifficulty(): number {
        return this._difficultyLevel;
    }

    /**
     * Gets the game load data fom load code. If load code is invalid, it returns null.
     * @returns game load data from load code or null to start from a default set.
     */
    public getGameData(): null {
        return this._loadHandler.getGameData();
    }
}