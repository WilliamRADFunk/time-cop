import { Scene } from "three";
import { CollisionatorSingleton } from "../collisionator";
import { BarricadeLevelPiece } from "./barricade-level-piece";

// [
//     [ -0.35, 4.1 ], [ -0.3, 4.1 ], [ -0.25, 4.1 ], [ -0.2, 4.1 ], [ -0.15, 4.1 ], [ -0.1, 4.1 ], [ -0.05, 4.1 ], [ 0, 4.1 ], [ 0.05, 4.1 ], [ 0.1, 4.1 ], [ 0.15, 4.1 ], [ 0.2, 4.1 ], [ 0.25, 4.1 ], [ 0.3, 4.1 ], [ 0.35, 4.1 ],
//     [ -0.4, 4.15 ], [ -0.35, 4.15 ], [ -0.3, 4.15 ], [ -0.25, 4.15 ], [ -0.2, 4.15 ], [ -0.15, 4.15 ], [ -0.1, 4.15 ], [ -0.05, 4.15 ], [ 0, 4.15 ], [ 0.05, 4.15 ], [ 0.1, 4.15 ], [ 0.15, 4.15 ], [ 0.2, 4.15 ], [ 0.25, 4.15 ], [ 0.3, 4.15 ], [ 0.35, 4.15 ], [ 0.4, 4.15 ],
//     [ -0.35, 4.2 ], [ -0.3, 4.2 ], [ -0.25, 4.2 ], [ -0.2, 4.2 ], [ -0.15, 4.2 ], [ -0.1, 4.2 ], [ -0.05, 4.2 ], [ 0, 4.2 ], [ 0.05, 4.2 ], [ 0.1, 4.2 ], [ 0.15, 4.2 ], [ 0.2, 4.2 ], [ 0.25, 4.2 ], [ 0.3, 4.2 ], [ 0.35, 4.2 ],
//     [ -0.4, 4.25 ], [ -0.35, 4.25 ], [ -0.3, 4.25 ], [ -0.25, 4.25 ], [ -0.2, 4.25 ], [ -0.15, 4.25 ], [ -0.1, 4.25 ], [ -0.05, 4.25 ], [ 0, 4.25 ], [ 0.05, 4.25 ], [ 0.1, 4.25 ], [ 0.15, 4.25 ], [ 0.2, 4.25 ], [ 0.25, 4.25 ], [ 0.3, 4.25 ], [ 0.35, 4.25 ], [ 0.4, 4.25 ],
//     [ -0.35, 4.3 ], [ -0.3, 4.3 ], [ -0.25, 4.3 ], [ -0.2, 4.3 ], [ -0.15, 4.3 ], [ -0.1, 4.3 ], [ -0.05, 4.3 ], [ 0, 4.3 ], [ 0.05, 4.3 ], [ 0.1, 4.3 ], [ 0.15, 4.3 ], [ 0.2, 4.3 ], [ 0.25, 4.3 ], [ 0.3, 4.3 ], [ 0.35, 4.3 ],
//     [ -0.4, 4.35 ], [ -0.35, 4.35 ], [ -0.3, 4.35 ], [ -0.25, 4.35 ], [ -0.2, 4.35 ], [ -0.15, 4.35 ], [ -0.1, 4.35 ], [ -0.05, 4.35 ], [ 0, 4.35 ], [ 0.05, 4.35 ], [ 0.1, 4.35 ], [ 0.15, 4.35 ], [ 0.2, 4.35 ], [ 0.25, 4.35 ], [ 0.3, 4.35 ], [ 0.35, 4.35 ], [ 0.4, 4.35 ],
//     [ -0.35, 4.4 ], [ -0.3, 4.4 ], [ -0.25, 4.4 ], [ -0.2, 4.4 ], [ -0.15, 4.4 ], [ -0.1, 4.4 ], [ -0.05, 4.4 ], [ 0, 4.4 ], [ 0.05, 4.4 ], [ 0.1, 4.4 ], [ 0.15, 4.4 ], [ 0.2, 4.4 ], [ 0.25, 4.4 ], [ 0.3, 4.4 ], [ 0.35, 4.4 ],
//     [ -0.4, 4.45 ], [ -0.35, 4.45 ], [ -0.3, 4.45 ], [ -0.25, 4.45 ], [ -0.2, 4.45 ], [ -0.15, 4.45 ], [ -0.1, 4.45 ], [ -0.05, 4.45 ], [ 0, 4.45 ], [ 0.05, 4.45 ], [ 0.1, 4.45 ], [ 0.15, 4.45 ], [ 0.2, 4.45 ], [ 0.25, 4.45 ], [ 0.3, 4.45 ], [ 0.35, 4.45 ], [ 0.4, 4.45 ],
//     [ -0.35, 4.5 ], [ -0.3, 4.5 ], [ -0.25, 4.5 ], [ -0.2, 4.5 ], [ -0.15, 4.5 ], [ -0.1, 4.5 ], [ -0.05, 4.5 ], [ 0, 4.5 ], [ 0.05, 4.5 ], [ 0.1, 4.5 ], [ 0.15, 4.5 ], [ 0.2, 4.5 ], [ 0.25, 4.5 ], [ 0.3, 4.5 ], [ 0.35, 4.5 ],
// ]

