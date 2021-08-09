import { Scene } from 'three';
import { Actor } from '../../../models/actor';
import { ActorEvent, ActorEventType } from '../../../models/actor-event';
import { RAD_135_DEG_RIGHT, RAD_225_DEG_RIGHT, RAD_45_DEG_RIGHT } from '../../../utils/radians-x-degrees-right';
import { createArrow } from '../actors/create-arrow';

export const SEQUENCE = {
    actorEvents: [
        {
            actorIndex: 0, // ArrowTopLeft,
            duration: 1,
            endPoint: [ -4.5, -4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 1,
            startPoint: [ -4.5, -4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 1, // ArrowBottomLeft,
            duration: 1,
            endPoint: [ -4.5, 4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 1,
            startPoint: [ -4.5, 4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 2, // ArrowBottomRight,
            duration: 1,
            endPoint: [ 4.5, 4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 1,
            startPoint: [ 4.5, 4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 3, // ArrowTopRight,
            duration: 1,
            endPoint: [ 4.5, -4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 1,
            startPoint: [ 4.5, -4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 0, // ArrowTopLeft,
            duration: 60,
            endPoint: [ -3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 2,
            startPoint: [ -4.5, -4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 1, // ArrowBottomLeft,
            duration: 60,
            endPoint: [ -3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 2,
            startPoint: [ -4.5, 4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 2, // ArrowBottomRight,
            duration: 60,
            endPoint: [ 3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 2,
            startPoint: [ 4.5, 4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 3, // ArrowTopRight,
            duration: 60,
            endPoint: [ 3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 2,
            startPoint: [ 4.5, -4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 0, // ArrowTopLeft,
            duration: 1,
            endPoint: [ -3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 62,
            startPoint: [ -3.5, -3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 1, // ArrowBottomLeft,
            duration: 1,
            endPoint: [ -3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 62,
            startPoint: [ -3.5, 3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 2, // ArrowBottomRight,
            duration: 1,
            endPoint: [ 3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 62,
            startPoint: [ 3.5, 3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 3, // ArrowTopRight,
            duration: 1,
            endPoint: [ 3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 62,
            startPoint: [ 3.5, -3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 0, // ArrowTopLeft,
            duration: 1,
            endPoint: [ -4.5, -4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 63,
            startPoint: [ -4.5, -4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 1, // ArrowBottomLeft,
            duration: 1,
            endPoint: [ -4.5, 4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 63,
            startPoint: [ -4.5, 4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 2, // ArrowBottomRight,
            duration: 1,
            endPoint: [ 4.5, 4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 63,
            startPoint: [ 4.5, 4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 3, // ArrowTopRight,
            duration: 1,
            endPoint: [ 4.5, -4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 63,
            startPoint: [ 4.5, -4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 0, // ArrowTopLeft,
            duration: 60,
            endPoint: [ -3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 64,
            startPoint: [ -4.5, -4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 1, // ArrowBottomLeft,
            duration: 60,
            endPoint: [ -3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 64,
            startPoint: [ -4.5, 4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 2, // ArrowBottomRight,
            duration: 60,
            endPoint: [ 3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 64,
            startPoint: [ 4.5, 4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 3, // ArrowTopRight,
            duration: 60,
            endPoint: [ 3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 64,
            startPoint: [ 4.5, -4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 0, // ArrowTopLeft,
            duration: 1,
            endPoint: [ -3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 124,
            startPoint: [ -3.5, -3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 1, // ArrowBottomLeft,
            duration: 1,
            endPoint: [ -3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 124,
            startPoint: [ -3.5, 3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 2, // ArrowBottomRight,
            duration: 1,
            endPoint: [ 3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 124,
            startPoint: [ 3.5, 3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 3, // ArrowTopRight,
            duration: 1,
            endPoint: [ 3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 124,
            startPoint: [ 3.5, -3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 0, // ArrowTopLeft,
            duration: 1,
            endPoint: [ -4.5, -4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 125,
            startPoint: [ -4.5, -4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 1, // ArrowBottomLeft,
            duration: 1,
            endPoint: [ -4.5, 4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 125,
            startPoint: [ -4.5, 4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 2, // ArrowBottomRight,
            duration: 1,
            endPoint: [ 4.5, 4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 125,
            startPoint: [ 4.5, 4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 3, // ArrowTopRight,
            duration: 1,
            endPoint: [ 4.5, -4.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 125,
            startPoint: [ 4.5, -4.5 ],
            type: ActorEventType.Appear
        },
        {
            actorIndex: 0, // ArrowTopLeft,
            duration: 60,
            endPoint: [ -3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 126,
            startPoint: [ -4.5, -4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 1, // ArrowBottomLeft,
            duration: 60,
            endPoint: [ -3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 126,
            startPoint: [ -4.5, 4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 2, // ArrowBottomRight,
            duration: 60,
            endPoint: [ 3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 126,
            startPoint: [ 4.5, 4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 3, // ArrowTopRight,
            duration: 60,
            endPoint: [ 3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0.0236,
            startingFrame: 126,
            startPoint: [ 4.5, -4.5 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 0, // ArrowTopLeft,
            duration: 1,
            endPoint: [ -3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 186,
            startPoint: [ -3.5, -3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 1, // ArrowBottomLeft,
            duration: 1,
            endPoint: [ -3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 186,
            startPoint: [ -3.5, 3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 2, // ArrowBottomRight,
            duration: 1,
            endPoint: [ 3.5, 3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 186,
            startPoint: [ 3.5, 3.5 ],
            type: ActorEventType.Disappear
        },
        {
            actorIndex: 3, // ArrowTopRight,
            duration: 1,
            endPoint: [ 3.5, -3.5 ],
            maxScale: 0.5,
            moveSpeed: 0,
            startingFrame: 186,
            startPoint: [ 3.5, -3.5 ],
            type: ActorEventType.Disappear
        },
    ],
    endingFrame: 187,
    startingFrame: 1
};

export class ActorController {
    /**
    * List of actors in the scene.
    */
    private _actors: Actor[] = [
        // 0: arrowTopLeft,
        // 1: arrowBottomLeft,
        // 2: arrowBottomRight,
        // 3: arrowTopRight,
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
     * Flag to signal the scene is no longer active.
     */
    private _isActive: boolean = false;

    /**
     * Reference to the scene, used to remove elements from rendering cycle once destroyed.
     */
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;

        [
            [-4, -4, RAD_45_DEG_RIGHT],
            [-4, 4, -RAD_45_DEG_RIGHT],
            [4, 4, RAD_225_DEG_RIGHT],
            [4, -4, RAD_135_DEG_RIGHT]
        ].forEach(coords => {
            const arrow = createArrow(coords[0], coords[1], coords[2]);
            arrow.mesh.scale.set(0, 0, 0);
            this._scene.add(arrow.mesh);
            this._actors.push(arrow);
        });
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
            case ActorEventType.Appear: {
                actor.mesh.position.set(actor.endingPoint[0], actor.mesh.position.y, actor.endingPoint[1]);
                actor.mesh.scale.set(actorEvent.maxScale, actorEvent.maxScale, actorEvent.maxScale);
                break;
            }
            case ActorEventType.Disappear: {
                actor.mesh.scale.set(0, 0, 0);
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
            case ActorEventType.Appear: {
                this._setDestination(
                    actorEvent.actorIndex,
                    actorEvent.startPoint[0],
                    actorEvent.startPoint[1],
                    actorEvent.endPoint[0],
                    actorEvent.endPoint[1],
                    actorEvent.moveSpeed);
                const actor = this._actors[actorEvent.actorIndex];
                actor.mesh.scale.set(actorEvent.maxScale, actorEvent.maxScale, actorEvent.maxScale);
                actor.action = actorEvent;
                break;
            }
            case ActorEventType.Disappear: {
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
        }
    }

    /**
     * Calculates total distance to travel between two points and calculates first step.
     * @param actorIndex index of actor in the actor table.
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

    public activateArrows(): void {
        this._isActive = true;
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
        if (SEQUENCE.endingFrame <= this._currentFrame) {
            this._actors.forEach(actor => {
                actor.inMotion = false;
            });
            this._currentFrame = 0;
            this._isActive = false;
        }

        if (this._isActive) {
            SEQUENCE.actorEvents.filter(event => event.startingFrame === this._currentFrame).forEach(actorEvent => {
                this._initiateActorEvents(actorEvent);
            });
        } else {
            return true;
        }

        this._actors.filter(x => x.inMotion).forEach(actor => {
            this._handleActorEvents(actor)
        });
        return false;
    }
}