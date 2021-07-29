import {
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Scene } from 'three';

import { Actor } from '../../../models/actor';
import { SceneType } from '../../../models/scene-type';
import { getIntersections } from '../../../utils/get-intersections';
import { SOUNDS_CTRL } from '../../../controls/controllers/sounds-controller';
import { ASSETS_CTRL } from '../../../controls/controllers/assets-controller';
import { createShip } from '../utils/create-ship';
import { Thruster } from '../utils/thruster';
import { PanelBase } from '../../../controls/panels/panel-base';
import { LeftBottomMiddlePanel } from '../../../controls/panels/left-bottom-middle-panel';
import { LeftBottomPanel } from '../../../controls/panels/left-bottom-panel';
import { LeftTopMiddlePanel } from '../../../controls/panels/left-top-middle-panel';
import { LeftTopPanel } from '../../../controls/panels/left-top-panel';
import { RightBottomMiddlePanel } from '../../../controls/panels/right-bottom-middle-panel';
import { RightBottomPanel } from '../../../controls/panels/right-bottom-panel';
import { RightTopMiddlePanel } from '../../../controls/panels/right-top-middle-panel';
import { RightTopPanel } from '../../../controls/panels/right-top-panel';
import { ProfileBase } from '../../../controls/profiles/profile-base';
import { LeftTopProfile } from '../../../controls/profiles/left-top-profile';
import { LeftTopDialogueText } from '../../../controls/text/dialogue/left-top-dialogue-text';
import { dialogues } from '../configs/dialogues';
import { TextBase } from '../../../controls/text/text-base';
import { COLORS } from '../../../styles/colors';
import { TextType } from '../../../controls/text/text-type';
import { RightTopDialogueText } from '../../../controls/text/dialogue/right-top-dialogue-text';
import { RightTopProfile } from '../../../controls/profiles/right-top-profile';

// const border: string = '1px solid #FFF';
const border: string = 'none';

// Offset position coordinates for top spaceship thruster in relation to the ship itself.
const THRUSTER1_OFFSETS = [-2.355, 1, -0.33];

// Offset position coordinates for middle spaceship thruster in relation to the ship itself.
const THRUSTER2_OFFSETS = [-2.45, 1, 0.0075];

// Offset position coordinates for bottom spaceship thruster in relation to the ship itself.
const THRUSTER3_OFFSETS = [-2.355, 1, 0.335];

// Starting frame for the first part of the cutscene.
const SCENE_PART_1_FRAME = 0;

// Starting frame for the second part of the cutscene.
const SCENE_PART_2_FRAME = SCENE_PART_1_FRAME + 120;

// Starting frame for the third part of the cutscene.
const SCENE_PART_3_FRAME = SCENE_PART_2_FRAME + 550;

// Starting frame for the fourth part of the cutscene.
const SCENE_PART_4_FRAME = SCENE_PART_3_FRAME + 570;

// Starting frame for the fifth part of the cutscene.
const SCENE_PART_5_FRAME = SCENE_PART_4_FRAME + 240;

// Starting frame for the sixth part of the cutscene.
const SCENE_PART_6_FRAME = SCENE_PART_5_FRAME + 240;

/**
 * @class
 * Cutscene to introduce the premise of the game's beginning.
 */
export class Intro {
    /**
     * List of actors in the scene.
     */
    private _actors: Actor[] = [];
    /**
     * Current frame
     */
    private _currentFrame: number = 0;

    /**
     * All of the dialogue panels
     */
    private _dialoguePanels: { [key: string]: PanelBase } = {};

    /**
     * All of the HTML text contained in the intro.
     */
    private _dialogueTexts: { [key: string]: TextBase } = {};

    /**
     * Flag to signal the scene is no longer active. Primarily used for a click event to useful during endCycle.
     */
    private _isActive: boolean = true;

    /**
     * Reference to _onWindowResize so that it can be removed later.
     */
    private _listenerRef: () => void;

