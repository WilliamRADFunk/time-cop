import {
    CircleGeometry,
    DoubleSide,
    Font,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Scene,
    TextGeometry,
    Texture } from 'three';

import { SoundinatorSingleton } from '../../soundinator';
import { Actor } from '../../models/actor';
import { FadableText } from '../../models/fadable-text';
import { createShip } from './actors/create-ship';
import { createShipInteriorFrame } from './actors/create-ship-interior-frame';
import { SceneType } from '../../models/scene-type';
import { getIntersections } from '../../utils/get-intersections';
import { createBoxWithRoundedEdges } from '../../utils/create-box-with-rounded-edges';
import { createProfile } from './actors/create-profile';
import { DialogueText } from '../../models/dialogue-text';

const dialogues: { [key: string]: string } = {
    '': `"Click a blue box to select<br>
 a room and assign<br>
 technology points."`,

    'Galley & Mess Hall': `"The galley prepares food<br>
 for the crew. The mess<br>
 hall is where they eat<br>
 and socialize.<br>
 &nbsp;&nbsp;Improved equipment will<br>
 help less food to feed<br>
 more. A larger mess hall<br>
 is also better for<br>
 morale."`,

    'Crew Quarters A': `"Crew quarters are<br>
 where your crew will<br>
 sleep and relax.<br>
 &nbsp;&nbsp;Larger crew quarters<br>
 allow for a higher<br>
 crew cap, and an improved<br>
 overall morale."`,

    'Crew Quarters B': `"Crew quarters are<br>
 where your crew will<br>
 sleep and relax.<br>
 &nbsp;&nbsp;Larger crew quarters<br>
 allow for a higher<br>
 crew cap, and an improved<br>
 overall morale."`,

    'Weapons Room': `"The Weapons Room stores,<br>
 loads, and fires your<br>
 ship's nukes. You can<br>
 only hold two weapon<br>
 types at a time.<br>
 &nbsp;&nbsp;Add tech points here<br>
 to extend range, blast<br>
 radius, and concussive<br>
 power."`,

    'Extended Reality Deck': `"An entire deck with<br>
 full-body haptic suits,<br>
 and wireless VR/AR<br>
 headsets.<br>
 &nbsp;&nbsp;Boosts crew morale as<br>
 the improved processing<br>
 power allows for a more<br>
 immersive experience."`,

    'Climate-Controlled Cargo Space': `"This is where your more<br>
 delicate cargo is stored.<br>
 Temperature, humidity,<br>
 and atmosphere regulated<br>
 to preserve it for longer.<br>
 &nbsp;&nbsp;Improved equipment here<br>
 increases cargo space,<br>
 and allows for a larger<br>
 variety of goods to be<br>
 stored."`,

    'Standard Cargo Space': `"This is where your more<br>
 ruggid cargo is stored.<br>
 Ores, trade goods, various<br>
 currencies, and anything<br>
 that can be left on a<br>
 shelf for long periods.<br>
 &nbsp;&nbsp;Improved equipment here<br>
 increases cargo space,<br>
 and allows for a larger<br>
 variety of goods to be<br>
 stored."`,

    'Engine Room': `"The engines don't just<br>
 use deuterium to make<br>
 the ship go. They power<br>
 everything on board.<br>
 &nbsp;&nbsp;Improvements here<br>
 increase the engine's<br>
 efficiency; to use less<br>
 fuel to achieve the same<br>
 effect."`,

    'Bridge': `"The bridge is where<br>
 your officers do their<br>
 work.<br>
 &nbsp;&nbsp;Advancements here will<br>
 increase the number of<br>
 officers you can have<br>
 on-duty at a given time."`,

    'Officers Quarters': `"Like crew quarters, your<br>
 officers need a place to<br>
 lay their heads. They<br>
 can't be seen fraternizing<br>
 with the enlisted. So,<br>
 they get their own space.<br>
 &nbsp;&nbsp;Improvements give<br>
 them more room to<br>
 stretch their feet,<br>
 and encourages them<br>
 to be at their best."`,

    'Training Deck': `"While the crew are some<br>
 of the League's best<br>
 trained people, they<br>
 still need to keep those<br>
 skills sharp.<br>
 &nbsp;&nbsp;Better equipment, space,<br>
 and training regimen<br>
 will have your crew<br>
 humming like a finely-<br>
 tuned machine."`,

    'Port Thrusters': `"Port-side thrusters allow<br>
 your ship to turn toward<br>
 starboard (clockwise).<br>
 &nbsp;&nbsp;More tech points give<br>
 the thrusters more kick<br>
 and a faster clockwise<br>
 turn speed."`,

    'Main Thruster': `"How fast and how far<br>
 your ship can move with<br>
 each jump.<br>
 &nbsp;&nbsp;Advancements here will<br>
 increase forward speed<br>
 in combat, but also how<br>
 far the ship can move<br>
 across the stars with<br>
 each burst."`,

    'Starboard Thrusters': `"Starboard-side thrusters<br>
 allow your ship to<br>
 turn toward port<br>
 (counter-clockwise).<br>
 &nbsp;&nbsp;More tech points give<br>
 the thrusters more kick<br>
 and a faster counter-<br>
 clockwise turn speed."`,

    'Sensors': `"You can't rely on looking<br>
 out a window to know<br>
 what's going on outside<br>
 the ship. You need<br>
 complex sensory equipment<br>
 to avoid debris, black<br>
 holes; to steer the ship<br>
 accurately; to find<br>
 things worth exploring.<br>
 &nbsp;&nbsp;More points translate<br>
 to seeing farther."`,

    'Artificial Gravity Rings': `"The enzmann has three<br>
 high-density rings that<br>
 spin continuously about<br>
 the ship to provide<br>
 earthlike gravity, and<br>
 shock-aborbing stability.<br>
 &nbsp;&nbsp;Upgrades improve overall<br>
 crew efficiency and<br>
 reduced hull damage from<br>
 blasts that penetrate<br>
 your shilds."`,

    'Shield Emitters': `"Your shields can deflect<br>
 many forms of physical<br>
 damage through a complex<br>
 array of electromagnetic<br>
 frequencies. Some photon-<br>
 based weapons may still<br>
 bypass these.<br>
 &nbsp;&nbsp;Spend tech points and<br>
 you will be able to hold<br>
 your shields longer and<br>
 recharge them faster."`,

    'Deuterium Tank': `"Deuterium is your fuel.<br>
 This massive tank is<br>
 where that fuel is stored.<br>
 &nbsp;&nbsp;Add tech points, and<br>
 increase the max amount<br>
 of fuel you can safely<br>
 store at one time.`
};

