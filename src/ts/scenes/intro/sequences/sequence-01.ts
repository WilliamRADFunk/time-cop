import { ActorEventType } from "../../../models/actor-event";

export const SEQUENCE01 = {
    actorEvents: [
        {
            actorIndex: 17, // Ship lifts off from Earth
            duration: 180,
            endPoint: [ 0, 0 ],
            maxScale: 1,
            moveSpeed: 0,
            startingFrame: 1,
            startPoint: [ 0, 0 ],
            type: ActorEventType.Grow
        },
        {
            actorIndex: 0, // Earth exits stage left
            endPoint: [ -15, 0 ],
            maxScale: 1,
            moveSpeed: 0.2,
            startingFrame: 241,
            startPoint: [ 0, 0 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 1, // Mars enter stage right
            endPoint: [ 0, 0 ],
            maxScale: 1,
            moveSpeed: 0.05,
            startingFrame: 181,
            startPoint: [ 20, 0 ],
            type: ActorEventType.Moving
        },
        {
            actorIndex: 17, // Ship lands on Mars
            duration: 180,
            endPoint: [ 0, 0 ],
            maxScale: 1,
            moveSpeed: 0,
            startingFrame: 400,
            startPoint: [ 0, 0 ],
            type: ActorEventType.Shrink
        }
    ],
    endingFrame: 780,
    startingFrame: 1,
    textEvents: [
        {
            sentence: '2032: Colonization of Mars',
            holdCount: 420,
            startingFrame: 1,
        }
    ]
};