    /**
     * The profile image contained in the help screen.
     */
    private _dialogueProfiles: { [key: string]: ProfileBase } = {};

    /**
     * Reference to the scene, used to remove ship from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * Reference to the Spaceship actor.
     */
    private _ship: Actor;

    /**
     * Stationary pin-pricks of light in the background.
     */
    private _stars: Mesh[] = [];

    /**
     * Reference to the top thruster for the spaceship engine.
     */
    private _thruster1: Thruster;

    /**
     * Reference to the middle thruster for the spaceship engine.
     */
    private _thruster2: Thruster;

    /**
     * Reference to the bottom thruster for the spaceship engine.
     */
    private _thruster3: Thruster;

    /**
     * Positions mods to adjust objects quickly to give shaking sensation.
     */
    private _warblePositions: [number, number][] = [
        [0.01, 0.01],
        [-0.01, -0.01],
        [0.01, -0.01],
        [-0.01, 0.01],
        [0.01, 0.01],
        [-0.01, -0.01],
        [0.01, -0.01],
        [-0.01, 0.01],
        [0.01, 0.01],
        [-0.01, -0.01],
        [0.01, -0.01],
        [-0.01, 0.01],
        [0.01, 0.01],
        [-0.01, -0.01],
        [0.01, -0.01],
        [-0.01, 0.01]
    ];

    /**
     * Stationary stars stretched out into lines to simulate light speeds.
     */
    private _warpedStars: Mesh[] = [];

    /**
     * Constructor for the Intro (Scene) class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    constructor(scene: SceneType) {
        this._scene = scene.scene;

        document.oncontextmenu = event => {
            return false;
        };

        this._onInitialize(scene);

        this._onWindowResize();
        this._listenerRef = this._onWindowResize.bind(this);
        window.addEventListener('resize', this._listenerRef, false);

    }

    /**
     * Calculates the next point in the ship's path.
     * @param actor the actor about to be moved to the next point on its trajectory.
     */
    private _calculateNextPoint(actor: Actor): void {
        actor.distanceTraveled += actor.moveSpeed;
        // (xt, yt) = ( ( (1 − t) * x0 + t * x1 ), ( (1 − t) * y0 + t * y1) )
        const t = actor.distanceTraveled / actor.totalDistance;
        actor.currentPoint[0] = ((1 - t) * actor.originalStartingPoint[0]) + (t * actor.endingPoint[0]);
        actor.currentPoint[1] = ((1 - t) * actor.originalStartingPoint[1]) + (t * actor.endingPoint[1]);
    }

    /**
     * Creates the location, size, and mesh for each of the stars in the background.
     */
    private _createStars(): void {
        const material = new MeshBasicMaterial( {color: 0xFFFFFF, opacity: 1, transparent: false, side: DoubleSide} );
        for (let i = 0; i < 500; i++) {
            const mag = (Math.floor(Math.random() * 3) + 1) / 100;
            const geometry = new PlaneGeometry(mag, mag, 0.01, 0.01);
            const isXNeg = Math.random() < 0.5 ? -1 : 1;
            const isZNeg = Math.random() < 0.5 ? -1 : 1;
            const xCoord = Math.random() * 7;
            const zCoord = Math.random() * 7;
            const mesh = new Mesh( geometry, material );
            mesh.position.set((isXNeg * xCoord), 5, (isZNeg * zCoord));
            mesh.rotation.set(1.5708, 0, 0);
            mesh.name = `Star-${i}`;
            this._scene.add(mesh);
            this._stars[i] = mesh;
        }

        for (let j = 0; j < this._stars.length / 2; j++) {
            const mag = Math.random() + 0.2;
            const warpedGeometry = new PlaneGeometry(mag, 0.02, 1, 1);
            const mesh = new Mesh( warpedGeometry, material );
            mesh.position.set(this._stars[j].position.x, 5, this._stars[j].position.z);
            mesh.rotation.set(1.5708, 0, 0);
            mesh.name = `Warped-Star-${j}`;
            this._scene.add(mesh);
            mesh.visible = false;
            this._warpedStars[j] = mesh;
        }
    }
    