const rectangleBoxes: { height: number; width: number; x: number; z: number; radius: number; rot: number; name: string; }[] = [
    { height: 0.49, width: 1.64, x: -0.9, z: 2.98, radius: 0.09, rot: 0, name: 'Galley & Mess Hall' },
    { height: 0.49, width: 1.64, x: -0.9, z: 2.28, radius: 0.07, rot: 0, name: 'Crew Quarters A' },
    { height: 0.49, width: 1.64, x: -0.9, z: 3.71, radius: 0.09, rot: 0, name: 'Crew Quarters B' },
    { height: 1.01, width: 0.49, x: 0.36, z: 2.35, radius: 0.05, rot: 0, name: 'Weapons Room' },
    { height: 1.01, width: 0.49, x: 0.36, z: 3.59, radius: 0.05, rot: 0, name: 'Extended Reality Deck' },
    { height: 0.95, width: 0.94, x: -2.39, z: 2.45, radius: 0.06, rot: 0, name: 'Climate-Controlled Cargo Space' },
    { height: 0.95, width: 0.94, x: -2.39, z: 3.62, radius: 0.06, rot: 0, name: 'Standard Cargo Space' },
    { height: 2.10, width: 0.48, x: -3.38, z: 3.04, radius: 0.05, rot: 0, name: 'Engine Room' },
    { height: 0.77, width: 0.48, x: 0.99, z: 2.98, radius: 0.04, rot: 0, name: 'Bridge' },
    { height: 0.47, width: 0.48, x: 0.99, z: 2.22, radius: 0.05, rot: 0, name: 'Officers Quarters' },
    { height: 0.47, width: 0.48, x: 0.99, z: 3.75, radius: 0.03, rot: 0, name: 'Training Deck' },
    { height: 0.24, width: 0.38, x: -5.69, z: 1.99, radius: 0.02, rot: 0, name: 'Port Thrusters' },
    { height: 0.24, width: 0.38, x: -5.69, z: 3.02, radius: 0.02, rot: 0, name: 'Main Thruster' },
    { height: 0.24, width: 0.38, x: -5.69, z: 3.98, radius: 0.02, rot: 0, name: 'Starboard Thrusters' },
    { height: 0.24, width: 0.37, x: 5.50, z: 3.00, radius: 0.02, rot: 0, name: 'Sensors' },
    { height: 3.02, width: 0.20, x: -4.04, z: 2.98, radius: 0.099, rot: 0, name: 'Artificial Gravity Rings' },
    { height: 1.28, width: 0.16, x: 1.53, z: 2.98, radius: 0.07, rot: -0.02, name: 'Shield Emitters' }
];

