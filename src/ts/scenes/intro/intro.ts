import {
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Scene } from 'three';

import { SOUNDS_CTRL } from '../../controls/controllers/sounds-controller';
import { Actor } from '../../models/actor';
import { FadableText } from '../../models/fadable-text';
import { Sequence } from '../../models/sequence';
import { ActorEvent, ActorEventType } from '../../models/actor-event';
import { TextEvent } from "../../models/text-event";
import { SEQUENCE01 } from "./sequences/sequence-01";
import { createShip1 } from './actors/create-ship-1';
import { createEntryEffect } from './actors/create-entry-effect';
import { SceneType } from '../../models/scene-type';
import { ASSETS_CTRL } from '../../controls/controllers/assets-controller';
import { getIntersections } from '../../utils/get-intersections';

// const border: string = '1px solid #FFF';
const border: string = 'none';

/**
 * @class
 * Slow moving debris object that is sometimes on the path towards planet.
 */
export class Intro {
    /**
     * List of actors in the scene.
     */
    private _actors: Actor[] = [
        // 0: entryEffect,
        // 1: ship,
    ];
    /**
     * Current frame
     */
    private _currentFrame: number = 0;

    /**
     * Current scene in the sequence.
     */
    private _currentSequenceIndex: number = 0;

    /**
     * Flag to signal the scene is no longer active. Primarily used for a click event to useful during endCycle.
     */
    private _isActive: boolean = true;

    /**
     * Reference to _onWindowResize so that it can be removed later.
     */
    private _listenerRef: () => void;

    /**
     * Reference to the scene, used to remove ship from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * Tracks series of events that make up the intro scene.
     */
    private _sequences: Sequence[] = [
        SEQUENCE01,
    ];

    /**
     * Stationary pin-pricks of light in the background.
     */
    private _stars: Mesh[] = [];

    /**
     * Moving pin-pricks of light in the background.
     */
    private _starsInMotion: boolean = false;

    /**
     * Text of the intro screen.
     */
    private _text: FadableText = {
        counter: 1,
        element: null,
        holdCount: 0,
        isFadeIn: true,
        isHolding: false,
        sentence: ''
    };

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
     * Stars stretched out into lines to simulate light speeds and moving from right to left.
     */
    private _warpedStarsInMotion: boolean = false;