const center1TopPositions: [number, number][] = [
    [ 0, -4.5 ],
    [ -0.05, -4.45 ], [ 0, -4.45 ],
    [ 0, -4.4 ],
    [ 0, -4.35 ],
    [ 0, -4.3 ],
    [ 0, -4.25 ],
    [ 0, -4.2 ],
    [ 0, -4.15 ],
    [ -0.1, -4.1 ], [ -0.05, -4.1 ], [ 0, -4.1 ], [ 0.05, -4.1 ], [ 0.1, -4.1 ]
];

const center1BottomPositions: [number, number][] = [
    [ 0, 4.1 ],
    [ -0.05, 4.15 ], [ 0, 4.15 ],
    [ 0, 4.2 ],
    [ 0, 4.25 ],
    [ 0, 4.3 ],
    [ 0, 4.35 ],
    [ 0, 4.4 ],
    [ 0, 4.45 ],
    [ -0.1, 4.5 ], [ -0.05, 4.5 ], [ 0, 4.5 ], [ 0.05, 4.5 ], [ 0.1, 4.5 ]
];

const center2TopPositions: [number, number][] = [
    [ -0.1, -4.5 ], [ -0.05, -4.5 ], [ 0, -4.5 ], [ 0.05, -4.5 ], [ 0.1, -4.5 ],
    [ 0.1, -4.45 ],
    [ 0.1, -4.4 ],
    [ 0.1, -4.35 ],
    [ -0.1, -4.3 ], [ -0.05, -4.3 ], [ 0, -4.3 ], [ 0.05, -4.3 ], [ 0.1, -4.3 ],
    [ -0.1, -4.25 ],
    [ -0.1, -4.2 ],
    [ -0.1, -4.15 ],
    [ -0.1, -4.1 ], [ -0.05, -4.1 ], [ 0, -4.1 ], [ 0.05, -4.1 ], [ 0.1, -4.1 ],
];

const center2BottomPositions: [number, number][] = [
    [ -0.1, 4.1 ], [ -0.05, 4.1 ], [ 0, 4.1 ], [ 0.05, 4.1 ], [ 0.1, 4.1 ],
    [ 0.1, 4.15 ],
    [ 0.1, 4.2 ],
    [ 0.1, 4.25 ],
    [ -0.1, 4.3 ], [ -0.05, 4.3 ], [ 0, 4.3 ], [ 0.05, 4.3 ], [ 0.1, 4.3 ],
    [ -0.1, 4.35 ],
    [ -0.1, 4.4 ],
    [ -0.1, 4.45 ],
    [ -0.1, 4.5 ], [ -0.05, 4.5 ], [ 0, 4.5 ], [ 0.05, 4.5 ], [ 0.1, 4.5 ],
];