/**
 * @class
 * Slow moving debris object that is sometimes on the path towards planet.
 */
export class ShipLayout {
    /**
     * List of actors in the scene.
     */
    private actors: Actor[] = [];

    /**
     * Text for hovered room at bottom of screen.
     */
    private dialogueText: DialogueText = {
        counter: 1,
        currentIndex: 0,
        element: null,
        font: null,
        isFinished: false,
        sentence: dialogues['']
    };

    /**
     * Color for boxes user is hovering over.
     */
    private highlightedColor = '#00FF00';

    /**
     * Mesh for box user has hovered over.
     */
    private hoveredBox: Mesh = null;

    /**
     * Text for hovered room at bottom of screen.
     */
    private hoverText: FadableText = {
        counter: 1,
        font: null,
        geometry: null,
        headerParams: null,
        holdCount: -1, // Hold until replaced
        isFadeIn: true,
        isHolding: false,
        material: null,
        mesh: null,
        sentence: ''
    };

    /**
     * Meshes for all the boxes user can interact with.
     */
    private meshMap: { [key: string]: Mesh } = {};

    /**
     * Reference to the scene, used to remove ship from rendering cycle once destroyed.
     */
    private scene: Scene;

    /**
     * Mesh for box user has selected.
     */
    private selectedBox: Mesh = null;

    /**
     * Color for boxes user has clicked.
     */
    private selectedColor = '#F1149A';

    /**
     * Text for selected room at top left of screen.
     */
    private selectionText: FadableText = {
        counter: 1,
        font: null,
        geometry: null,
        headerParams: null,
        holdCount: -1, // Hold until replaced
        isFadeIn: true,
        isHolding: false,
        material: null,
        mesh: null,
        sentence: ''
    };

    /**
     * Stars in background.
     */
    private stars: Mesh[] = [];

    /**
     * Color for boxes user is not hovering over (default).
     */
    private unhighlightedColor = 0x87D3F8;

