import { CircleGeometry, Mesh, MeshBasicMaterial } from "three";
import { RAD_90_DEG_LEFT } from "./radians-x-degrees-left";

/**
 * Makes all the team member meshes for the game map.
 */
export function makeEntity(
    animationMeshArray: [Mesh, Mesh, Mesh],
    geo: CircleGeometry,
    material: MeshBasicMaterial,
    index: number,
    pos: [number, number, number],
    name: string
): void {
    animationMeshArray[index] = new Mesh( geo, material );
    animationMeshArray[index].position.set(pos[0], pos[1], pos[2]);
    animationMeshArray[index].rotation.set(RAD_90_DEG_LEFT, 0, 0);
    animationMeshArray[index].name = name;
    animationMeshArray[index].visible = index ? false : true;
}