const center3TopPositions: [number, number][] = [
    [ -0.1, -4.5 ], [ -0.05, -4.5 ], [ 0, -4.5 ], [ 0.05, -4.5 ], [ 0.1, -4.5 ],
    [ 0.1, -4.45 ],
    [ 0.1, -4.4 ],
    [ 0.1, -4.35 ],
    [ -0.1, -4.3 ], [ -0.05, -4.3 ], [ 0, -4.3 ], [ 0.05, -4.3 ], [ 0.1, -4.3 ],
    [ 0.1, -4.25 ],
    [ 0.1, -4.2 ],
    [ 0.1, -4.15 ],
    [ -0.1, -4.1 ], [ -0.05, -4.1 ], [ 0, -4.1 ], [ 0.05, -4.1 ], [ 0.1, -4.1 ],
];

const center3BottomPositions: [number, number][] = [
    [ -0.1, 4.1 ], [ -0.05, 4.1 ], [ 0, 4.1 ], [ 0.05, 4.1 ], [ 0.1, 4.1 ],
    [ 0.1, 4.15 ],
    [ 0.1, 4.2 ],
    [ 0.1, 4.25 ],
    [ -0.1, 4.3 ], [ -0.05, 4.3 ], [ 0, 4.3 ], [ 0.05, 4.3 ], [ 0.1, 4.3 ],
    [ 0.1, 4.35 ],
    [ 0.1, 4.4 ],
    [ 0.1, 4.45 ],
    [ -0.1, 4.5 ], [ -0.05, 4.5 ], [ 0, 4.5 ], [ 0.05, 4.5 ], [ 0.1, 4.5 ],
];

const center4TopPositions: [number, number][] = [
    [ 0.1, -4.5 ],
    [ 0.05, -4.45 ], [ 0.1, -4.45 ],
    [ 0, -4.4 ], [ 0.1, -4.4 ],
    [ -0.05, -4.35 ], [ 0.1, -4.35 ],
    [ -0.1, -4.3 ],  [ 0.1, -4.3 ],
    [ -0.1, -4.25 ], [ -0.05, -4.25 ], [ 0, -4.25 ], [ 0.05, -4.25 ], [ 0.1, -4.25 ], [ 0.15, -4.25 ],
    [ 0.1, -4.2 ],
    [ 0.1, -4.15 ],
    [ 0.1, -4.1 ],
];

const center4BottomPositions: [number, number][] = [
    [ 0.1, 4.1 ],
    [ 0.05, 4.15 ], [ 0.1, 4.15 ],
    [ 0, 4.2 ], [ 0.1, 4.2 ],
    [ -0.05, 4.25 ], [ 0.1, 4.25 ],
    [ -0.1, 4.3 ],  [ 0.1, 4.3 ],
    [ -0.1, 4.35 ], [ -0.05, 4.35 ], [ 0, 4.35 ], [ 0.05, 4.35 ], [ 0.1, 4.35 ], [ 0.15, 4.35 ],
    [ 0.1, 4.4 ],
    [ 0.1, 4.45 ],
    [ 0.1, 4.5 ],
];

const center5TopPositions: [number, number][] = [
    [ -0.1, -4.5 ], [ -0.05, -4.5 ], [ 0, -4.5 ], [ 0.05, -4.5 ], [ 0.1, -4.5 ],
    [ -0.1, -4.45 ],
    [ -0.1, -4.4 ],
    [ -0.1, -4.35 ],
    [ -0.1, -4.3 ], [ -0.05, -4.3 ], [ 0, -4.3 ], [ 0.05, -4.3 ], [ 0.1, -4.3 ],
    [ 0.1, -4.25 ],
    [ 0.1, -4.2 ],
    [ 0.1, -4.15 ],
    [ -0.1, -4.1 ], [ -0.05, -4.1 ], [ 0, -4.1 ], [ 0.05, -4.1 ], [ 0.1, -4.1 ],
];