    /**
     * Constructor for the Intro (Scene) class
     * @param scene             graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param shipIntTexture    texture for the ship in cut profile.
     * @param shipTexture       texture for the ship.
     * @param dialogueTexture   texture for the profile image.
     * @param introFont         loaded font to use for help display text.
     */
    constructor(
        scene: SceneType,
        shipIntTexture: Texture,
        shipTexture: Texture,
        dialogueTexture: Texture,
        introFont: Font) {
        this.scene = scene.scene;

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        this.hoverText.headerParams = {
            font: introFont,
            size: 0.199,
            height: 0.001,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 3
        };
        this.hoverText.material = new MeshBasicMaterial({ color: this.unhighlightedColor });

        this.createStars();

        const ship = createShip(shipTexture);
        this.actors.push(ship);
        this.scene.add(ship.mesh);
        const shipInterior = createShipInteriorFrame(shipIntTexture);
        this.actors.push(shipInterior);
        this.scene.add(shipInterior.mesh);
        const profile = createProfile(dialogueTexture);
        this.actors.push(profile);
        this.scene.add(profile.mesh);

        rectangleBoxes.forEach(box => {
            const recBoxMaterial = new MeshBasicMaterial({
                color: this.unhighlightedColor,
                opacity: 0.5,
                transparent: true,
                side: DoubleSide
            });
            const recBoxGeometry = createBoxWithRoundedEdges(box.width, box.height, box.radius, 0);
            const barrier = new Mesh( recBoxGeometry, recBoxMaterial );
            barrier.name = box.name;
            barrier.position.set(box.x, 15, box.z);
            barrier.rotation.set(1.5708, 0, box.rot);
            this.scene.add(barrier);
            this.meshMap[box.name] = barrier;
        });

        const material = new MeshBasicMaterial({
            color: this.unhighlightedColor,
            opacity: 0.5,
            transparent: true,
            side: DoubleSide
        });
        const geometry: CircleGeometry = new CircleGeometry(1.56, 48, 48);
        const circleBarrier = new Mesh( geometry, material );
        circleBarrier.name = 'Deuterium Tank';
        circleBarrier.position.set(3.42, 15, 2.94);
        circleBarrier.rotation.set(1.5708, 0, 0);
        this.scene.add(circleBarrier);
        this.meshMap[circleBarrier.name] = circleBarrier;

        const intersectableThings = [...rectangleBoxes, circleBarrier];

        const textBoxes = [
            { widthIn: 6, widthOut: 6.2, x: 2.9, z: -4.45, name: 'Profile Dialogue' },
            { widthIn: 5.5, widthOut: 5.7, x: -3.15, z: -4.45, name: 'Selection' },
        ];

        textBoxes.forEach(box => {
            let textBoxMaterial = new MeshBasicMaterial({
                color: 0xFFFFFF,
                opacity: 0.6,
                transparent: true,
                side: DoubleSide
            });
            let textBoxGeometry = new PlaneGeometry( box.widthOut, 3.2, 10, 10 );
            let barrier = new Mesh( textBoxGeometry, textBoxMaterial );
            barrier.name = `${box.name} Outter Box`;
            barrier.position.set(box.x, 15, box.z);
            barrier.rotation.set(1.5708, 0, 0);
            this.scene.add(barrier);

            textBoxMaterial = new MeshBasicMaterial({
                color: 0x000000,
                opacity: 1,
                transparent: true,
                side: DoubleSide
            });
            textBoxGeometry = new PlaneGeometry( box.widthIn, 3, 10, 10 );
            barrier = new Mesh( textBoxGeometry, textBoxMaterial );
            barrier.name = `${box.name} Inner Box`;
            barrier.position.set(box.x, 10, box.z);
            barrier.rotation.set(1.5708, 0, 0);
            this.scene.add(barrier);
        });

        const container = document.getElementById('mainview');
        document.onclick = event => {
            event.preventDefault();
            Object.keys(this.meshMap).forEach(key => {
                (this.meshMap[key].material as any).color.set(this.unhighlightedColor);
            });
            getIntersections(event, container, scene).forEach(el => {
                const hit = intersectableThings.find(box => {
                    if (el.object.name === box.name) {
                        return true;
                    }
                });
                if (hit) {
                    this.selectedBox = this.meshMap[hit.name];
                    (this.meshMap[hit.name].material as any).color.set(this.selectedColor);
                    SoundinatorSingleton.playClick();

                    this.selectionText.sentence = hit.name;
                    this.selectionText.element.innerHTML = this.selectionText.sentence;
                    this.selectionText.isFadeIn = true;
                    this.selectionText.isHolding = false;
                    this.selectionText.counter = 1;
                    this.makeSelectionText();

                    this.dialogueText.sentence = dialogues[hit.name];
                    this.dialogueText.counter = -1;
                    this.dialogueText.currentIndex = 0;
                    this.dialogueText.isFinished = false;
                    this.makeDialogueText();
                }
            });
        };
        document.onmousemove = event => {
            event.preventDefault();
            const hoverName = this.hoveredBox && this.hoveredBox.name;
            const selectedName = this.selectedBox && this.selectedBox.name;
            let isHovering = false;
            getIntersections(event, container, scene).forEach(el => {
                const hit = intersectableThings.find(box => {
                    if (el.object.name === box.name) {
                        return true;
                    }
                });
                if (hit) {
                    if (!this.selectedBox || this.selectedBox.name !== hit.name) {
                        isHovering = true;
                        this.hoveredBox = this.meshMap[el.object.name];
                        (this.meshMap[el.object.name].material as any).color.set(this.highlightedColor);
                    } else if (this.selectedBox && this.selectedBox.name === hit.name) {
                        isHovering = true;
                    }

                    if (hit.name !== hoverName && hit.name !== selectedName) {
                        if (this.hoverText.mesh) {
                            this.scene.remove(this.hoverText.mesh);
                        }
                        setTimeout(() => {
                            this.hoverText.sentence = hit.name;
                            this.hoverText.isFadeIn = true;
                            this.hoverText.isHolding = false;
                            this.hoverText.counter = 1;
                            this.makeHoverText(true);
                        }, 100);
                    }
                    return;
                }
            });
            if (!isHovering && this.hoverText.mesh) {
                this.hoveredBox = null;
                this.hoverText.sentence = '';
                this.hoverText.isFadeIn = true;
                this.hoverText.isHolding = false;
                this.hoverText.counter = 1;
                this.makeHoverText(true);
            }
            this.clearMeshMap();
        };
    }