    /**
     * Constructor for the Intro (Scene) class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    constructor(scene: SceneType) {
        this._scene = scene.scene;

        document.oncontextmenu = event => {
            return false;
        };

        this._onWindowResize();
        this._listenerRef = this._onWindowResize.bind(this);
        window.addEventListener('resize', this._listenerRef, false);

        this._createStars();
        this._createActors();
        
        // Click event listener to register user click.
        document.onclick = event => {
            event.preventDefault();
            // Detection for player clicked on pause button
            getIntersections(event, document.getElementById('mainview'), scene)
                .filter(el => el.object.name === 'Click Barrier')
                .forEach(el => {
                    SOUNDS_CTRL.playBidooo();
                    this._isActive = false;
                });
        };
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
     * Creates items to be moved around in scene.
     */
    private _createActors(): void {
        const headerParams = {
            font: ASSETS_CTRL.gameFont,
            size: 0.25,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 3
        };

        const entryEffect = createEntryEffect();
        this._scene.add(entryEffect.mesh);
        this._actors.push(entryEffect);

        const ship = createShip1();
        this._scene.add(ship.mesh);
        this._actors.push(ship);
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
     * Handles all the actions actor is meant to take during the current frame in the scene.
     * @param actor the actor to be manipulated this frame.
     */
    private _handleActorEvents(actor: Actor): void {
        const actorEvent = actor.action;
        switch(actorEvent.type) {
            case ActorEventType.Moving: {
                this._calculateNextPoint(actor);
                actor.mesh.position.set(actor.currentPoint[0], actor.mesh.position.y, actor.currentPoint[1]);
                if (Math.abs(actor.currentPoint[0] - actor.endingPoint[0]) <= 0.03 && Math.abs(actor.currentPoint[1] - actor.endingPoint[1]) <= 0.03) {
                    actor.mesh.position.set(actor.endingPoint[0], actor.mesh.position.y, actor.endingPoint[1]);
                    actor.inMotion = false;
                }
                break;
            }
            case ActorEventType.Move_And_Rotate: {
                this._calculateNextPoint(actor);
                actor.mesh.position.set(actor.currentPoint[0], actor.mesh.position.y, actor.currentPoint[1]);
                this._rotate(actor);
                if (Math.abs(actor.currentPoint[0] - actor.endingPoint[0]) <= 0.03 && Math.abs(actor.currentPoint[1] - actor.endingPoint[1]) <= 0.03) {
                    actor.mesh.position.set(actor.endingPoint[0], actor.mesh.position.y, actor.endingPoint[1]);
                    actor.inMotion = false;
                }
                break;
            }
            case ActorEventType.Grow: {
                const currentScale = actor.mesh.scale.x;
                let newScale = currentScale + (1 / actorEvent.duration);
                newScale = newScale <= 1 ? newScale : 1;
                actor.mesh.scale.set(newScale, newScale, newScale);
                break;
            }
            case ActorEventType.Shrink: {
                const currentScale = actor.mesh.scale.x;
                let newScale = currentScale - (1 / actorEvent.duration);
                newScale = newScale >= 0.0001 ? newScale : 0.0001;
                actor.mesh.scale.set(newScale, newScale, newScale);
                break;
            }
            case ActorEventType.Rotate: {
                this._rotate(actor);
                break;
            }
        }
    }

    /**
     * Starts the actor off on an event with initilzation for the handler to use.
     * @param actorEvent the event to be applied to the actor.
     */
    private _initiateActorEvents(actorEvent: ActorEvent): void {
        switch(actorEvent.type) {
            case ActorEventType.Moving: {
                this._setDestination(
                    actorEvent.actorIndex,
                    actorEvent.startPoint[0],
                    actorEvent.startPoint[1],
                    actorEvent.endPoint[0],
                    actorEvent.endPoint[1],
                    actorEvent.moveSpeed);
                const actor = this._actors[actorEvent.actorIndex];
                actor.action = actorEvent;
                break;
            }
            case ActorEventType.Move_And_Rotate: {
                this._setDestination(
                    actorEvent.actorIndex,
                    actorEvent.startPoint[0],
                    actorEvent.startPoint[1],
                    actorEvent.endPoint[0],
                    actorEvent.endPoint[1],
                    actorEvent.moveSpeed);
                const actor = this._actors[actorEvent.actorIndex];
                actor.moveSpeed = actorEvent.moveSpeed;
                actor.rotateSpeed = actorEvent.rotateSpeed;
                actor.action = actorEvent;
                break;
            }
            case ActorEventType.Grow: {
                this._setDestination(
                    actorEvent.actorIndex,
                    actorEvent.startPoint[0],
                    actorEvent.startPoint[1],
                    actorEvent.endPoint[0],
                    actorEvent.endPoint[1],
                    actorEvent.moveSpeed);
                const actor = this._actors[actorEvent.actorIndex];
                actor.mesh.scale.set(0, 0, 0);
                actor.action = actorEvent;
                break;
            }
            case ActorEventType.Shrink: {
                this._setDestination(
                    actorEvent.actorIndex,
                    actorEvent.startPoint[0],
                    actorEvent.startPoint[1],
                    actorEvent.endPoint[0],
                    actorEvent.endPoint[1],
                    actorEvent.moveSpeed);
                const actor = this._actors[actorEvent.actorIndex];
                actor.mesh.scale.set(1, 1, 1);
                actor.action = actorEvent;
                break;
            }
            case ActorEventType.Rotate: {
                const actor = this._actors[actorEvent.actorIndex];
                actor.rotateSpeed = actorEvent.rotateSpeed;
                actor.inMotion = true;
                actor.action = actorEvent;
                break;
            }
        }

    }

    /**
     * Adjusts the bottom left label text for a new event.
     * @param textEvent the change to be applied to the bottom left text labels.
     */
    private _handleTextEvents(textEvent: TextEvent): void {
        if (textEvent) {
            this._text.sentence = textEvent.sentence;
            this._text.isFadeIn = true;
            this._text.isHolding = false;
            this._text.holdCount = textEvent.holdCount;
            this._text.counter = 0;
            this._makeText();
            this._onWindowResize();
        }
    }

    /**
     * Builds the text and graphics for the text dialogue at bottom of screen.
     */
    private _makeText(): void {
        const textElement = document.getElementById('intro-screen-sequence-labels');
        if (!textElement) {
            this._onWindowResize();
        }
        if (this._text.isFadeIn && this._text.counter > 180) {
            this._text.isFadeIn = false;
            this._text.isHolding = true;
            this._text.counter = 1;
        } else if (this._text.isHolding && this._text.counter > this._text.holdCount) {
            this._text.isFadeIn = false;
            this._text.isHolding = false;
            this._text.counter = 1;
        }

        if (this._text.isFadeIn) {
            this._text.element.style.opacity = (this._text.counter / 180) + '';
        } else if (this._text.isHolding) {
            // Do nothing
        } else if (this._text.counter < 181) {
            this._text.element.style.opacity = (180 - this._text.counter) / 180 + '';
        } else {
            return;
        }

        this._text.counter++;
    }

    private _onWindowResize(): void {
        const textElement = document.getElementById('intro-screen-sequence-labels');
        if (textElement) {
            textElement.remove();
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

        this._text.element = document.createElement('div');
        this._text.element.id = 'intro-screen-sequence-labels';
        this._text.element.style.fontFamily = 'Luckiest Guy';
        this._text.element.style.color = '#FFD700';
        this._text.element.style.position = 'absolute';
        this._text.element.style.maxWidth = `${0.90 * width}px`;
        this._text.element.style.width = `${0.90 * width}px`;
        this._text.element.style.maxHeight = `${0.04 * height}px`;
        this._text.element.style.height = `${0.04 * height}px`;
        this._text.element.style.backgroundColor = 'transparent';
        this._text.element.innerHTML = this._text.sentence;
        this._text.element.style.bottom = `${(window.innerHeight * 0.99 - height) + (0.02 * height)}px`;
        this._text.element.style.left = `${left + (0.02 * width)}px`;
        this._text.element.style.overflowY = 'hidden';
        this._text.element.style.textAlign = 'left';
        this._text.element.style.fontSize = `${0.03 * width}px`;
        this._text.element.style.border = border;
        document.body.appendChild(this._text.element);
    };

    /**
     * Spins planet at its set rate.
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
        document.getElementById('intro-screen-sequence-labels').remove();
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
        if (this._sequences[this._currentSequenceIndex].endingFrame <= this._currentFrame) {
            this._currentSequenceIndex++;
            this._actors.forEach(actor => {
                actor.inMotion = false;
            });
            this._currentFrame = 0;
        }
        if (this._currentSequenceIndex < this._sequences.length) {
            const sequence = this._sequences[this._currentSequenceIndex];

            sequence.actorEvents.filter(event => event.startingFrame === this._currentFrame).forEach(actorEvent => {
                this._initiateActorEvents(actorEvent);
            });

            const textEvent = sequence.textEvents.find(event => event.startingFrame === this._currentFrame);
            this._handleTextEvents(textEvent);
        } else {
            return true;
        }
        this._makeText();
        this._actors.filter(x => x.inMotion).forEach(actor => {
            this._handleActorEvents(actor)
        });
        if (this._starsInMotion) {
            const length = this._stars.length;
            this._stars.forEach((star, index) => {
                const percentile = Math.floor((index / length) * 100);
                if (percentile < 70) {
                    // Stationary
                } else if (percentile < 90) {
                    star.position.set(star.position.x - 0.001, 5, star.position.z);
                } else {
                    star.position.set(star.position.x - 0.002, 5, star.position.z);
                }
                if (star.position.x < -7) {
                    star.position.set(7, 5, star.position.z);
                }
            });
        }
        if (this._warpedStarsInMotion) {
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
        return false;
    }
}