const center5BottomPositions: [number, number][] = [
    [ -0.1, 4.1 ], [ -0.05, 4.1 ], [ 0, 4.1 ], [ 0.05, 4.1 ], [ 0.1, 4.1 ],
    [ -0.1, 4.15 ],
    [ -0.1, 4.2 ],
    [ -0.1, 4.25 ],
    [ -0.1, 4.3 ], [ -0.05, 4.3 ], [ 0, 4.3 ], [ 0.05, 4.3 ], [ 0.1, 4.3 ],
    [ 0.1, 4.35 ],
    [ 0.1, 4.4 ],
    [ 0.1, 4.45 ],
    [ -0.1, 4.5 ], [ -0.05, 4.5 ], [ 0, 4.5 ], [ 0.05, 4.5 ], [ 0.1, 4.5 ],
];

const center6TopPositions: [number, number][] = [
    [ -0.1, -4.5 ], [ -0.05, -4.5 ], [ 0, -4.5 ], [ 0.05, -4.5 ], [ 0.1, -4.5 ],
    [ -0.1, -4.45 ],
    [ -0.1, -4.4 ],
    [ -0.1, -4.35 ],
    [ -0.1, -4.3 ], [ -0.05, -4.3 ], [ 0, -4.3 ], [ 0.05, -4.3 ], [ 0.1, -4.3 ],
    [ -0.1, -4.25 ], [ 0.1, -4.25 ],
    [ -0.1, -4.2 ],  [ 0.1, -4.2 ],
    [ -0.1, -4.15 ], [ 0.1, -4.15 ],
    [ -0.1, -4.1 ], [ -0.05, -4.1 ], [ 0, -4.1 ], [ 0.05, -4.1 ], [ 0.1, -4.1 ],
];

const center6BottomPositions: [number, number][] = [
    [ -0.1, 4.1 ], [ -0.05, 4.1 ], [ 0, 4.1 ], [ 0.05, 4.1 ], [ 0.1, 4.1 ],
    [ -0.1, 4.15 ],
    [ -0.1, 4.2 ],
    [ -0.1, 4.25 ],
    [ -0.1, 4.3 ], [ -0.05, 4.3 ], [ 0, 4.3 ], [ 0.05, 4.3 ], [ 0.1, 4.3 ],
    [ -0.1, 4.35 ], [ 0.1, 4.35 ],
    [ -0.1, 4.4 ], [ 0.1, 4.4 ],
    [ -0.1, 4.45 ], [ 0.1, 4.45 ],
    [ -0.1, 4.5 ], [ -0.05, 4.5 ], [ 0, 4.5 ], [ 0.05, 4.5 ], [ 0.1, 4.5 ],
];

const center7TopPositions: [number, number][] = [
    [ -0.1, -4.5 ], [ -0.05, -4.5 ], [ 0, -4.5 ], [ 0.05, -4.5 ], [ 0.1, -4.5 ],
    [ -0.1, -4.45 ], [ 0.1, -4.45 ],
    [ 0.1, -4.4 ],
    [ 0.05, -4.35 ],
    [ 0, -4.3 ],
    [ 0, -4.25 ],
    [ 0, -4.2 ],
    [ 0, -4.15 ],
    [ 0, -4.1 ],
];

const center7BottomPositions: [number, number][] = [
    [ -0.1, 4.1 ], [ -0.05, 4.1 ], [ 0, 4.1 ], [ 0.05, 4.1 ], [ 0.1, 4.1 ],
    [ -0.1, 4.15 ], [ 0.1, 4.15 ],
    [ 0.1, 4.2 ],
    [ 0.05, 4.25 ],
    [ 0, 4.3 ],
    [ 0, 4.35 ],
    [ 0, 4.4 ],
    [ 0, 4.45 ],
    [ 0, 4.5 ],
];

