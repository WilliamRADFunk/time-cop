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
            const x1 = position[0] + rad;
            const z1 = position[1] - rad;
            const maxZDist = 6 + z1;
            const maxXDist = 6 - x1
            const dist = Math.sqrt(maxZDist * maxZDist + maxXDist * maxXDist);
            const x2 = dist * Math.cos(0.785398);
            const z2 = dist * Math.sin(0.785398);
            return [
                x1,
                z1,
                x2,
                -z2
            ];
        }
        case EntityDirection.Right: {
            return  [
                position[0] + radius - (radius * 0.2),
                position[1] - (radius * 0.15),
                5.7,
                position[1] - (radius * 0.15),
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
                position[0] - radius + (radius * 0.2),
                position[1] + (radius * 0.1),
                -5.7,
                position[1] + (radius * 0.1)
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
                position[0] - radius + (radius * 0.2),
                position[1] - (radius * 0.1),
                -5.7,
                position[1] - (radius * 0.1),
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
                position[0] + radius - (radius * 0.2),
                position[1] + (radius * 0.05),
                5.7,
                position[1] + (radius * 0.05),
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