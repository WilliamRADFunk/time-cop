import { Mesh } from "three";

/**
 * Essential information that each crew member must have to fascilitate the functioning in the game.
 */
 export interface Entity {
    /**
     * Tracks position in walking animation sequence to know which animation to switch to next frame.
     */
    _animationCounter: number;

    /**
     * The three meshes to flip through to simulate a walking animation.
     */
    _animationMeshes: [Mesh, Mesh, Mesh];

    /**
     * Current direction crew member should be facing.
     */
    _currDirection: EntityDirection;

    /**
     * Flag to signal walking animation should be active.
     */
    _isMoving?: boolean;

    /**
     * Flag to signal walking animation sound isPlaying.
     */
    _isMovingSound?: boolean;
}

export enum EntityDirection {
    'Down' = 0,
    'Down_Left' = 1,
    'Left' = 2,
    'Up_Left' = 3,
    'Up' = 4,
    'Up_Right' = 5,
    'Right' = 6,
    'Down_Right' = 7,
}