import {
    DoubleSide,
    LinearFilter,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PlaneGeometry,
    Scene,
    Texture } from "three";

// Local utilities

// Panels
import { LeftBottomMiddlePanel } from "../../../controls/panels/left-bottom-middle-panel";
import { LeftBottomPanel } from "../../../controls/panels/left-bottom-panel";
import { LeftTopMiddlePanel } from "../../../controls/panels/left-top-middle-panel";
import { LeftTopPanel } from "../../../controls/panels/left-top-panel";
import { PanelBase } from "../../../controls/panels/panel-base";
import { RightBottomMiddlePanel } from "../../../controls/panels/right-bottom-middle-panel";
import { RightBottomPanel } from "../../../controls/panels/right-bottom-panel";
import { RightTopMiddlePanel } from "../../../controls/panels/right-top-middle-panel";
import { RightTopPanel } from "../../../controls/panels/right-top-panel";

// HTML Texts
import { FreestyleText } from "../../../controls/text/freestyle-text";
import { TextBase } from "../../../controls/text/text-base";
import { TextType } from "../../../controls/text/text-type";
import { RightBottomTitleText } from "../../../controls/text/title/right-bottom-title-text";

// Buttons
import { ButtonBase } from "../../../controls/buttons/button-base";
import { BUTTON_COLORS, BUTTON_COLORS_INVERSE } from "../../../styles/button-colors";

// Interfaces
import { HTMLElementPosition } from "../../../models/html-element-position";

// Constants and Singletons
import { SOUNDS_CTRL } from "../../../controls/controllers/sounds-controller";
import { COLORS } from "../../../styles/colors";
import { noOp } from "../../../utils/no-op";
import { ProfileBase } from "../../../controls/profiles/profile-base";
import { FreestyleSquareButton } from "../../../controls/buttons/freestyle-square-button";
import { ASSETS_CTRL } from "../../../controls/controllers/assets-controller";
import { StringMapToNumber } from "../../../models/string-map-to-number";

/**
 * Border for dev purposes. Normally set to null.
 */
let border: string;

/**
 * Sets the starting position of the top left lander.
 */
const BOX_1_POSITION: [number, number, number] = [-2.25, -8, -4];

/**
 * Sets the starting position of the top right lander.
 */
const BOX_2_POSITION: [number, number, number] = [2.75, -9, -5];
 
/**
 * Sets the starting position of the first bottom left lander.
 */
const BOX_3_POSITION: [number, number, number] = [-4.675, -9, 4];
 
/**
 * Sets the starting position of the second bottom left lander.
 */
const BOX_4_POSITION: [number, number, number] = [-3.14, -9, 4];
 
/**
 * Sets the starting position of the third bottom left lander.
 */
const BOX_5_POSITION: [number, number, number] = [-1.625, -9, 4];
 
/**
 * Sets the starting position of the bottom middle left lander.
 */
const BOX_6_POSITION: [number, number, number] = [-3.14, -8, 1.9];

/**
 * Sets the starting position of the bottom right down arrow.
 */
const CONTROL_PANEL_ARROW_START_POSITION: [number, number, number] = [
    BOX_1_POSITION[0] + 4.6,
    BOX_1_POSITION[1] - 3,
    BOX_1_POSITION[2] + 7.75];

/**
 * Sets the starting position of the bottom right mouse.
 */
const CONTROL_PANEL_MOUSE_START_POSITION: [number, number, number] = [
    CONTROL_PANEL_ARROW_START_POSITION[0],
    CONTROL_PANEL_ARROW_START_POSITION[1],
    CONTROL_PANEL_ARROW_START_POSITION[2] + 1.25];

/**
 * @class
 * The help controller class - coordinates everything on the help screen.
 */
export class HelpCtrl {
    /**
     * All of the actors contained in the help screen.
     */
    private _helpActors: { [key: string]: any } = {};

    /**
     * All of the buttons contained in the help screen.
     */
    private _helpButtons: { [key: string]: ButtonBase } = {};

