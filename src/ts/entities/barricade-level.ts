import { Scene } from "three";
import { CollisionatorSingleton } from "../collisionator";
import { BarricadeLevelPiece } from "./barricade-level-piece";


// [
//     [ -0.3, -4.6 ], [ -0.2, -4.6 ], [ -0.1, -4.6 ], [ 0, -4.6 ], [ 0.1, -4.6 ], [ 0.2, -4.6 ], [ 0.3, -4.6 ],
//     [ -0.3, -4.5 ], [ -0.2, -4.5 ], [ -0.1, -4.5 ], [ 0, -4.5 ],  [ 0.1, -4.5 ], [ 0.2, -4.5 ], [ 0.3, -4.5 ],
//     [ -0.3, -4.4 ], [ -0.2, -4.4 ], [ -0.1, -4.4 ], [ 0, -4.4 ],  [ 0.1, -4.4 ], [ 0.2, -4.4 ], [ 0.3, -4.4 ],
//     [ -0.3, -4.3 ], [ -0.2, -4.3 ], [ -0.1, -4.3 ], [ 0, -4.3 ],  [ 0.1, -4.3 ], [ 0.2, -4.3 ], [ 0.3, -4.3 ],
//     [ -0.3, -4.2 ], [ -0.2, -4.2 ], [ -0.1, -4.2 ], [ 0, -4.2 ],  [ 0.1, -4.2 ], [ 0.2, -4.2 ], [ 0.3, -4.2 ],
//     [ -0.3, -4.1 ], [ -0.2, -4.1 ], [ -0.1, -4.1 ], [ 0, -4.1 ],  [ 0.1, -4.1 ], [ 0.2, -4.1 ], [ 0.3, -4.1 ],
//     [ -0.3, -4 ], [ -0.2, -4 ], [ -0.1, -4 ], [ 0, -4 ], [ 0.1, -4 ], [ 0.2, -4 ], [ 0.3, -4 ],
// ]