const center8TopPositions: [number, number][] = [
    [ -0.1, -4.5 ], [ -0.05, -4.5 ], [ 0, -4.5 ], [ 0.05, -4.5 ], [ 0.1, -4.5 ],
    [ -0.1, -4.45 ], [ 0.1, -4.45 ],
    [ -0.1, -4.4 ], [ 0.1, -4.4 ],
    [ -0.1, -4.35 ], [ 0.1, -4.35 ],
    [ -0.1, -4.3 ], [ -0.05, -4.3 ], [ 0, -4.3 ], [ 0.05, -4.3 ], [ 0.1, -4.3 ],
    [ -0.1, -4.25 ], [ 0.1, -4.25 ],
    [ -0.1, -4.2 ],  [ 0.1, -4.2 ],
    [ -0.1, -4.15 ], [ 0.1, -4.15 ],
    [ -0.1, -4.1 ], [ -0.05, -4.1 ], [ 0, -4.1 ], [ 0.05, -4.1 ], [ 0.1, -4.1 ],
];

const center8BottomPositions: [number, number][] = [
    [ -0.1, 4.1 ], [ -0.05, 4.1 ], [ 0, 4.1 ], [ 0.05, 4.1 ], [ 0.1, 4.1 ],
    [ -0.1, 4.15 ], [ 0.1, 4.15 ],
    [ -0.1, 4.2 ], [ 0.1, 4.2 ],
    [ -0.1, 4.25 ],[ 0.1, 4.25 ],
    [ -0.1, 4.3 ], [ -0.05, 4.3 ], [ 0, 4.3 ], [ 0.05, 4.3 ], [ 0.1, 4.3 ],
    [ -0.1, 4.35 ], [ 0.1, 4.35 ],
    [ -0.1, 4.4 ], [ 0.1, 4.4 ],
    [ -0.1, 4.45 ], [ 0.1, 4.45 ],
    [ -0.1, 4.5 ], [ -0.05, 4.5 ], [ 0, 4.5 ], [ 0.05, 4.5 ], [ 0.1, 4.5 ],
];

const center9TopPositions: [number, number][] = [
    [ -0.1, -4.5 ], [ -0.05, -4.5 ], [ 0, -4.5 ], [ 0.05, -4.5 ], [ 0.1, -4.5 ],
    [ -0.1, -4.45 ], [ 0.1, -4.45 ],
    [ -0.1, -4.4 ], [ 0.1, -4.4 ],
    [ -0.1, -4.35 ], [ 0.1, -4.35 ],
    [ -0.1, -4.3 ], [ -0.05, -4.3 ], [ 0, -4.3 ], [ 0.05, -4.3 ], [ 0.1, -4.3 ],
    [ 0.1, -4.25 ],
    [ 0.1, -4.2 ],
    [ 0.1, -4.15 ],
    [ 0.1, -4.1 ],
];

const center9BottomPositions: [number, number][] = [
    [ -0.1, 4.1 ], [ -0.05, 4.1 ], [ 0, 4.1 ], [ 0.05, 4.1 ], [ 0.1, 4.1 ],
    [ -0.1, 4.15 ], [ 0.1, 4.15 ],
    [ -0.1, 4.2 ], [ 0.1, 4.2 ],
    [ -0.1, 4.25 ],[ 0.1, 4.25 ],
    [ -0.1, 4.3 ], [ -0.05, 4.3 ], [ 0, 4.3 ], [ 0.05, 4.3 ], [ 0.1, 4.3 ],
    [ 0.1, 4.35 ],
    [ 0.1, 4.4 ],
    [ 0.1, 4.45 ],
    [ 0.1, 4.5 ]
];

const right0TopPositions: [number, number][] = [
    [ 0.05, -4.5 ], [ 0.1, -4.5 ], [ 0.15, -4.5 ], [ 0.2, -4.5 ], [ 0.25, -4.5 ],
    [ 0.05, -4.45 ], [ 0.25, -4.45 ],
    [ 0.05, -4.4 ], [ 0.25, -4.4 ],
    [ 0.05, -4.35 ], [ 0.25, -4.35 ],
    [ 0.05, -4.3 ], [ 0.25, -4.3 ],
    [ 0.05, -4.25 ], [ 0.25, -4.25 ],
    [ 0.05, -4.2 ],  [ 0.25, -4.2 ],
    [ 0.05, -4.15 ], [ 0.25, -4.15 ],
    [ 0.05, -4.1 ], [ 0.1, -4.1 ], [ 0.15, -4.1 ], [ 0.2, -4.1 ], [ 0.25, -4.1 ],
];