    /**
     * All of the counters, and counter clearing threasholds.
     */
    private _helpCounters: StringMapToNumber = {
        controlPanel: 0,
        controlPanelClear: 1230
    };

    /**
     * All of the meshes contained in the help screen.
     */
    private _helpMeshes: { [key: string]: Mesh | Object3D } = {};

    /**
     * All of the background panels contained in the help screen.
     */
    private _helpPanels: { [key: string]: PanelBase } = {};

    /**
     * The profile image contained in the help screen.
     */
    private _helpProfile: ProfileBase;

    /**
     * All of the HTML text contained in the help screen.
     */
    private _helpTexts: { [key: string]: TextBase } = {};

    /**
     * All of the textures contained in the help screen.
     */
    private _textures: { [key: string]: Texture } = {};

    /**
     * Reference to the scene, used to remove elements from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * Constructor for the HelpCtrl Class.
     * @param scene                 ThreeJS scene to add meshes to for help screen.
     * @param brdr                  dev environment brdr set in creating class.
     */
    constructor(
        scene: Scene,
        brdr: string) {
        this._scene = scene;
        border = brdr;
        this._buildHelpScreen();
    }


    /**
     * Coordinates the creation of all the help screen content.
     */
    private _buildHelpScreen(): void {
        // Get window dimmensions
        let width = window.innerWidth * 0.99;
        let height = window.innerHeight * 0.99;
        width < height ? height = width : width = height;
        const left = (((window.innerWidth * 0.99) - width) / 2);

        // Help screen backdrop
        const backingGeo = new PlaneGeometry( 15, 15, 10, 10 );
        const backingMat = new MeshBasicMaterial({
            color: 0x000000,
            opacity: 1,
            transparent: true,
            side: DoubleSide
        });
        const backingMesh = new Mesh(backingGeo, backingMat);
        backingMesh.name = 'Help Backing Mesh';
        backingMesh.rotation.set(1.5708, 0, 0);
        this._scene.add(backingMesh);
        backingMesh.visible = false;
        this._helpMeshes.mainBackground = backingMesh;

        // Help screen panels
        this._helpPanels.rightTopPanel = new RightTopPanel(this._scene);
        this._helpPanels.rightTopPanel.hide();
        this._helpPanels.leftTopPanel = new LeftTopPanel(this._scene);
        this._helpPanels.leftTopPanel.hide();
        this._helpPanels.rightTopMiddlePanel = new RightTopMiddlePanel(this._scene);
        this._helpPanels.rightTopMiddlePanel.hide();
        this._helpPanels.leftTopMiddlePanel = new LeftTopMiddlePanel(this._scene);
        this._helpPanels.leftTopMiddlePanel.hide();
        this._helpPanels.rightBottomMiddlePanel = new RightBottomMiddlePanel(this._scene);
        this._helpPanels.rightBottomMiddlePanel.hide();
        this._helpPanels.leftBottomMiddlePanel = new LeftBottomMiddlePanel(this._scene);
        this._helpPanels.leftBottomMiddlePanel.hide();
        this._helpPanels.leftBottomPanel = new LeftBottomPanel(this._scene);
        this._helpPanels.leftBottomPanel.hide();
        this._helpPanels.rightBottomPanel = new RightBottomPanel(this._scene);
        this._helpPanels.rightBottomPanel.hide();

        const arrowGeo = new PlaneGeometry( 0.5, 0.5, 10, 10 );
        const keyGeo = new PlaneGeometry( 1.1, 0.4, 10, 10 );
        const mouseGeo = new PlaneGeometry( 0.5, 0.5, 10, 10 );

        const arrowMat = new MeshBasicMaterial();
        arrowMat.map = ASSETS_CTRL.textures.arrow;
        arrowMat.map.minFilter = LinearFilter;
        (arrowMat as any).shininess = 0;
        arrowMat.transparent = true;

        const keyLeftMat = new MeshBasicMaterial();
        keyLeftMat.map = ASSETS_CTRL.textures.keysForLeft;
        keyLeftMat.map.minFilter = LinearFilter;
        (keyLeftMat as any).shininess = 0;
        keyLeftMat.transparent = true;

        const keyRightMat = new MeshBasicMaterial();
        keyRightMat.map = ASSETS_CTRL.textures.keysForRight;
        keyRightMat.map.minFilter = LinearFilter;
        (keyRightMat as any).shininess = 0;
        keyRightMat.transparent = true;

        const keyUpMat = new MeshBasicMaterial();
        keyUpMat.map = ASSETS_CTRL.textures.keysForUp;
        keyUpMat.map.minFilter = LinearFilter;
        (keyUpMat as any).shininess = 0;
        keyUpMat.transparent = true;

        const keyDownMat = new MeshBasicMaterial();
        keyDownMat.map = ASSETS_CTRL.textures.keysForDown;
        keyDownMat.map.minFilter = LinearFilter;
        (keyDownMat as any).shininess = 0;
        keyDownMat.transparent = true;

        const mouseLeftMat = new MeshBasicMaterial();
        mouseLeftMat.map = ASSETS_CTRL.textures.mouseLeft;
        mouseLeftMat.map.minFilter = LinearFilter;
        (mouseLeftMat as any).shininess = 0;
        mouseLeftMat.transparent = true;

        const mouseMat = new MeshBasicMaterial();
        mouseMat.map = ASSETS_CTRL.textures.mouse;
        mouseMat.map.minFilter = LinearFilter;
        (mouseMat as any).shininess = 0;
        mouseMat.transparent = true;

        this._buildHelpScreenControlPanel(
            arrowGeo,
            mouseGeo,
            arrowMat,
            mouseMat,
            mouseLeftMat,
            { height, left, top: null, width });
    }