    private clearMeshMap(): void {
        const selectedName = this.selectedBox && this.selectedBox.name;
        const hoveredName = this.hoveredBox && this.hoveredBox.name;
        // If no selected box, don't bother with the extra conditional check.
        if (!selectedName && !hoveredName) {
            Object.keys(this.meshMap).forEach(key => {
                (this.meshMap[key].material as any).color.set(this.unhighlightedColor);
            });
        } else {
            Object.keys(this.meshMap).forEach(key => {
                if (key !== selectedName && key !== hoveredName) {
                    (this.meshMap[key].material as any).color.set(this.unhighlightedColor);
                }
            });
        }
    }

    private createStars(): void {
        const material = new MeshBasicMaterial({
            color: 0xFFFFFF,
            opacity: 1,
            transparent: false,
            side: DoubleSide
        });
        for (let i = 0; i < 500; i++) {
            const mag = (Math.floor(Math.random() * 3) + 1) / 100;
            const geometry = new PlaneGeometry(mag, mag, 0.01, 0.01);
            const isXNeg = Math.random() < 0.5 ? -1 : 1;
            const isZNeg = Math.random() < 0.5 ? -1 : 1;
            const xCoord = Math.random() * 7;
            const zCoord = Math.random() * 7;
            const mesh = new Mesh( geometry, material );
            mesh.position.set((isXNeg * xCoord), 30, (isZNeg * zCoord));
            mesh.rotation.set(1.5708, 0, 0);
            mesh.name = `Star-${i}`;
            this.scene.add(mesh);
            this.stars[i] = mesh;
        }
    }

    /**
     * Builds the text and graphics for the text dialogue at top right of screen.
     */
    private makeDialogueText(): void {
        if (this.dialogueText.isFinished) {
            return;
        }
        this.dialogueText.counter++;
        if (this.dialogueText.counter % 3 === 0 && this.dialogueText.currentIndex < this.dialogueText.sentence.length) {
            this.dialogueText.currentIndex++;
            if (this.dialogueText.sentence.charAt(this.dialogueText.currentIndex - 1) === '<') {
                this.dialogueText.currentIndex += 3;
            }if (this.dialogueText.sentence.charAt(this.dialogueText.currentIndex - 1) === '&') {
                this.dialogueText.currentIndex += 11;
            }
            if (this.dialogueText.element) {
                this.dialogueText.element.innerHTML = this.dialogueText.sentence.slice(0, this.dialogueText.currentIndex);
            }
        }
        if (this.dialogueText.currentIndex >= this.dialogueText.sentence.length) {
            this.dialogueText.isFinished = true;
        }
    }

    /**
     * Builds the text and graphics for the text dialogue at bottom of screen.
     */
    private makeHoverText(change?: boolean): void {
        if (this.hoverText.isHolding) {
            return;
        }
        const name = this.selectedBox && this.selectedBox.name;
        const color = name === this.hoverText.sentence ? this.selectedColor : '#00B39F';
        if (change && this.hoverText.mesh) {
            this.scene.remove(this.hoverText.mesh);
            this.hoverText.geometry = null;
            this.hoverText.mesh = null;
            if (!this.hoverText.sentence) {
                return;
            }
        }
        if (this.hoverText.isFadeIn && this.hoverText.counter > 20) {
            this.hoverText.isFadeIn = false;
            this.hoverText.isHolding = true;
            this.hoverText.counter = 1;
        }

        if (this.hoverText.isFadeIn) {
            this.hoverText.material.opacity = (this.hoverText.counter / 20);
            this.hoverText.counter++;
            if (change) {
                this.hoverText.geometry = new TextGeometry(
                    this.hoverText.sentence,
                    this.hoverText.headerParams);
                this.hoverText.material.color.set(color);
                this.hoverText.mesh = new Mesh(
                    this.hoverText.geometry,
                    this.hoverText.material);
                this.hoverText.mesh.position.set(-5.65, -11.4, 5.5);
                this.hoverText.mesh.rotation.x = -1.5708;
                this.scene.add(this.hoverText.mesh);
            }
        }
    }

    /**
     * Builds the text and graphics for the text dialogue at top left of screen.
     */
    private makeSelectionText(): void {
        if (this.selectionText.isHolding) {
            return;
        }
        if (this.selectionText.isFadeIn && this.selectionText.counter > 20) {
            this.selectionText.isFadeIn = false;
            this.selectionText.isHolding = true;
            this.selectionText.counter = 1;
        }

        if (this.selectionText.isFadeIn) {
            this.selectionText.element.style.opacity = (this.selectionText.counter / 20) + '';
            this.selectionText.counter++;
        }
    }

