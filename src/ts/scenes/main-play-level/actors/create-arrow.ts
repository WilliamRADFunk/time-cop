import {
    CircleGeometry,
    LinearFilter,
    Mesh,
    MeshPhongMaterial } from "three";

import { createActor } from "../../../utils/create-actor";
import { ASSETS_CTRL } from "../../../controls/controllers/assets-controller";

let index = 0;

export function createArrow(x1: number, z1: number, rotation: number) {
    index++;
    const arrow = createActor();
    arrow.originalStartingPoint = [x1, z1];
    arrow.currentPoint = [x1, z1];
    arrow.endingPoint = [x1, z1];
    arrow.geometry = new CircleGeometry(0.5, 16, 16);
    arrow.material = new MeshPhongMaterial();
    arrow.material.map = ASSETS_CTRL.textures.arrow;
    arrow.material.map.minFilter = LinearFilter;
    (arrow.material as any).shininess = 0;
    arrow.material.transparent = true;
    arrow.mesh = new Mesh(arrow.geometry, arrow.material);
    arrow.mesh.position.set(arrow.currentPoint[0], 2, arrow.currentPoint[1]);
    arrow.mesh.rotation.set(-1.5708, 0, rotation);
    arrow.mesh.name = `Arrow-${index}`;
    // arrow.mesh.scale.set(0.0001, 0.0001, 0.0001);
    return arrow;
}