const right0BottomPositions: [number, number][] = [
    [ 0.05, 4.1 ], [ 0.1, 4.1 ], [ 0.15, 4.1 ], [ 0.2, 4.1 ], [ 0.25, 4.1 ],
    [ 0.05, 4.15 ], [ 0.25, 4.15 ],
    [ 0.05, 4.2 ], [ 0.25, 4.2 ],
    [ 0.05, 4.25 ],[ 0.25, 4.25 ],
    [ 0.05, 4.3 ], [ 0.25, 4.3 ],
    [ 0.05, 4.35 ], [ 0.25, 4.35 ],
    [ 0.05, 4.4 ], [ 0.25, 4.4 ],
    [ 0.05, 4.45 ], [ 0.25, 4.45 ],
    [ 0.05, 4.5 ], [ 0.1, 4.5 ], [ 0.15, 4.5 ], [ 0.2, 4.5 ], [ 0.25, 4.5 ],
];

const BarricadeBase: [number, number][] = [
    [ -0.4, -4.6 ], [ -0.35, -4.6 ], [ -0.3, -4.6 ], [ 0.3, -4.6 ], [ 0.35, -4.6 ], [ 0.4, -4.6 ],
    [ -0.4, -4.55 ], [ -0.35, -4.55 ], [ -0.3, -4.55 ], [ -0.25, -4.55 ], [ -0.2, -4.55 ], [ -0.15, -4.55 ], [ -0.1, -4.55 ], [ -0.05, -4.55 ], [ 0, -4.55 ], [ 0.05, -4.55 ], [ 0.1, -4.55 ], [ 0.15, -4.55 ], [ 0.2, -4.55 ], [ 0.25, -4.55 ], [ 0.3, -4.55 ], [ 0.35, -4.55 ], [ 0.4, -4.55 ],
    [ -0.35, -4.5 ], [ -0.3, -4.5 ], [ -0.25, -4.5 ], [ -0.2, -4.5 ], [ -0.15, -4.5 ], [ -0.1, -4.5 ], [ -0.05, -4.5 ], [ 0, -4.5 ], [ 0.05, -4.5 ], [ 0.1, -4.5 ], [ 0.15, -4.5 ], [ 0.2, -4.5 ], [ 0.25, -4.5 ], [ 0.3, -4.5 ], [ 0.35, -4.5 ],
    [ -0.4, -4.45 ], [ -0.35, -4.45 ], [ -0.3, -4.45 ], [ -0.25, -4.45 ], [ -0.2, -4.45 ], [ -0.15, -4.45 ], [ -0.1, -4.45 ], [ -0.05, -4.45 ], [ 0, -4.45 ], [ 0.05, -4.45 ], [ 0.1, -4.45 ], [ 0.15, -4.45 ], [ 0.2, -4.45 ], [ 0.25, -4.45 ], [ 0.3, -4.45 ], [ 0.35, -4.45 ], [ 0.4, -4.45 ],
    [ -0.35, -4.4 ], [ -0.3, -4.4 ], [ -0.25, -4.4 ], [ -0.2, -4.4 ], [ -0.15, -4.4 ], [ -0.1, -4.4 ], [ -0.05, -4.4 ], [ 0, -4.4 ], [ 0.05, -4.4 ], [ 0.1, -4.4 ], [ 0.15, -4.4 ], [ 0.2, -4.4 ], [ 0.25, -4.4 ], [ 0.3, -4.4 ], [ 0.35, -4.4 ],
    [ -0.4, -4.35 ], [ -0.35, -4.35 ], [ -0.3, -4.35 ], [ -0.25, -4.35 ], [ -0.2, -4.35 ], [ -0.15, -4.35 ], [ -0.1, -4.35 ], [ -0.05, -4.35 ], [ 0, -4.35 ], [ 0.05, -4.35 ], [ 0.1, -4.35 ], [ 0.15, -4.35 ], [ 0.2, -4.35 ], [ 0.25, -4.35 ], [ 0.3, -4.35 ], [ 0.35, -4.35 ], [ 0.4, -4.35 ],
    [ -0.35, -4.3 ], [ -0.3, -4.3 ], [ -0.25, -4.3 ], [ -0.2, -4.3 ], [ -0.15, -4.3 ], [ -0.1, -4.3 ], [ -0.05, -4.3 ], [ 0, -4.3 ], [ 0.05, -4.3 ], [ 0.1, -4.3 ], [ 0.15, -4.3 ], [ 0.2, -4.3 ], [ 0.25, -4.3 ], [ 0.3, -4.3 ], [ 0.35, -4.3 ],
    [ -0.4, -4.25 ], [ -0.35, -4.25 ], [ -0.3, -4.25 ], [ -0.25, -4.25 ], [ -0.2, -4.25 ], [ -0.15, -4.25 ], [ -0.1, -4.25 ], [ -0.05, -4.25 ], [ 0, -4.25 ], [ 0.05, -4.25 ], [ 0.1, -4.25 ], [ 0.15, -4.25 ], [ 0.2, -4.25 ], [ 0.25, -4.25 ], [ 0.3, -4.25 ], [ 0.35, -4.25 ], [ 0.4, -4.25 ],
    [ -0.35, -4.2 ], [ -0.3, -4.2 ], [ -0.25, -4.2 ], [ -0.2, -4.2 ], [ -0.15, -4.2 ], [ -0.1, -4.2 ], [ -0.05, -4.2 ], [ 0, -4.2 ], [ 0.05, -4.2 ], [ 0.1, -4.2 ], [ 0.15, -4.2 ], [ 0.2, -4.2 ], [ 0.25, -4.2 ], [ 0.3, -4.2 ], [ 0.35, -4.2 ],
    [ -0.4, -4.15 ], [ -0.35, -4.15 ], [ -0.3, -4.15 ], [ -0.25, -4.15 ], [ -0.2, -4.15 ], [ -0.15, -4.15 ], [ -0.1, -4.15 ], [ -0.05, -4.15 ], [ 0, -4.15 ], [ 0.05, -4.15 ], [ 0.1, -4.15 ], [ 0.15, -4.15 ], [ 0.2, -4.15 ], [ 0.25, -4.15 ], [ 0.3, -4.15 ], [ 0.35, -4.15 ], [ 0.4, -4.15 ],
    [ -0.35, -4.1 ], [ -0.3, -4.1 ], [ -0.25, -4.1 ], [ -0.2, -4.1 ], [ -0.15, -4.1 ], [ -0.1, -4.1 ], [ -0.05, -4.1 ], [ 0, -4.1 ], [ 0.05, -4.1 ], [ 0.1, -4.1 ], [ 0.15, -4.1 ], [ 0.2, -4.1 ], [ 0.25, -4.1 ], [ 0.3, -4.1 ], [ 0.35, -4.1 ],
    [ -0.4, -4.05 ], [ -0.35, -4.05 ], [ -0.3, -4.05 ], [ -0.25, -4.05 ], [ -0.2, -4.05 ], [ -0.15, -4.05 ], [ -0.1, -4.05 ], [ -0.05, -4.05 ], [ 0, -4.05 ], [ 0.05, -4.05 ], [ 0.1, -4.05 ], [ 0.15, -4.05 ], [ 0.2, -4.05 ], [ 0.25, -4.05 ], [ 0.3, -4.05 ], [ 0.35, -4.05 ], [ 0.4, -4.05 ],
    [ -0.4, -4 ], [ -0.35, -4 ], [ -0.3, -4 ], [ 0.3, -4 ], [ 0.35, -4 ], [ 0.4, -4 ],
];

