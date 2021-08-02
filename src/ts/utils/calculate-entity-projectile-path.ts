import { EntityDirection } from "../models/entity";

export function calculateEntityProjectilePathMain(dir: EntityDirection, position: number[], radius: number): [number, number, number, number] {
    switch(dir) {
        case EntityDirection.Up: {
            return [
                position[0] - (radius * 0.11),
                position[1] - radius + (radius * 0.1),
                position[0] - (radius * 0.11),
                -5.7
            ];
        }
        case EntityDirection.Up_Right: {
            const rad = (radius / 2);
            const x1 = position[0] + rad;
            const z1 = position[1] - rad - (radius * 0.2);
            const maxZDist = 5.7 + z1;
            const maxXDist = 5.7 - x1;
            let x2;
            let z2;
            if (maxZDist < maxXDist) {
                z2 = z1 - maxZDist;
                x2 = x1 + maxZDist;
            } else {
                z2 = z1 - maxXDist;
                x2 = x1 + maxXDist;
            }
            return [
                x1,
                z1,
                x2,
                z2
            ];
        }
        case EntityDirection.Right: {
            return  [
                position[0] + radius - (radius * 0.1),
                position[1] - (radius * 0.15),
                5.7,
                position[1] - (radius * 0.15),
            ];
        }
        case EntityDirection.Down_Right: {
            const rad = (radius / 2);
            const x1 = position[0] + rad;
            const z1 = position[1] + rad;
            const maxZDist = 5.7 + z1;
            const maxXDist = 5.7 + x1;
            let x2;
            let z2;
            if (maxZDist < maxXDist) {
                z2 = z1 + maxZDist;
                x2 = x1 + maxZDist;
            } else {
                z2 = z1 + maxXDist;
                x2 = x1 + maxXDist;
            }
            return [
                x1,
                z1,
                x2,
                z2
            ];
        }
        case EntityDirection.Down: {
            return  [
                position[0] + (radius * 0.11),
                position[1] + radius - (radius * 0.1),
                position[0] + (radius * 0.11),
                5.7
            ];
        }
        case EntityDirection.Down_Left: {
            const rad = (radius / 2);
            const x1 = position[0] - rad;
            const z1 = position[1] + rad;
            const maxZDist = 5.7 + z1;
            const maxXDist = 5.7 - x1;
            let x2;
            let z2;
            if (maxZDist < maxXDist) {
                z2 = z1 + maxZDist;
                x2 = x1 - maxZDist;
            } else {
                z2 = z1 + maxXDist;
                x2 = x1 - maxXDist;
            }
            return [
                x1,
                z1,
                x2,
                z2
            ];
        }
        case EntityDirection.Left: {
            return  [
                position[0] - radius + (radius * 0.1),
                position[1] + (radius * 0.1),
                -5.7,
                position[1] + (radius * 0.1)
            ];
        }
        case EntityDirection.Up_Left: {
            const rad = (radius / 2);
            const x1 = position[0] - rad;
            const z1 = position[1] - rad;
            const maxZDist = 5.7 - z1;
            const maxXDist = 5.7 - x1;
            let x2;
            let z2;
            if (maxZDist < maxXDist) {
                z2 = z1 - maxZDist;
                x2 = x1 - maxZDist;
            } else {
                z2 = z1 - maxXDist;
                x2 = x1 - maxXDist;
            }
            return [
                x1,
                z1,
                x2,
                z2
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
                position[0] - (radius * 0.05),
                position[1] + radius - (radius * 0.1),
                position[0] - (radius * 0.05),
                5.7
            ];
        }
        case EntityDirection.Up_Right: {
            const rad = (radius / 2);
            const x1 = position[0] - rad - (radius * 0.15);
            const z1 = position[1] + rad + (radius * 0.1);
            const maxZDist = 5.7 - z1;
            const maxXDist = 5.7 + x1;
            let x2;
            let z2;
            if (maxZDist < maxXDist) {
                z2 = z1 + maxZDist;
                x2 = x1 - maxZDist;
            } else {
                z2 = z1 + maxXDist;
                x2 = x1 - maxXDist;
            }
            return [
                x1,
                z1,
                x2,
                z2
            ];
        }
        case EntityDirection.Right: {
            return  [
                position[0] - radius + (radius * 0.1),
                position[1] - (radius * 0.1),
                -5.7,
                position[1] - (radius * 0.1),
            ];
        }
        case EntityDirection.Down_Right: {
            const rad = (radius / 2);
            const x1 = position[0] - rad;
            const z1 = position[1] - rad;
            const maxZDist = 5.7 - z1;
            const maxXDist = 5.7 - x1;
            let x2;
            let z2;
            if (maxZDist < maxXDist) {
                z2 = z1 - maxZDist;
                x2 = x1 - maxZDist;
            } else {
                z2 = z1 - maxXDist;
                x2 = x1 - maxXDist;
            }
            return [
                x1,
                z1,
                x2,
                z2
            ];
        }
        case EntityDirection.Down: {
            return [
                position[0] + (radius * 0.05),
                position[1] - radius + (radius * 0.1),
                position[0] + (radius * 0.05),
                -5.7
            ];
        }
        case EntityDirection.Down_Left: {
            const rad = (radius / 2);
            const x1 = position[0] + rad;
            const z1 = position[1] - rad;
            const maxZDist = 5.7 + z1;
            const maxXDist = 5.7 - x1;
            let x2;
            let z2;
            if (maxZDist < maxXDist) {
                z2 = z1 - maxZDist;
                x2 = x1 + maxZDist;
            } else {
                z2 = z1 - maxXDist;
                x2 = x1 + maxXDist;
            }
            return [
                x1,
                z1,
                x2,
                z2
            ];
        }
        case EntityDirection.Left: {
            return  [
                position[0] + radius - (radius * 0.1),
                position[1] + (radius * 0.05),
                5.7,
                position[1] + (radius * 0.05),
            ];
        }
        case EntityDirection.Up_Left: {
            const rad = (radius / 2);
            const x1 = position[0] + rad;
            const z1 = position[1] + rad;
            const maxZDist = 5.7 + z1;
            const maxXDist = 5.7 + x1;
            let x2;
            let z2;
            if (maxZDist < maxXDist) {
                z2 = z1 + maxZDist;
                x2 = x1 + maxZDist;
            } else {
                z2 = z1 + maxXDist;
                x2 = x1 + maxXDist;
            }
            return [
                x1,
                z1,
                x2,
                z2
            ];
        }
        default: {
            console.error('calculateEntityProjectilePathSecondary: Impossible dirrection key', dir, position, radius);
        }
    }
}