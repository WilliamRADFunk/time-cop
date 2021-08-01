import { Entity, EntityDirection } from "../models/entity";
import {
    RAD_90_DEG_LEFT,
    RAD_45_DEG_LEFT,
    RAD_135_DEG_LEFT,
    RAD_180_DEG_LEFT,
    RAD_225_DEG_LEFT,
    RAD_270_DEG_LEFT,
    RAD_315_DEG_LEFT } from "./radians-x-degrees-left";

export function rotateEntity(entity: Entity): void {
    const zRot = entity._animationMeshes[0].rotation.z;
    switch(entity._currDirection) {
        case EntityDirection.Down: {
            zRot !== RAD_270_DEG_LEFT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_LEFT, 0, RAD_270_DEG_LEFT));
            break;
        }
        case EntityDirection.Down_Left: {
            zRot !== RAD_315_DEG_LEFT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_LEFT, 0, RAD_315_DEG_LEFT));
            break;
        }
        case EntityDirection.Left: {
            zRot !== 0 && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_LEFT, 0, 0));
            break;
        }
        case EntityDirection.Up_Left: {
            zRot !== RAD_45_DEG_LEFT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_LEFT, 0, RAD_45_DEG_LEFT));
            break;
        }
        case EntityDirection.Up: {
            zRot !== RAD_90_DEG_LEFT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_LEFT, 0, RAD_90_DEG_LEFT));
            break;
        }
        case EntityDirection.Up_Right: {
            zRot !== RAD_135_DEG_LEFT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_LEFT, 0, RAD_135_DEG_LEFT));
            break;
        }
        case EntityDirection.Right: {
            zRot !== RAD_180_DEG_LEFT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_LEFT, 0, RAD_180_DEG_LEFT));
            break;
        }
        case EntityDirection.Down_Right: {
            zRot !== RAD_225_DEG_LEFT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_LEFT, 0, RAD_225_DEG_LEFT));
            break;
        }
    }
}