const LevelBaricadeTopPositions: [number, number][][] = [
    [],
    center1TopPositions,
    center2TopPositions,
    center3TopPositions,
    center4TopPositions,
    center5TopPositions,
    center6TopPositions,
    center7TopPositions,
    center8TopPositions,
    center9TopPositions,
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...right0TopPositions
    ],
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center1TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center2TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center3TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center4TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center5TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center6TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center7TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center8TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center9TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...right0TopPositions
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center1TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center2TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center3TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center4TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center5TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center6TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center7TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center8TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center9TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...right0TopPositions
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center1TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center2TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center3TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center4TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center5TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center6TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center7TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center8TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center9TopPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center4TopPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...right0TopPositions
    ]
];

const LevelBaricadeBottomPositions: [number, number][][] = [
    [],
    center1BottomPositions,
    center2BottomPositions,
    center3BottomPositions,
    center4BottomPositions,
    center5BottomPositions,
    center6BottomPositions,
    center7BottomPositions,
    center8BottomPositions,
    center9BottomPositions,
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...right0BottomPositions
    ],
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center1BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center2BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center3BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center4BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center5BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center6BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center7BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center8BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center1BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center9BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...right0BottomPositions
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center1BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center2BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center3BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center4BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center5BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center6BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center7BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center8BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center2BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center9BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...right0BottomPositions
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center1BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center2BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center3BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center4BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center5BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center6BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center7BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center8BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center3BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...(center9BottomPositions.map(pos => [pos[0] + 0.15, pos[1]] as [number, number])),
    ],
    [
        ...(center4BottomPositions.map(pos => [pos[0] - 0.15, pos[1]] as [number, number])),
        ...right0BottomPositions
    ]
];