export const LevelBaricadePositions: [number, number][][] = [
    [],
    [
        [ -0.3, -4.6 ], [ -0.2, -4.6 ], [ -0.1, -4.6 ], [ 0, -4.6 ], [ 0.1, -4.6 ], [ 0.2, -4.6 ], [ 0.3, -4.6 ],
        [ -0.3, -4.5 ], [ -0.2, -4.5 ], [ 0.1, -4.5 ], [ 0.2, -4.5 ], [ 0.3, -4.5 ],
        [ -0.3, -4.4 ], [ -0.2, -4.4 ], [ -0.1, -4.4 ], [ 0.1, -4.4 ], [ 0.2, -4.4 ], [ 0.3, -4.4 ],
        [ -0.3, -4.3 ], [ -0.2, -4.3 ], [ -0.1, -4.3 ], [ 0.1, -4.3 ], [ 0.2, -4.3 ], [ 0.3, -4.3 ],
        [ -0.3, -4.2 ], [ -0.2, -4.2 ], [ -0.1, -4.2 ], [ 0.1, -4.2 ], [ 0.2, -4.2 ], [ 0.3, -4.2 ],
        [ -0.3, -4.1 ], [ -0.2, -4.1 ], [ 0.2, -4.1 ], [ 0.3, -4.1 ],
        [ -0.3, -4 ], [ -0.2, -4 ], [ -0.1, -4 ], [ 0, -4 ], [ 0.1, -4 ], [ 0.2, -4 ], [ 0.3, -4 ],
    ],
    [
        [ -0.3, -4.6 ], [ -0.2, -4.6 ], [ -0.1, -4.6 ], [ 0, -4.6 ], [ 0.1, -4.6 ], [ 0.2, -4.6 ], [ 0.3, -4.6 ],
        [ -0.3, -4.5 ], [ -0.2, -4.5 ], [ 0.2, -4.5 ], [ 0.3, -4.5 ],
        [ -0.3, -4.4 ], [ -0.2, -4.4 ], [ -0.1, -4.4 ], [ 0, -4.4 ], [ 0.2, -4.4 ], [ 0.3, -4.4 ],
        [ -0.3, -4.3 ], [ -0.2, -4.3 ], [ 0.2, -4.3 ], [ 0.3, -4.3 ],
        [ -0.3, -4.2 ], [ -0.2, -4.2 ], [ 0, -4.2 ],  [ 0.1, -4.2 ], [ 0.2, -4.2 ], [ 0.3, -4.2 ],
        [ -0.3, -4.1 ], [ -0.2, -4.1 ], [ 0.2, -4.1 ], [ 0.3, -4.1 ],
        [ -0.3, -4 ], [ -0.2, -4 ], [ -0.1, -4 ], [ 0, -4 ], [ 0.1, -4 ], [ 0.2, -4 ], [ 0.3, -4 ],
    ],
    [
        [ -0.3, -4.6 ], [ -0.2, -4.6 ], [ -0.1, -4.6 ], [ 0, -4.6 ], [ 0.1, -4.6 ], [ 0.2, -4.6 ], [ 0.3, -4.6 ],
        [ -0.3, -4.5 ], [ -0.2, -4.5 ], [ 0.2, -4.5 ], [ 0.3, -4.5 ],
        [ -0.3, -4.4 ], [ -0.2, -4.4 ], [ -0.1, -4.4 ], [ 0, -4.4 ], [ 0.2, -4.4 ], [ 0.3, -4.4 ],
        [ -0.3, -4.3 ], [ -0.2, -4.3 ], [ 0.2, -4.3 ], [ 0.3, -4.3 ],
        [ -0.3, -4.2 ], [ -0.2, -4.2 ], [ -0.1, -4.2 ], [ 0, -4.2 ], [ 0.2, -4.2 ], [ 0.3, -4.2 ],
        [ -0.3, -4.1 ], [ -0.2, -4.1 ], [ 0.2, -4.1 ], [ 0.3, -4.1 ],
        [ -0.3, -4 ], [ -0.2, -4 ], [ -0.1, -4 ], [ 0, -4 ], [ 0.1, -4 ], [ 0.2, -4 ], [ 0.3, -4 ],
    ],
    [
        [ -0.3, -4.6 ], [ -0.2, -4.6 ], [ -0.1, -4.6 ], [ 0, -4.6 ], [ 0.1, -4.6 ], [ 0.2, -4.6 ], [ 0.3, -4.6 ],
        [ -0.3, -4.5 ], [ -0.2, -4.5 ], [ 0, -4.5 ], [ 0.2, -4.5 ], [ 0.3, -4.5 ],
        [ -0.3, -4.4 ], [ -0.2, -4.4 ], [ 0, -4.4 ], [ 0.2, -4.4 ], [ 0.3, -4.4 ],
        [ -0.3, -4.3 ], [ -0.2, -4.3 ], [ 0.2, -4.3 ], [ 0.3, -4.3 ],
        [ -0.3, -4.2 ], [ -0.2, -4.2 ], [ -0.1, -4.2 ], [ 0, -4.2 ], [ 0.2, -4.2 ], [ 0.3, -4.2 ],
        [ -0.3, -4.1 ], [ -0.2, -4.1 ], [ -0.1, -4.1 ], [ 0, -4.1 ], [ 0.2, -4.1 ], [ 0.3, -4.1 ],
        [ -0.3, -4 ], [ -0.2, -4 ], [ -0.1, -4 ], [ 0, -4 ], [ 0.1, -4 ], [ 0.2, -4 ], [ 0.3, -4 ],
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

        const barrPositions = LevelBaricadePositions[level];
        for (let i = 0; i < barrPositions.length; i++) {
            const barricade = new BarricadeLevelPiece(this._scene, barrPositions[i][0], barrPositions[i][1], yPos);
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