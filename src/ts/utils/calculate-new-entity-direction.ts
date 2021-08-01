import { EntityDirection } from "../models/entity";

/**
 * Based on the difference in row and column of current crew member tile and their next, this finds new crew member direction.
 * @param horizontalDifference difference in row coordinates between crew member's current tile and the next.
 * @param verticalDifference difference in column coordinates between crew member's current tile and the next.
 * @returns the new direction the crew member should be facing.
 */
export function calculateNewEntityDirection(horizontalDifference: number, verticalDifference: number): EntityDirection {
    // vertical difference * 10 + horrizontal difference = unique number for each of 8 possible directions without all the if-elses.
    const dirCode = (verticalDifference * 10) + horizontalDifference;
    console.log('calculateNewEntityDirection', dirCode, horizontalDifference, verticalDifference);
    switch(dirCode) {
        case 10: {
            return EntityDirection.Up;
        }
        case 11: {
            return EntityDirection.Up_Right;
        }
        case 1: {
            return EntityDirection.Right;
        }
        case -9: {
            return EntityDirection.Down_Right;
        }
        case -10: {
            return EntityDirection.Down;
        }
        case -11: {
            return EntityDirection.Down_Left;
        }
        case -1: {
            return EntityDirection.Left;
        }
        case 9: {
            return EntityDirection.Up_Left;
        }
        default: {
            console.error('calculateNewEntityDirection: Impossible dirrection key', dirCode, verticalDifference, horizontalDifference);
        }
    }
}