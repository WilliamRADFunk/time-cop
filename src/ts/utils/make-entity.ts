import { CircleGeometry, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { RAD_90_DEG_RIGHT } from "./radians-x-degrees-right";

/**
 * Makes all the entity meshes for a single entity.
 */
export function makeEntity(
    meshArray: Mesh[],
    geo: CircleGeometry | PlaneGeometry,
    material: MeshBasicMaterial,
    index: number,
    pos: [number, number, number],
    name: string
): void {
    meshArray[index] = new Mesh( geo, material );
    meshArray[index].position.set(pos[0], pos[1], pos[2]);
    meshArray[index].rotation.set(RAD_90_DEG_RIGHT, 0, 0);
    meshArray[index].name = name;
    meshArray[index].visible = index ? false : true;
}