    private onWindowResize(): void {
        const dialogueElement = document.getElementById('ship-layout-screen-dialogue');
        if (dialogueElement) {
            dialogueElement.remove();
        }
        const selectionElement = document.getElementById('ship-layout-screen-selection');
        if (selectionElement) {
            selectionElement.remove();
        }
        const hoverElement = document.getElementById('ship-layout-screen-hover');
        if (hoverElement) {
            hoverElement.remove();
        }

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

        this.dialogueText.element = document.createElement('div');
        this.dialogueText.element.id = 'ship-layout-screen-dialogue';
        this.dialogueText.element.style.fontFamily = 'Luckiest Guy';
        this.dialogueText.element.style.color = '#FFD700';
        this.dialogueText.element.style.position = 'absolute';
        this.dialogueText.element.style.maxWidth = `${0.25 * width}px`;
        this.dialogueText.element.style.width = `${0.25 * width}px`;
        this.dialogueText.element.style.maxHeight = `${0.24 * height}px`;
        this.dialogueText.element.style.height = `${0.24 * height}px`;
        this.dialogueText.element.style.backgroundColor = 'transparent';
        this.dialogueText.element.innerHTML = this.dialogueText.sentence.slice(0, this.dialogueText.currentIndex);
        this.dialogueText.element.style.top = `${0.01 * height}px`;
        this.dialogueText.element.style.left = `${left + (0.5 * width)}px`;
        this.dialogueText.element.style.overflowY = 'hidden';
        this.dialogueText.element.style.fontSize = `${0.018 * width}px`;
        document.body.appendChild(this.dialogueText.element);

        this.selectionText.element = document.createElement('div');
        this.selectionText.element.id = 'ship-layout-screen-selection';
        this.selectionText.element.style.fontFamily = 'Luckiest Guy';
        this.selectionText.element.style.color = '#FFD700';
        this.selectionText.element.style.position = 'absolute';
        this.selectionText.element.style.maxWidth = `${0.43 * width}px`;
        this.selectionText.element.style.width = `${0.43 * width}px`;
        this.selectionText.element.style.maxHeight = `${0.08 * height}px`;
        this.selectionText.element.style.height = `${0.08 * height}px`;
        this.selectionText.element.style.backgroundColor = 'transparent';
        this.selectionText.element.innerHTML = this.selectionText.sentence;
        this.selectionText.element.style.top = `${0.01 * height}px`;
        this.selectionText.element.style.left = `${left + (0.02 * width)}px`;
        this.selectionText.element.style.overflowY = 'hidden';
        this.selectionText.element.style.textAlign = 'center';
        this.selectionText.element.style.fontSize = `${0.03 * width}px`;
        this.selectionText.element.style.border = '1px solid #FFF';
        document.body.appendChild(this.selectionText.element);

        this.hoverText.element = document.createElement('div');
        this.hoverText.element.id = 'ship-layout-screen-hover';
        this.hoverText.element.style.fontFamily = 'Luckiest Guy';
        this.hoverText.element.style.color = '#FFD700';
        this.hoverText.element.style.position = 'absolute';
        this.hoverText.element.style.maxWidth = `${0.43 * width}px`;
        this.hoverText.element.style.width = `${0.43 * width}px`;
        this.hoverText.element.style.maxHeight = `${0.08 * height}px`;
        this.hoverText.element.style.height = `${0.08 * height}px`;
        this.hoverText.element.style.backgroundColor = 'transparent';
        this.hoverText.element.innerHTML = this.hoverText.sentence;
        this.hoverText.element.style.bottom = `${0.01 * height}px`;
        this.hoverText.element.style.left = `${left + (0.02 * width)}px`;
        this.hoverText.element.style.overflowY = 'hidden';
        this.hoverText.element.style.textAlign = 'center';
        this.hoverText.element.style.fontSize = `${0.03 * width}px`;
        this.hoverText.element.style.border = '1px solid #FFF';
        document.body.appendChild(this.hoverText.element);
    };
    
    /**
     * Removes any attached DOM elements, event listeners, or anything separate from ThreeJS
     */
    public dispose(): void {
        document.getElementById('ship-layout-screen-dialogue').remove();
        window.removeEventListener( 'resize', this.onWindowResize, false);
    }

    /**
     * At the end of each loop iteration, check for end state.
     * @returns whether or not the scene is done.
     */
    endCycle(): boolean {
        if (true) {

        } else {
            return false;
        }
        this.makeDialogueText();
        this.makeHoverText();
        this.makeSelectionText();
        return true;
    }
}