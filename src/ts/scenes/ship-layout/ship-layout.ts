import {
    CircleGeometry,
    DoubleSide,
    Font,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
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
     * Color for boxes user is hovering over.
     */
    private highlightedColor = 0x00FF00;

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
    private selectedColor = 0xF1149A;

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
     * @param introFont         loaded font to use for help display text.
     */
    constructor(
        scene: SceneType,
        shipIntTexture: Texture,
        shipTexture: Texture,
        introFont: Font) {
        this.scene = scene.scene;
        
        this.hoverText.headerParams = {
            font: introFont,
            size: 0.199,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 3
        };
        
        this.selectionText.headerParams = {
            font: introFont,
            size: 0.159,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 3
        };

        this.createStars();

        const ship = createShip(shipTexture);
        this.actors.push(ship);
        this.scene.add(ship.mesh);
        const shipInterior = createShipInteriorFrame(shipIntTexture);
        this.actors.push(shipInterior);
        this.scene.add(shipInterior.mesh);

        const rectangleBoxes = [
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

        rectangleBoxes.forEach(box => {
            const material = new MeshBasicMaterial({
                color: this.unhighlightedColor,
                opacity: 0.5,
                transparent: true,
                side: DoubleSide
            });
            const geometry = createBoxWithRoundedEdges(box.width, box.height, box.radius, 0);
            const barrier = new Mesh( geometry, material );
            barrier.name = box.name;
            barrier.position.set(box.x, 15, box.z);
            barrier.rotation.set(1.5708, 0, box.rot);
            this.scene.add(barrier);
            this.meshMap[box.name] = barrier;
        });

        let material = new MeshBasicMaterial({
            color: this.unhighlightedColor,
            opacity: 0.5,
            transparent: true,
            side: DoubleSide
        });
        let geometry: CircleGeometry | PlaneGeometry = new CircleGeometry(1.56, 48, 48);
        const circleBarrier = new Mesh( geometry, material );
        circleBarrier.name = 'Deuterium Tank';
        circleBarrier.position.set(3.42, 15, 2.94);
        circleBarrier.rotation.set(1.5708, 0, 0);
        this.scene.add(circleBarrier);
        this.meshMap[circleBarrier.name] = circleBarrier;

        const intersectableThings = [...rectangleBoxes, circleBarrier];

        const textBoxes = [
            { x: 3.15, z: -4.45, name: 'Profile Dialogue' },
            { x: -3.15, z: -4.45, name: 'Selection' },
        ];

        textBoxes.forEach(box => {
            let material = new MeshBasicMaterial({
                color: 0xFFFFFF,
                opacity: 0.6,
                transparent: true,
                side: DoubleSide
            });
            let geometry = new PlaneGeometry( 5.7, 3.2, 10, 10 );
            let barrier = new Mesh( geometry, material );
            barrier.name = `${box.name} Outter Box`;
            barrier.position.set(box.x, 15, box.z);
            barrier.rotation.set(1.5708, 0, 0);
            this.scene.add(barrier);

            material = new MeshBasicMaterial({
                color: 0x000000,
                opacity: 1,
                transparent: true,
                side: DoubleSide
            });
            geometry = new PlaneGeometry( 5.5, 3, 10, 10 );
            barrier = new Mesh( geometry, material );
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
                    this.selectionText.isFadeIn = true;
                    this.selectionText.isHolding = false;
                    this.selectionText.counter = 1;
                    this.makeSelectionText();
                    return;
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
                        this.hoverText.sentence = hit.name;
                        this.hoverText.isFadeIn = true;
                        this.hoverText.isHolding = false;
                        this.hoverText.counter = 1;
                        this.makeHoverText();
                    }
                    return;
                }
            });
            if (!isHovering) {
                this.hoveredBox = null;
                this.hoverText.sentence = '';
                this.hoverText.isFadeIn = true;
                this.hoverText.isHolding = false;
                this.hoverText.counter = 1;
                this.makeHoverText();
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
     * Builds the text and graphics for the text dialogue at bottom of screen.
     */
    private makeHoverText(): void {
        const name = this.selectedBox && this.selectedBox.name;
        const color = name === this.hoverText.sentence ? this.selectedColor : 0x00B39F
        if (this.hoverText.mesh) {
            this.scene.remove(this.hoverText.mesh);
        }
        if (this.hoverText.isFadeIn && this.hoverText.counter > 20) {
            this.hoverText.isFadeIn = false;
            this.hoverText.isHolding = true;
            this.hoverText.counter = 1;
        } else if (this.hoverText.isHolding) {
            this.hoverText.isFadeIn = false;
            this.hoverText.isHolding = true;
            this.hoverText.counter = 1;
        }

        if (this.hoverText.isFadeIn) {
            this.hoverText.material = new MeshLambertMaterial({
                color,
                opacity: this.hoverText.counter / 20,
                transparent: true
            });
            this.hoverText.counter++;
        } else if (this.hoverText.isHolding) {
            // Do nothing
        } else {
            return;
        }

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

    /**
     * Builds the text and graphics for the text dialogue at top left of screen.
     */
    private makeSelectionText(): void {
        if (this.selectionText.mesh) {
            this.scene.remove(this.selectionText.mesh);
        }
        if (this.selectionText.isFadeIn && this.selectionText.counter > 20) {
            this.selectionText.isFadeIn = false;
            this.selectionText.isHolding = true;
            this.selectionText.counter = 1;
        } else if (this.selectionText.isHolding) {
            this.selectionText.isFadeIn = false;
            this.selectionText.isHolding = true;
            this.selectionText.counter = 1;
        }

        if (this.selectionText.isFadeIn) {
            this.selectionText.material = new MeshLambertMaterial({
                color: this.selectedColor,
                opacity: this.selectionText.counter / 20,
                transparent: true
            });
            this.selectionText.counter++;
        } else if (this.selectionText.isHolding) {
            // Do nothing
        } else {
            return;
        }

        this.selectionText.geometry = new TextGeometry(
            this.selectionText.sentence,
            this.selectionText.headerParams);
        this.selectionText.mesh = new Mesh(
            this.selectionText.geometry,
            this.selectionText.material);
        this.selectionText.mesh.position.set(-5.65, -11.4, -5.5);
        this.selectionText.mesh.rotation.x = -1.5708;
        this.scene.add(this.selectionText.mesh);
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
        this.makeHoverText();
        this.makeSelectionText();
        return true;
    }
}