    /**
     * Creates everything needed for the Control Panel panel.
     * @param arrowGeo the geometry used to make all the arrow meshes in this panel
     * @param mouseGeo the geometry used to make all the mouse meshes in this panel
     * @param arrowMat the material used to make all the arrow meshes in this panel
     * @param mouseMat the material used to make the unpressed mouse mesh in this panel
     * @param mouseLeftMat the material used to make the left mouse mesh in this panel
     * @param position initial positioning parameters from window size
     */
    private _buildHelpScreenControlPanel(
        arrowGeo: PlaneGeometry,
        mouseGeo: PlaneGeometry,
        arrowMat: MeshBasicMaterial,
        mouseMat: MeshBasicMaterial,
        mouseLeftMat: MeshBasicMaterial,
        position: HTMLElementPosition): void {
        // Down Arrow graphics
        const arrowDown = new Mesh(arrowGeo, arrowMat);
        arrowDown.position.set(CONTROL_PANEL_ARROW_START_POSITION[0], CONTROL_PANEL_ARROW_START_POSITION[1], CONTROL_PANEL_ARROW_START_POSITION[2]);
        arrowDown.rotation.set(-1.5708, 0, -1.5708);
        this._scene.add(arrowDown);
        arrowDown.visible = false;
        this._helpMeshes.arrowDownControlPanel = arrowDown;

        // Mouse Left Button graphics
        const mouseLeft = new Mesh(mouseGeo, mouseLeftMat);
        mouseLeft.position.set(CONTROL_PANEL_MOUSE_START_POSITION[0], CONTROL_PANEL_MOUSE_START_POSITION[1], CONTROL_PANEL_MOUSE_START_POSITION[2]);
        mouseLeft.rotation.set(-1.7708, 0, 0);
        this._scene.add(mouseLeft);
        mouseLeft.visible = false;
        this._helpMeshes.mouseLeftControlPanel = mouseLeft;

        // Mouse Unpressed graphics
        const mouse = new Mesh(mouseGeo, mouseMat);
        mouse.position.set(CONTROL_PANEL_MOUSE_START_POSITION[0], CONTROL_PANEL_MOUSE_START_POSITION[1], CONTROL_PANEL_MOUSE_START_POSITION[2]);
        mouse.rotation.set(-1.5708, 0, 0);
        this._scene.add(mouse);
        mouse.visible = false;
        this._helpMeshes.mouseControlPanel = mouse;

        this._helpButtons.exitHelpButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.784 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS,
            noOp,
            false,
            'fa-sign-out',
            0.5);

