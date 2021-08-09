export enum ActorEventType {
    Appear = 'Appear',
    Disappear = 'Disappear',
    Grow = 'Grow',
    Move_And_Rotate = 'Move & Rotate',
    Moving = 'Moving',
    Rotate = 'Rotate',
    Shrink = 'Shrink',
}

export interface ActorEvent {
    actorIndex: number;
    duration?: number,
    endPoint: number[];
    maxScale: number;
    moveSpeed: number;
    rotateSpeed?: number;
    startingFrame: number;
    startPoint: number[];
    type: ActorEventType;
    warbleArray?: [number, number][];
}