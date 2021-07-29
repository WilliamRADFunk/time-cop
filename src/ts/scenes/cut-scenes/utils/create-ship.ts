import {
    LinearFilter,
    Mesh,
    MeshPhongMaterial,
    PlaneGeometry } from "three";
import { createActor } from "../../../utils/create-actor";
import { ASSETS_CTRL } from "../../../controls/controllers/assets-controller";

/**
 * Creates the rectangle image of the ship.
 */
export function createShip() {
    const ship = createActor();
    ship.originalStartingPoint = [-2, 0];
    ship.currentPoint = [-2, 0];
    ship.endingPoint = [-2, 0];
    ship.geometry = new PlaneGeometry(4, 2, 96, 96);
    ship.material = new MeshPhongMaterial();
    ship.material.map = ASSETS_CTRL.textures.asteroid;
    ship.material.map.minFilter = LinearFilter;
    (ship.material as any).shininess = 0;
    ship.material.transparent = true;
    ship.mesh = new Mesh(ship.geometry, ship.material);
    ship.mesh.position.set(ship.currentPoint[0], 2, ship.currentPoint[1]);
    ship.mesh.rotation.set(-Math.PI / 2, 0, 0);
    ship.mesh.name = 'Spaceship';
    return ship;
}