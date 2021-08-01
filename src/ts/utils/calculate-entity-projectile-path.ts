import { EntityDirection } from "../models/entity";

export function calculateEntityProjectilePathMain(dir: EntityDirection, position: number[], radius: number): [number, number, number, number] {
    switch(dir) {
        case EntityDirection.Up: {
            return [
                position[0],
                position[1] - radius,
                position[0],
                -5.7
            ];
        }
        case EntityDirection.Up_Right: {
            const rad = (radius / 2);
            return [
                position[0] + rad,
                position[1] - rad,
                5.7,
                -5.7
            ];
        }
        case EntityDirection.Right: {
            return  [
                position[0] + radius,
                position[1],
                5.7,
                position[1]
            ];
        }
        case EntityDirection.Down_Right: {
            const rad = (radius / 2);
            return  [
                position[0] + rad,
                position[1] + rad,
                5.7,
                5.7
            ];
        }
        case EntityDirection.Down: {
            return  [
                position[0],
                position[1] + radius,
                position[0],
                5.7
            ];
        }
        case EntityDirection.Down_Left: {
            const rad = (radius / 2);
            return [
                position[0] - rad,
                position[1] + rad,
                -5.7,
                5.7
            ];
        }
        case EntityDirection.Left: {
            return  [
                position[0] - radius,
                position[1],
                -5.7,
                position[1]
            ];
        }
        case EntityDirection.Up_Left: {
            const rad = (radius / 2);
            return  [
                position[0] - rad,
                position[1] - rad,
                -5.7,
                -5.7
            ];
        }
        default: {
            console.error('calculateEntityProjectilePathMain: Impossible dirrection key', dir, position, radius);
        }
    }
}

export function calculateEntityProjectilePathSecondary(dir: EntityDirection, position: number[], radius: number): [number, number, number, number] {
    switch(dir) {
        case EntityDirection.Up: {
            return  [
                position[0],
                position[1] + radius,
                position[0],
                5.7
            ];
        }
        case EntityDirection.Up_Right: {
            const rad = (radius / 2);
            return [
                position[0] - rad,
                position[1] + rad,
                -5.7,
                5.7
            ];
        }
        case EntityDirection.Right: {
            return  [
                position[0] - radius,
                position[1],
                -5.7,
                position[1]
            ];
        }
        case EntityDirection.Down_Right: {
            const rad = (radius / 2);
            return  [
                position[0] - rad,
                position[1] - rad,
                -5.7,
                -5.7
            ];
        }
        case EntityDirection.Down: {
            return [
                position[0],
                position[1] - radius,
                position[0],
                -5.7
            ];
        }
        case EntityDirection.Down_Left: {
            const rad = (radius / 2);
            return [
                position[0] + rad,
                position[1] - rad,
                5.7,
                -5.7
            ];
        }
        case EntityDirection.Left: {
            return  [
                position[0] + radius,
                position[1],
                5.7,
                position[1]
            ];
        }
        case EntityDirection.Up_Left: {
            const rad = (radius / 2);
            return  [
                position[0] + rad,
                position[1] + rad,
                5.7,
                5.7
            ];
        }
        default: {
            console.error('calculateEntityProjectilePathSecondary: Impossible dirrection key', dir, position, radius);
        }
    }
}