        this._helpButtons.exitHelpPressedButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.784 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS_INVERSE,
            noOp,
            false,
            'fa-sign-out',
            0.5);

        this._helpButtons.exitSettingsButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.75 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS,
            noOp,
            false,
            'fa-sign-out',
            0.5);

        this._helpButtons.exitSettingsPressedButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.75 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS_INVERSE,
            noOp,
            false,
            'fa-sign-out',
            0.5);

        this._helpButtons.helpButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.784 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS,
            noOp,
            false,
            'fa-question',
            0.5);

        this._helpButtons.helpPressedButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.784 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS_INVERSE,
            noOp,
            false,
            'fa-question',
            0.5);

        this._helpButtons.settingsButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.75 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS,
            noOp,
            false,
            'fa-gear',
            0.5);

        this._helpButtons.settingsPressedButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.75 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS_INVERSE,
            noOp,
            false,
            'fa-gear',
            0.5);

        this._helpButtons.soundMuffledButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.716 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS,
            () => {},
            false,
            'fa-volume-down',
            0.5);

        this._helpButtons.soundMuffledPressedButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.716 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS_INVERSE,
            () => {},
            false,
            'fa-volume-down',
            0.5);

        this._helpButtons.soundOffButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.716 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS,
            noOp,
            false,
            'fa-volume-off',
            0.5);

        this._helpButtons.soundOffPressedButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.716 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS_INVERSE,
            noOp,
            false,
            'fa-volume-off',
            0.5);

        this._helpButtons.soundOnButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.716 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS,
            noOp,
            false,
            'fa-volume-up',
            0.5);

        this._helpButtons.soundOnPressedButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.716 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS_INVERSE,
            noOp,
            false,
            'fa-volume-up',
            0.5);

        this._helpButtons.pauseButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.682 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS,
            noOp,
            false,
            'fa-pause',
            0.5);

        this._helpButtons.pausePressedButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.682 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS_INVERSE,
            noOp,
            false,
            'fa-pause',
            0.5);

        this._helpButtons.playButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.682 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS,
            noOp,
            false,
            'fa-play',
            0.5);

        this._helpButtons.playPressedButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.682 * position.width), top: ( 0.85 * position.height), width: position.width },
            BUTTON_COLORS_INVERSE,
            noOp,
            false,
            'fa-play',
            0.5);

        // Control Panel Game Paused Text graphics
        this._helpTexts.controlPanelGamePaused = new FreestyleText(
            'Game paused',
            {
                height: position.height,
                left: (position.left + position.width - (0.49 * position.width)),
                top: (0.96 * position.height),
                width: position.width
            },
            COLORS.neutral,
            border,
            TextType.STATIC,
            0.015,
            0);
        this._helpTexts.controlPanelGamePaused.hide();

        // Control Panel Game In Play Text graphics
        this._helpTexts.controlPanelGameInPlay = new FreestyleText(
            'Game in play',
            {
                height: position.height,
                left: (position.left + position.width - (0.49 * position.width)),
                top: (0.96 * position.height),
                width: position.width
            },
            COLORS.highlighted,
            border,
            TextType.STATIC,
            0.015,
            0);
        this._helpTexts.controlPanelGameInPlay.hide();

        // Control Panel Sound On Text graphics
        this._helpTexts.controlPanelSoundOn = new FreestyleText(
            'Sound On',
            {
                height: position.height,
                left: (position.left + position.width - (0.3 * position.width)),
                top: (0.96 * position.height),
                width: position.width
            },
            COLORS.neutral,
            border,
            TextType.STATIC,
            0.015,
            0);
        this._helpTexts.controlPanelSoundOn.hide();

        // Control Panel Sound Off Text graphics
        this._helpTexts.controlPanelSoundOff = new FreestyleText(
            'Sound Off',
            {
                height: position.height,
                left: (position.left + position.width - (0.3 * position.width)),
                top: (0.96 * position.height),
                width: position.width
            },
            COLORS.neutral,
            border,
            TextType.STATIC,
            0.015,
            0);
        this._helpTexts.controlPanelSoundOff.hide();

        // Control Panel Sound Muffled Text graphics
        this._helpTexts.controlPanelSoundMuffled = new FreestyleText(
            'Sound Low',
            {
                height: position.height,
                left: (position.left + position.width - (0.3 * position.width)),
                top: (0.96 * position.height),
                width: position.width
            },
            COLORS.neutral,
            border,
            TextType.STATIC,
            0.015,
            0);
        this._helpTexts.controlPanelSoundMuffled.hide();

        // Control Panel In-Game Mode Text graphics
        this._helpTexts.controlPanelInGameMode = new FreestyleText(
            'In-Game Mode',
            {
                height: position.height,
                left: (position.left + position.width - (0.15 * position.width)),
                top: (0.85 * position.height),
                width: position.width
            },
            COLORS.neutral,
            border,
            TextType.STATIC,
            0.015,
            0,
            'right');
        this._helpTexts.controlPanelInGameMode.hide();

        // Control Panel Settings Mode Text graphics
        this._helpTexts.controlPanelSettingsMode = new FreestyleText(
            'Settings Mode',
            {
                height: position.height,
                left: (position.left + position.width - (0.15 * position.width)),
                top: (0.85 * position.height),
                width: position.width
            },
            COLORS.neutral,
            border,
            TextType.STATIC,
            0.015,
            0,
            'right');
        this._helpTexts.controlPanelSettingsMode.hide();

        // Control Panel Help Mode Text graphics
        this._helpTexts.controlPanelHelpMode = new FreestyleText(
            'Help Mode',
            {
                height: position.height,
                left: (position.left + position.width - (0.15 * position.width)),
                top: (0.85 * position.height),
                width: position.width
            },
            COLORS.neutral,
            border,
            TextType.STATIC,
            0.015,
            0,
            'right');
        this._helpTexts.controlPanelHelpMode.hide();

        // Control Panel Text graphics
        this._helpTexts.controlPanelTitle = new RightBottomTitleText(
            'Control Panel',
            position,
            COLORS.neutral,
            border,
            TextType.STATIC);
        this._helpTexts.controlPanelTitle.hide();
    }

    /**
     * Calls the next frame in the animation cycle specific to lower-right panel - Control Panel.
     */
    private _endCycleControlPanel(): void {
        if (this._helpCounters.controlPanel > this._helpCounters.controlPanelClear) {
            this._helpCounters.controlPanel = 0;
            this._helpMeshes.arrowDownControlPanel.position.set(CONTROL_PANEL_ARROW_START_POSITION[0], CONTROL_PANEL_ARROW_START_POSITION[1], CONTROL_PANEL_ARROW_START_POSITION[2]);
            this._helpMeshes.mouseControlPanel.position.set(CONTROL_PANEL_MOUSE_START_POSITION[0], CONTROL_PANEL_MOUSE_START_POSITION[1], CONTROL_PANEL_MOUSE_START_POSITION[2]);
            this._helpMeshes.mouseLeftControlPanel.position.set(CONTROL_PANEL_MOUSE_START_POSITION[0], CONTROL_PANEL_MOUSE_START_POSITION[1], CONTROL_PANEL_MOUSE_START_POSITION[2]);
            this._helpMeshes.mouseControlPanel.visible = true;
            this._helpMeshes.mouseLeftControlPanel.visible = false;
        }

        this._helpButtons.helpButton.hide();
        this._helpButtons.settingsButton.hide();
        this._helpButtons.soundOnButton.hide();
        this._helpButtons.pauseButton.hide();
        this._helpButtons.exitHelpButton.hide();
        this._helpButtons.exitHelpPressedButton.hide();
        this._helpButtons.exitSettingsButton.hide();
        this._helpButtons.exitSettingsPressedButton.hide();
        this._helpButtons.helpButton.hide();
        this._helpButtons.helpPressedButton.hide();
        this._helpButtons.settingsButton.hide();
        this._helpButtons.settingsPressedButton.hide();
        this._helpButtons.soundOffButton.hide();
        this._helpButtons.soundOffPressedButton.hide();
        this._helpButtons.soundMuffledButton.hide();
        this._helpButtons.soundMuffledPressedButton.hide();
        this._helpButtons.soundOnButton.hide();
        this._helpButtons.soundOnPressedButton.hide();
        this._helpButtons.pauseButton.hide();
        this._helpButtons.pausePressedButton.hide();
        this._helpButtons.playButton.hide();
        this._helpButtons.playPressedButton.hide();
        this._helpTexts.controlPanelGamePaused.hide();
        this._helpTexts.controlPanelGameInPlay.hide();
        this._helpTexts.controlPanelSoundOn.hide();
        this._helpTexts.controlPanelSoundOff.hide();
        this._helpTexts.controlPanelSoundMuffled.hide();
        this._helpTexts.controlPanelInGameMode.hide();
        this._helpTexts.controlPanelSettingsMode.hide();
        this._helpTexts.controlPanelHelpMode.hide();
        this._helpMeshes.mouseControlPanel.visible = false;
        this._helpMeshes.mouseLeftControlPanel.visible = false;

        if (this._helpCounters.controlPanel < 60) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 90) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pausePressedButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseLeftControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 150) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.playButton.show();
            this._helpTexts.controlPanelGamePaused.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 180) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.playPressedButton.show();
            this._helpTexts.controlPanelGamePaused.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseLeftControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 240) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 300) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            const currArrowPos = this._helpMeshes.arrowDownControlPanel.position;
            this._helpMeshes.arrowDownControlPanel.position.set(currArrowPos.x + 0.007, currArrowPos.y, currArrowPos.z);
            const currMousePos = this._helpMeshes.mouseControlPanel.position;
            this._helpMeshes.mouseControlPanel.position.set(currMousePos.x + 0.007, currMousePos.y, currMousePos.z);
            this._helpMeshes.mouseLeftControlPanel.position.set(currMousePos.x + 0.007, currMousePos.y, currMousePos.z);
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 360) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 390) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnPressedButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseLeftControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 450) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOffButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOff.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 480) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOffPressedButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOff.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseLeftControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 540) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundMuffledButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundMuffled.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 570) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundMuffledPressedButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundMuffled.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseLeftControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 630) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 690) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelInGameMode.show();
            const currArrowPos = this._helpMeshes.arrowDownControlPanel.position;
            this._helpMeshes.arrowDownControlPanel.position.set(currArrowPos.x + 0.007, currArrowPos.y, currArrowPos.z);
            const currMousePos = this._helpMeshes.mouseControlPanel.position;
            this._helpMeshes.mouseControlPanel.position.set(currMousePos.x + 0.007, currMousePos.y, currMousePos.z);
            this._helpMeshes.mouseLeftControlPanel.position.set(currMousePos.x + 0.007, currMousePos.y, currMousePos.z);
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 750) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 780) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsPressedButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseLeftControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 840) {
            this._helpButtons.helpButton.show();
            this._helpButtons.exitSettingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelGamePaused.show();
            this._helpTexts.controlPanelSettingsMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 870) {
            this._helpButtons.helpButton.show();
            this._helpButtons.exitSettingsPressedButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGamePaused.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelSettingsMode.show();
            this._helpMeshes.mouseLeftControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 930) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 990) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            const currArrowPos = this._helpMeshes.arrowDownControlPanel.position;
            this._helpMeshes.arrowDownControlPanel.position.set(currArrowPos.x + 0.007, currArrowPos.y, currArrowPos.z);
            const currMousePos = this._helpMeshes.mouseControlPanel.position;
            this._helpMeshes.mouseControlPanel.position.set(currMousePos.x + 0.007, currMousePos.y, currMousePos.z);
            this._helpMeshes.mouseLeftControlPanel.position.set(currMousePos.x + 0.007, currMousePos.y, currMousePos.z);
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 1050) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 1080) {
            this._helpButtons.helpPressedButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseLeftControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 1140) {
            this._helpButtons.exitHelpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGamePaused.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelHelpMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel < 1170) {
            this._helpButtons.exitHelpPressedButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGamePaused.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelHelpMode.show();
            this._helpMeshes.mouseLeftControlPanel.visible = true;
        } else if (this._helpCounters.controlPanel <= 1230) {
            this._helpButtons.helpButton.show();
            this._helpButtons.settingsButton.show();
            this._helpButtons.soundOnButton.show();
            this._helpButtons.pauseButton.show();
            this._helpTexts.controlPanelGameInPlay.show();
            this._helpTexts.controlPanelSoundOn.show();
            this._helpTexts.controlPanelInGameMode.show();
            this._helpMeshes.mouseControlPanel.visible = true;
        }

        this._helpCounters.controlPanel++;
    }

    /**
     * Removes anything that might stick around after Help Controller is destroyed.
     */
    public dispose(): void {
        Object.keys(this._helpTexts)
            .filter(key => !!this._helpTexts[key])
            .forEach(key => this._helpTexts[key].dispose());

        Object.keys(this._helpButtons)
            .filter(key => !!this._helpButtons[key])
            .forEach(key => this._helpButtons[key].dispose());
    }

    /**
     * Calls the next frame in the animation cycle.
     */
    public endCycle(): void {
        SOUNDS_CTRL.pauseSound();

        this._endCycleControlPanel();
    }

    /**
     * Sets all help content to be hidden.
     */
    public hide(): void {
        // Shared
        this._helpMeshes.mainBackground.visible = false;
        Object.values(this._helpPanels).forEach(p => p && p.hide());

        // Control Panel
        this._helpCounters.controlPanel = 0;
        this._helpTexts.controlPanelTitle.hide();
        this._helpMeshes.arrowDownControlPanel.visible = false;
        this._helpMeshes.arrowDownControlPanel.position.set(CONTROL_PANEL_ARROW_START_POSITION[0], CONTROL_PANEL_ARROW_START_POSITION[1], CONTROL_PANEL_ARROW_START_POSITION[2]);
        this._helpMeshes.mouseControlPanel.visible = false;
        this._helpMeshes.mouseControlPanel.position.set(CONTROL_PANEL_MOUSE_START_POSITION[0], CONTROL_PANEL_MOUSE_START_POSITION[1], CONTROL_PANEL_MOUSE_START_POSITION[2]);
        this._helpMeshes.mouseLeftControlPanel.visible = false;
        this._helpMeshes.mouseLeftControlPanel.position.set(CONTROL_PANEL_MOUSE_START_POSITION[0], CONTROL_PANEL_MOUSE_START_POSITION[1], CONTROL_PANEL_MOUSE_START_POSITION[2]);
        this._helpButtons.exitHelpButton.hide();
        this._helpButtons.exitHelpPressedButton.hide();
        this._helpButtons.exitSettingsButton.hide();
        this._helpButtons.exitSettingsPressedButton.hide();
        this._helpButtons.helpButton.hide();
        this._helpButtons.helpPressedButton.hide();
        this._helpButtons.settingsButton.hide();
        this._helpButtons.settingsPressedButton.hide();
        this._helpButtons.soundOffButton.hide();
        this._helpButtons.soundOffPressedButton.hide();
        this._helpButtons.soundMuffledButton.hide();
        this._helpButtons.soundMuffledPressedButton.hide();
        this._helpButtons.soundOnButton.hide();
        this._helpButtons.soundOnPressedButton.hide();
        this._helpButtons.pauseButton.hide();
        this._helpButtons.pausePressedButton.hide();
        this._helpButtons.playButton.hide();
        this._helpButtons.playPressedButton.hide();
        this._helpTexts.controlPanelGamePaused.hide();
        this._helpTexts.controlPanelGameInPlay.hide();
        this._helpTexts.controlPanelSoundOn.hide();
        this._helpTexts.controlPanelSoundOff.hide();
        this._helpTexts.controlPanelSoundMuffled.hide();
        this._helpTexts.controlPanelInGameMode.hide();
        this._helpTexts.controlPanelSettingsMode.hide();
        this._helpTexts.controlPanelHelpMode.hide();
    }

    /**
     * Resizes non-threejs content to the new window size.
     */
    public onWindowResize(height: number, left: number, top: number, width: number): void {
        Object.keys(this._helpTexts)
            .filter(key => !!this._helpTexts[key])
            .forEach(key => this._helpTexts[key].resize({ height, left, top, width }));

        this._helpButtons.exitHelpButton.resize({ height: height, left: left + (0.784 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.exitHelpPressedButton.resize({ height: height, left: left + (0.784 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.exitSettingsButton.resize({ height: height, left: left + (0.75 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.exitSettingsPressedButton.resize({ height: height, left: left + (0.75 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.helpButton.resize({ height: height, left: left + (0.784 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.helpPressedButton.resize({ height: height, left: left + (0.784 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.settingsButton.resize({ height: height, left: left + (0.75 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.settingsPressedButton.resize({ height: height, left: left + (0.75 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.soundOffButton.resize({ height: height, left: left + (0.716 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.soundOffPressedButton.resize({ height: height, left: left + (0.716 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.soundMuffledButton.resize({ height: height, left: left + (0.716 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.soundMuffledPressedButton.resize({ height: height, left: left + (0.716 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.soundOnButton.resize({ height: height, left: left + (0.716 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.soundOnPressedButton.resize({ height: height, left: left + (0.716 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.pauseButton.resize({ height: height, left: left + (0.682 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.pausePressedButton.resize({ height: height, left: left + (0.682 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.playButton.resize({ height: height, left: left + (0.682 * width), top: ( 0.85 * height), width: width });
        this._helpButtons.playPressedButton.resize({ height: height, left: left + (0.682 * width), top: ( 0.85 * height), width: width });
        this._helpTexts.controlPanelGamePaused.resize({ height: height, left: (left + width - (0.49 * width)), top: ( 0.96 * height), width: width });
        this._helpTexts.controlPanelGameInPlay.resize({ height: height, left: (left + width - (0.49 * width)), top: ( 0.96 * height), width: width });
        this._helpTexts.controlPanelSoundOn.resize({ height: height, left: (left + width - (0.3 * width)), top: ( 0.96 * height), width: width });
        this._helpTexts.controlPanelSoundOff.resize({ height: height, left: (left + width - (0.3 * width)), top: ( 0.96 * height), width: width });
        this._helpTexts.controlPanelSoundMuffled.resize({ height: height, left: (left + width - (0.3 * width)), top: ( 0.96 * height), width: width });
        this._helpTexts.controlPanelInGameMode.resize({ height: height, left: (left + width - (0.15 * width)), top: ( 0.85 * height), width: width });
        this._helpTexts.controlPanelSettingsMode.resize({ height: height, left: (left + width - (0.15 * width)), top: ( 0.85 * height), width: width });
        this._helpTexts.controlPanelHelpMode.resize({ height: height, left: (left + width - (0.15 * width)), top: ( 0.85 * height), width: width });
    }

    /**
     * Sets all help content to visible, and to start initialized.
     */
    public show(): void {
        // Shared
        this._helpMeshes.mainBackground.visible = true;
        Object.values(this._helpPanels).forEach(p => p && p.show());

        // Control Panel
        this._helpTexts.controlPanelTitle.show();
        this._helpMeshes.arrowDownControlPanel.visible = true;
        this._helpMeshes.mouseControlPanel.visible = true;
        this._helpMeshes.mouseLeftControlPanel.visible = false;
        this._helpButtons.helpButton.show();
        this._helpButtons.settingsButton.show();
        this._helpButtons.soundOnButton.show();
        this._helpButtons.pauseButton.show();
    }
}