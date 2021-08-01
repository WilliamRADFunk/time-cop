import { Entity } from "../models/Entity";

export function animateEntity(entity: Entity): void {
    const meshes = entity._animationMeshes;
    // If any of the meshes are not setup, bail out early.
    if (meshes.some(x => !x)) {
        return;
    }

    const currIndex = entity._animationCounter;
    // Middle Posture
    if (currIndex < 10 || (currIndex > 19 && currIndex < 30)) {
        meshes[0].visible = true;
        meshes[1].visible = false;
        meshes[2].visible = false;
    } else if (currIndex > 29) {
        meshes[0].visible = false;
        meshes[1].visible = false;
        meshes[2].visible = true;
    } else {
        meshes[0].visible = false;
        meshes[1].visible = true;
        meshes[2].visible = false;
    }
    entity._animationCounter++;

    if (entity._animationCounter > 39) {
        entity._animationCounter = 0;
    }
}