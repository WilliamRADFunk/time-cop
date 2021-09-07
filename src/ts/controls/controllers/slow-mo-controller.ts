import {
    Color,
    Font,
    Mesh,
    MeshLambertMaterial,
    MeshStandardMaterial,
    Scene,
    SphereGeometry,
    SphericalReflectionMapping,
    TextGeometry
} from "three";
import { ASSETS_CTRL } from "./assets-controller";

export class SlowMoCtrl {
    /**
     * Color of the slow motion countdown text.
     */
    private _color: Color;

    /**
     * Player chosen difficulty level.
     */
    private _difficulty: number = 3;

    /**
     * Font to use for the slow motion countdown text.
     */
    private _font: Font;

    /**
     * Flag to signal when game is in Slow Motion mode.
     */
    private _isSlowMo: boolean = false;

    /**
     * Reference to the scene, used to remove elements from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * Frame counter to track remaining number of frames to be within slow motion mode.
     */
    private _slowMoCounter: number = 0;

    /**
     * Controls size and shape of the slow motion count label.
     */
    private _slowMoCountLabelGeometry: TextGeometry;

    /**
     * Controls the overall rendering of the slow motion count label.
     */
    private _slowMoCountLabel: Mesh;

    /**
     * Controls size and shape of the slow motion count text.
     */
    private _slowMoCountTextGeometry: TextGeometry;

    /**
     * Controls the color of the slow motion count text material.
     */
    private _slowMoCountTextMaterial: MeshLambertMaterial;

    /**
     * Controls the overall rendering of the slow motion count text.
     */
    private _slowMoCountText: Mesh;
    
    /**
     * Controls size and shape of the time bubble.
     */
     private _timeBubbleGeometry: SphereGeometry;

     /**
      * Controls the color of the time bubble material
      */
     private _timeBubbleMaterial: MeshStandardMaterial;

     /**
      * Controls the overall rendering of the time bubble.
      */
     private _timeBubble: Mesh;

    constructor() {}
    
    /**
     * Creates the text in one place to obey the DRY rule.
     * @param count number of seconds let in slow motion to display to player.
     */
     private _createSlowMoCountTextText(count: number): void {
        // Only remove slow motion count text if it was added before.
        if (this._slowMoCountText) {
            this._scene.remove(this._slowMoCountText);
            this._slowMoCountText = null;
        }

        // Only remove slow motion count label if it was added before.
        if (this._slowMoCountLabel) {
            this._scene.remove(this._slowMoCountLabel);
            this._slowMoCountLabel = null;
        }

        // Added before or not, make a new one and add it.
        // Sadly TextGeometries must be removed and added whenever the text content changes.
        const fontSize = 3;
        this._slowMoCountTextGeometry = new TextGeometry(count + "",
            {
                font: this._font,
                size: fontSize,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelSegments: 3
            });
        this._slowMoCountText = new Mesh( this._slowMoCountTextGeometry, this._slowMoCountTextMaterial );
        this._slowMoCountText.position.x = -1 * (fontSize / 4);
        this._slowMoCountText.position.y = -2;
        this._slowMoCountText.position.z = (fontSize / 4);
        this._slowMoCountText.rotation.x = -1.5708;
        this._scene.add(this._slowMoCountText);

        // Added before or not, make a new one and add it.
        // Sadly TextGeometries must be removed and added whenever the text content changes.
        this._slowMoCountLabelGeometry = new TextGeometry("Time Slowed",
            {
                font: this._font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelSegments: 3
            });
        this._slowMoCountLabel = new Mesh( this._slowMoCountLabelGeometry, this._slowMoCountTextMaterial );
        this._slowMoCountLabel.position.x = -2;
        this._slowMoCountLabel.position.y = -2;
        this._slowMoCountLabel.position.z = -3.25;
        this._slowMoCountLabel.rotation.x = -1.5708;
        this._scene.add(this._slowMoCountLabel);
    }

    private _setCounter(): void {
        this._slowMoCounter = (5 - this._difficulty) * 180;
    }

    public endCycle(playerPosition: number[]): void {
        if (this._slowMoCounter) {
            this._slowMoCounter--;

            this._timeBubble.position.set(playerPosition[0], -10, playerPosition[1]);

            if (this._slowMoCounter <= 0) {
                this.exitSlowMo();
                this._slowMoCounter = 0;
                this._slowMoCountText && this._scene.remove(this._slowMoCountText);
                this._slowMoCountText = null;
                
                this._slowMoCountLabel && this._scene.remove(this._slowMoCountLabel);
                this._slowMoCountLabel = null;

                this._timeBubble.visible = false;
                return;
            }

            if (this._slowMoCounter % 60 === 0) {
                this._createSlowMoCountTextText(Math.ceil(this._slowMoCounter / 60));
            }

            const currScale = this._slowMoCountText.scale;
            this._slowMoCountText.scale.set(currScale.x - 0.0166, currScale.y - 0.0166, currScale.z - 0.0166);
        }
    }

    public enterSlowMo(isBonusTime?: boolean): void {
        this._isSlowMo = true;
        if (isBonusTime) {
            this._setCounter();
            this._createSlowMoCountTextText(Math.ceil(this._slowMoCounter / 60));
            this._timeBubble.visible = true;
        }
    }

    public exitSlowMo(): void {
        this._isSlowMo = false;
        this._slowMoCounter = 0;
        this._timeBubble.visible = false;
    }

    public getBubbleCenter(): number[] {
        const pos = (this._timeBubble && this._timeBubble.position) || { x: 0, y: 0, z: 0 };
        return [pos.x, pos.z];
    }

    public getSlowMo(): boolean {
        return this._isSlowMo;
    }

    public setDifficulty(difficulty: number): void {
        this._difficulty = difficulty;
    }

    public setup(font: Font, color: Color, scene: Scene): void {
        this._font = font;
        this._color = color;
        
        this._slowMoCountTextMaterial = new MeshLambertMaterial( {color: 0xFFCC00} );
        
        // Only remove slow motion count text if it was added before.
        if (this._slowMoCountText && this._scene) {
            this._scene.remove(this._slowMoCountText);
            this._slowMoCountText = null;
        }
        
        // Only remove slow motion count label if it was added before.
        if (this._slowMoCountLabel && this._scene) {
            this._scene.remove(this._slowMoCountLabel);
            this._slowMoCountLabel = null;
        }

        this._scene = scene;

        // Creates the semi-transparent time buble over the player when in slow motion.
        if (!this._timeBubble) {
            this._timeBubbleGeometry = new SphereGeometry(1, 32, 32);
            const envMap = ASSETS_CTRL.textures.bubble;
            envMap.mapping = SphericalReflectionMapping;
            this._timeBubbleMaterial = new MeshStandardMaterial({
                color: 0x05EDFF,
                envMap: envMap,
                opacity: 0.35,
                roughness: 0,
                transparent: true
            });
            this._timeBubble = new Mesh(this._timeBubbleGeometry, this._timeBubbleMaterial);
            this._timeBubble.position.set(0, -10, 0);
            this._timeBubble.name = 'time-bubble';
            this._scene.add(this._timeBubble);

            this._timeBubble.visible = false;
        }
    }
}

export const SlowMo_Ctrl = new SlowMoCtrl();