    /**
     * Creates all of the elements and user event listeners for the first time on scene creation.
     */
    private _onInitialize(sceneType: SceneType): void {
        // Get window dimmensions
        let width = window.innerWidth * 0.99;
        let height = window.innerHeight * 0.99;
        width < height ? height = width : width = height;
        const left = (((window.innerWidth * 0.99) - width) / 2);

        // Panels
        this._dialoguePanels.rightTopPanel = new RightTopPanel(this._scene);
        this._dialoguePanels.rightTopPanel.hide();
        this._dialoguePanels.leftTopPanel = new LeftTopPanel(this._scene);
        this._dialoguePanels.leftTopPanel.hide();
        this._dialoguePanels.rightTopMiddlePanel = new RightTopMiddlePanel(this._scene);
        this._dialoguePanels.rightTopMiddlePanel.hide();
        this._dialoguePanels.leftTopMiddlePanel = new LeftTopMiddlePanel(this._scene);
        this._dialoguePanels.leftTopMiddlePanel.hide();
        this._dialoguePanels.rightBottomMiddlePanel = new RightBottomMiddlePanel(this._scene);
        this._dialoguePanels.rightBottomMiddlePanel.hide();
        this._dialoguePanels.leftBottomMiddlePanel = new LeftBottomMiddlePanel(this._scene);
        this._dialoguePanels.leftBottomMiddlePanel.hide();
        this._dialoguePanels.leftBottomPanel = new LeftBottomPanel(this._scene);
        this._dialoguePanels.leftBottomPanel.hide();
        this._dialoguePanels.rightBottomPanel = new RightBottomPanel(this._scene);
        this._dialoguePanels.rightBottomPanel.hide();

        // Profile Images
        this._dialogueProfiles.captain = new LeftTopProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, true);
        this._dialogueProfiles.captain.hide();
        this._dialogueProfiles.commsOfficer = new RightTopProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, true);
        this._dialogueProfiles.commsOfficer.hide();
        
        // Dialogue Text graphics
        this._dialogueTexts.leftTopDialogue = new LeftTopDialogueText(
            ' ',
            { height, left, top: null, width },
            COLORS.neutral,
            border,
            TextType.DIALOGUE);
        this._dialogueTexts.leftTopDialogue.hide();
        this._dialogueTexts.rightTopDialogue = new RightTopDialogueText(
            ' ',
            { height, left, top: null, width },
            COLORS.neutral,
            border,
            TextType.DIALOGUE);
        this._dialogueTexts.rightTopDialogue.hide();


        this._createStars();
        this._ship = createShip();
        this._scene.add(this._ship.mesh);
        const shipPos = this._ship.mesh.position;
        this._thruster1 = new Thruster(this._scene, [shipPos.x + THRUSTER1_OFFSETS[0], shipPos.y + THRUSTER1_OFFSETS[1], shipPos.z + THRUSTER1_OFFSETS[2]], 0.9);
        this._thruster2 = new Thruster(this._scene, [shipPos.x + THRUSTER2_OFFSETS[0], shipPos.y + THRUSTER2_OFFSETS[1], shipPos.z + THRUSTER2_OFFSETS[2]]);
        this._thruster3 = new Thruster(this._scene, [shipPos.x + THRUSTER3_OFFSETS[0], shipPos.y + THRUSTER3_OFFSETS[1], shipPos.z + THRUSTER3_OFFSETS[2]], 0.9);

        // DOM Events
        const container = document.getElementById('mainview');
        document.onclick = event => {
            event.preventDefault();
            // Detection for player clicked on pause button
            getIntersections(event, document.getElementById('mainview'), sceneType)
                .filter(el => el.object.name === 'Click Barrier')
                .forEach(el => {
                    SOUNDS_CTRL.playBidooo();
                    this._isActive = false;
                });
        };
    }

    private _onWindowResize(): void {
        let WIDTH = window.innerWidth * 0.99;
        let HEIGHT = window.innerHeight * 0.99;
        if ( WIDTH < HEIGHT ) {
            HEIGHT = WIDTH;
        } else {
            WIDTH = HEIGHT;
        }
        const left = (((window.innerWidth * 0.99) - WIDTH) / 2);
        const width = WIDTH;
        const height = HEIGHT;

        this._dialogueTexts.leftTopDialogue.resize({ height, left, top: null, width });
        this._dialogueTexts.rightTopDialogue.resize({ height, left, top: null, width });
    };

    /**
     * Spins object at its set rate.
     * @param actor portion of the into scene to rotate.
     */
    private _rotate(actor: Actor): void {
        const twoPi = 2 * Math.PI;
        actor.currentRotation += actor.rotateSpeed;
        if (actor.currentRotation >= twoPi) {
            actor.currentRotation -= twoPi
        }
        actor.mesh.rotation.set(0, actor.currentRotation, 0);
    }

    /**
     * Calculates total distance to travel between two points and calculates first step.
     * @param actorIndex index of actor in the actor array.
     * @param x1 starting x coordinate
     * @param z1 starting z coordinate
     * @param x2 destination x coordinate
     * @param z2 destination z coordinate
     * @param speed amount of space to cover per frame.
     */
    private _setDestination(actorIndex: number, x1: number, z1: number, x2: number, z2: number, speed: number): void {
        const actor = this._actors[actorIndex];
        actor.moveSpeed = speed;
        actor.originalStartingPoint[0] = x1;
        actor.currentPoint[0] = x1;
        actor.originalStartingPoint[1] = z1;
        actor.currentPoint[1] = z1;
        actor.endingPoint = [x2, z2];
        actor.totalDistance = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((z2 - z1) * (z2 - z1)));
        actor.distanceTraveled = 0;
        // Calculates the first (second vertices) point.
        this._calculateNextPoint(actor);
        actor.inMotion = true;
    }

    /**
     * Removes any attached DOM elements, event listeners, or anything separate from ThreeJS
     */
    public dispose(): void {
        document.onmousemove = () => {};
        document.onclick = () => {};
        document.oncontextmenu = () => {};
        // document.getElementById('intro-screen-sequence-texts').remove();
        window.removeEventListener( 'resize', this._listenerRef, false);
    }

    /**
     * At the end of each loop iteration, move the scene by one frame.
     * @returns whether or not the intro is done. TRUE intro is finished | FALSE it is not finished.
     */
    public endCycle(): boolean {
        // Through user action, the scene has ended.
        if (!this._isActive) {
            return true;
        }
    
        this._currentFrame++;

        // Moving pin-pricks of light in the background.
        let starsInMotion = false;
        // Stars stretched out into lines to simulate light speeds and moving from right to left.
        let warpedStarsInMotion = false;
        // Whether to have thrusters showing.
        let enginesOn = false;

        const shipPos = this._ship.mesh.position;
        if (this._currentFrame < SCENE_PART_2_FRAME) {
            // Engines
            enginesOn = true;
            // Stars
            starsInMotion = true;
            warpedStarsInMotion = false;
            // Panels
            this._dialoguePanels.rightTopPanel.hide();
            this._dialoguePanels.leftTopPanel.hide();
            this._dialoguePanels.rightTopMiddlePanel.hide();
            this._dialoguePanels.leftTopMiddlePanel.hide();
            this._dialoguePanels.rightBottomMiddlePanel.hide();
            this._dialoguePanels.leftBottomMiddlePanel.hide();
            this._dialoguePanels.leftBottomPanel.hide();
            this._dialoguePanels.rightBottomPanel.hide();
            // Profiles
            this._dialogueProfiles.captain.hide();
            // Text
            this._dialogueTexts.leftTopDialogue.hide();
        } else if (this._currentFrame === SCENE_PART_2_FRAME) {
            // Engines
            enginesOn = true;
            // Stars
            starsInMotion = true;
            warpedStarsInMotion = false;
            // Panels
            this._dialoguePanels.leftTopPanel.show();
            // Profiles
            this._dialogueProfiles.captain.show();
            // Text
            this._dialogueTexts.leftTopDialogue.update(dialogues['CaptainsLogIntro1'], true);
            this._dialogueTexts.leftTopDialogue.show();
        } else if (this._currentFrame < SCENE_PART_3_FRAME) {
            // Engines
            enginesOn = true;
            // Stars
            starsInMotion = true;
            warpedStarsInMotion = false;
        } else if (this._currentFrame === SCENE_PART_3_FRAME) {
            // Engines
            enginesOn = true;
            // Stars
            starsInMotion = true;
            warpedStarsInMotion = false;
            // Text
            this._dialogueTexts.leftTopDialogue.update(dialogues['CaptainsLogIntro2'], true);
        } else if (this._currentFrame < SCENE_PART_4_FRAME) {
            // Engines
            enginesOn = true;
            // Stars
            starsInMotion = true;
            warpedStarsInMotion = false;
        } else if (this._currentFrame === SCENE_PART_4_FRAME) {
            // Engines
            enginesOn = true;
            // Stars
            starsInMotion = true;
            warpedStarsInMotion = false;
            // Panels
            this._dialoguePanels.rightTopPanel.show();
            // Profiles
            this._dialogueProfiles.commsOfficer.show();
            // Text
            this._dialogueTexts.rightTopDialogue.update(dialogues['CommsOfficerIntro1'], true);
            this._dialogueTexts.rightTopDialogue.show();
        } else if (this._currentFrame < SCENE_PART_5_FRAME) {
            // Engines
            enginesOn = true;
            // Stars
            starsInMotion = true;
            warpedStarsInMotion = false;
        }

        // Update dialogue texts
        this._dialogueTexts.leftTopDialogue.cycle();
        this._dialogueTexts.rightTopDialogue.cycle();

        // Handle normal thruster appearances
        this._thruster1.endCycle([shipPos.x + THRUSTER1_OFFSETS[0], shipPos.y + THRUSTER1_OFFSETS[1], shipPos.z + THRUSTER1_OFFSETS[2]], enginesOn);
        this._thruster2.endCycle([shipPos.x + THRUSTER2_OFFSETS[0], shipPos.y + THRUSTER2_OFFSETS[1], shipPos.z + THRUSTER2_OFFSETS[2]], enginesOn);
        this._thruster3.endCycle([shipPos.x + THRUSTER3_OFFSETS[0], shipPos.y + THRUSTER3_OFFSETS[1], shipPos.z + THRUSTER3_OFFSETS[2]], enginesOn);

        // Handle star movement
        if (starsInMotion) {
            const length = this._stars.length;
            this._stars.forEach((star, index) => {
                const percentile = Math.floor((index / length) * 100);
                if (percentile < 70) {
                    // Stationary
                } else if (percentile < 90) {
                    star.position.set(star.position.x - 0.0015, 5, star.position.z);
                } else {
                    star.position.set(star.position.x - 0.0025, 5, star.position.z);
                }
                if (star.position.x < -7) {
                    star.position.set(7, 5, star.position.z);
                }
            });
        }
        if (warpedStarsInMotion) {
            const length = this._warpedStars.length;
            this._warpedStars.forEach((warpedStar, index) => {
                const percentile = Math.floor((index / length) * 100);
                if (percentile < 70) {
                    // Stationary
                } else if (percentile < 90) {
                    warpedStar.position.set(warpedStar.position.x - 0.001, 5, warpedStar.position.z);
                } else {
                    warpedStar.position.set(warpedStar.position.x - 0.002, 5, warpedStar.position.z);
                }
                if (warpedStar.position.x < -7) {
                    warpedStar.position.set(7, 5, warpedStar.position.z);
                }
            });
        } 
    }
}