/**
 * Static index to help name one barricade differenly than another.
 */
 let index: number = 0;

 /**
  * @class
  * An barricade that blocks bullets but is destroyed when hit.
  */
 export class BarricadeLevel {
    /**
     * Holds all the pieces of the barricade.
     */
    private _barricades: BarricadeLevelPiece[] = [];

    /**
     * Reference to the scene, used to remove barricade from rendering cycle once destroyed.
     */
    private _scene: Scene;

    /**
     * Constructor for the Post class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param level current level number to use in construction of level barricade.
     * @param yPos  layer level for barricade to appear.
     */
    constructor(scene: Scene, level: number, yPos?: number) {
        index++;
        this._scene = scene;

        for (let i = 0; i < BarricadeBase.length; i++) {
            let barricade = new BarricadeLevelPiece(this._scene, BarricadeBase[i][0], BarricadeBase[i][1], 0, level, yPos);
            CollisionatorSingleton.add(barricade);
            this._barricades.push(barricade);
            barricade = new BarricadeLevelPiece(this._scene, BarricadeBase[i][0], BarricadeBase[i][1] * -1, 0, level, yPos);
            CollisionatorSingleton.add(barricade);
            this._barricades.push(barricade);
        }

        const barrLevelTopPositions = LevelBaricadeTopPositions[level];
        const barrLevelBottomPositions = LevelBaricadeBottomPositions[level];
        for (let i = 0; i < barrLevelTopPositions.length; i++) {
            let barricade = new BarricadeLevelPiece(this._scene, barrLevelTopPositions[i][0], barrLevelTopPositions[i][1], 1, level, yPos);
            CollisionatorSingleton.add(barricade);
            this._barricades.push(barricade);
            barricade = new BarricadeLevelPiece(this._scene, barrLevelBottomPositions[i][0], barrLevelBottomPositions[i][1], 1, level, yPos);
            CollisionatorSingleton.add(barricade);
            this._barricades.push(barricade);
        }
    }

    /**
     * Removes object from the three.js scene.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     */
    public removeFromScene(): void {
        this._barricades.filter(x => x.getActive()).forEach(bar => bar.removeFromScene());
    }
}