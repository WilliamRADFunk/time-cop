import {
    DoubleSide,
    LinearFilter,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Object3D,
    PlaneGeometry,
    Scene,
    Texture } from "three";

// Local utilities

// Panels
import { LeftBottomMiddlePanel } from "../../controls/panels/left-bottom-middle-panel";
import { LeftBottomPanel } from "../../controls/panels/left-bottom-panel";
import { LeftTopMiddlePanel } from "../../controls/panels/left-top-middle-panel";
import { LeftTopPanel } from "../../controls/panels/left-top-panel";
import { PanelBase } from "../../controls/panels/panel-base";
import { RightBottomMiddlePanel } from "../../controls/panels/right-bottom-middle-panel";
import { RightBottomPanel } from "../../controls/panels/right-bottom-panel";
import { RightTopMiddlePanel } from "../../controls/panels/right-top-middle-panel";
import { RightTopPanel } from "../../controls/panels/right-top-panel";

// HTML Texts
import { FreestyleText } from "../../controls/text/freestyle-text";
import { RightTopStatsText4 } from "../../controls/text/stats/right-top-stats-text-4";
import { TextBase } from "../../controls/text/text-base";
import { TextType } from "../../controls/text/text-type";
import { LeftBottomMiddleTitleText } from "../../controls/text/title/left-bottom-middle-title-text";
import { LeftBottomTitleText } from "../../controls/text/title/left-bottom-title-text";
import { LeftTopMiddleTitleText } from "../../controls/text/title/left-top-middle-title-text";
import { LeftTopTitleText } from "../../controls/text/title/left-top-title-text";
import { RightBottomMiddleTitleText } from "../../controls/text/title/right-bottom-middle-title-text";
import { RightBottomTitleText } from "../../controls/text/title/right-bottom-title-text";
import { RightTopMiddleTitleText } from "../../controls/text/title/right-top-middle-title-text";
import { RightTopTitleText } from "../../controls/text/title/right-top-title-text";

// Buttons
import { ButtonBase } from "../../controls/buttons/button-base";
import { BUTTON_COLORS, BUTTON_COLORS_INVERSE } from "../../styles/button-colors";

// Interfaces
import { Actor } from "../../models/actor";
import { HTMLElementPosition } from "../../models/html-element-position";

// Constants and Singletons
import { SOUNDS_CTRL } from "./sounds-controller";
import { COLORS } from "../../styles/colors";
import { colorLuminance } from "../../utils/color-shader";
import { noOp } from "../../utils/no-op";
import { Explosion } from "../../entities/explosion";
import { ReloadButton } from "../buttons/reload-button";
import { LoadButton } from "../../controls/buttons/load-button";
import { ProfileBase } from "../../controls/profiles/profile-base";
import { RightBottomMiddleProfile } from "../../controls/profiles/right-bottom-middle-profile";
import { RightBottomMiddleDialogueText } from "../../controls/text/dialogue/right-bottom-middle-dialogue-text";
import { FreestyleSquareButton } from "../../controls/buttons/freestyle-square-button";
import { SettingsPanel } from "../panels/settings-panel";

/**
 * Border for dev purposes. Normally set to null.
 */
let border: string;

/**
 * @class
 * The settings controller class - coordinates everything on the help screen.
 */
export class SettingsCtrl {

    /**
     * All of the actors contained in the settings screen.
     */
    private _settingsActors: { [key: string]: any } = {};

    /**
     * All of the buttons contained in the settings screen.
     */
    private _settingsButtons: { [key: string]: ButtonBase } = {};

    /**
     * All of the counters, and counter clearing threasholds.
     */
    private _settingsCounters: { [key: string]: number } = {
    };

    /**
     * All of the meshes contained in the settings screen.
     */
    private _settingsMeshes: { [key: string]: Mesh | Object3D } = {};

    /**
     * All of the background panels contained in the settings screen.
     */
    private _settingsPanels: { [key: string]: PanelBase } = {};

    /**
     * The profile image contained in the settings screen.
     */
    private _settingsProfile: ProfileBase;

    /**
     * All of the terrain-based meshes contained in the settings screen.
     */
    private _settingsTerrainMeshes: Mesh[] | Object3D[] = [];

    /**
     * All of the HTML text contained in the settings screen.
     */
    private _settingsTexts: { [key: string]: TextBase } = {};

    /**
     * Reference to the scene, used to remove elements from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * Constructor for the SettingsCtrl Class.
     * @param scene ThreeJS scene to add meshes to for settings screen.
     * @param brdr  dev environment brdr set in creating class.
     */
    constructor(
        scene: Scene,
        brdr: string) {
        this._scene = scene;
        border = brdr;
        this._buildSettingsScreen();
    }


    /**
     * Coordinates the creation of all the help screen content.
     */
    private _buildSettingsScreen(): void {
        // Get window dimmensions
        let width = window.innerWidth * 0.99;
        let height = window.innerHeight * 0.99;
        width < height ? height = width : width = height;
        const left = (((window.innerWidth * 0.99) - width) / 2);

        // Settings screen backdrop
        const backingGeo = new PlaneGeometry( 15, 15, 10, 10 );
        const backingMat = new MeshBasicMaterial({
            color: 0x000000,
            opacity: 1,
            transparent: true,
            side: DoubleSide
        });
        const backingMesh = new Mesh(backingGeo, backingMat);
        backingMesh.name = 'Settings Backing Mesh';
        backingMesh.rotation.set(1.5708, 0, 0);
        this._scene.add(backingMesh);
        backingMesh.visible = false;
        this._settingsMeshes.mainBackground = backingMesh;

        // Settings screen panels
        this._settingsPanels.settingsPanel = new SettingsPanel(this._scene);
        this._settingsPanels.settingsPanel.hide();
    }

    /**
     * Removes anything that might stick around after Settings Controller is destroyed.
     */
    public dispose(): void {
        Object.keys(this._settingsTexts)
            .filter(key => !!this._settingsTexts[key])
            .forEach(key => this._settingsTexts[key].dispose());

        Object.keys(this._settingsButtons)
            .filter(key => !!this._settingsButtons[key])
            .forEach(key => this._settingsButtons[key].dispose());
    }

    /**
     * Calls the next frame in the animation cycle.
     */
    public endCycle(): void {
    }

    /**
     * Sets all help content to be hidden.
     */
    public hide(): void {
        // Shared
        this._settingsMeshes.mainBackground.visible = false;
        Object.values(this._settingsPanels).forEach(p => p && p.hide());
    }

    /**
     * Resizes non-threejs content to the new window size.
     */
    public onWindowResize(height: number, left: number, top: number, width: number): void {
        Object.keys(this._settingsTexts)
            .filter(key => !!this._settingsTexts[key])
            .forEach(key => this._settingsTexts[key].resize({ height, left, top, width }));
    }

    /**
     * Sets all settings content to visible, and to start initialized.
     */
    public show(): void {
        // Shared
        this._settingsMeshes.mainBackground.visible = true;
        Object.values(this._settingsPanels).forEach(p => p && p.show());
    }
}