import {
    DoubleSide,
    LinearFilter,
    Mesh,
    MeshPhongMaterial,
    Texture,
    MeshBasicMaterial,
    CircleGeometry} from "three";
import { createActor } from "../../../utils/create-actor";

/**
 * Creates the rectangle image of the lander.
 * @param dialogueTexture texture for the lander image.
 */
export function createLander(landerTexture: Texture) {
    const lander = createActor();
    lander.originalStartingPoint = [0, -4];
    lander.currentPoint = [0, -4];
    lander.endingPoint = [0, -4];
    lander.geometry = new CircleGeometry( 0.2, 10, 10 );
    lander.material = new MeshPhongMaterial();
    lander.material.map = landerTexture;
    lander.material.map.minFilter = LinearFilter;
    (lander.material as any).shininess = 0;
    lander.material.transparent = true;
    lander.mesh = new Mesh(lander.geometry, lander.material);
    lander.mesh.position.set(lander.currentPoint[0], 0, lander.currentPoint[1]);
    lander.mesh.rotation.set(-1.5708, 0, 0);
    lander.mesh.name = 'Lander';
    lander.mesh.scale.set(1, 1, 1);
    return lander;
}