import { Entity, EntityDirection } from "../models/entity";
import {
    RAD_90_DEG_RIGHT,
    RAD_45_DEG_RIGHT,
    RAD_135_DEG_RIGHT,
    RAD_180_DEG_RIGHT,
    RAD_225_DEG_RIGHT,
    RAD_270_DEG_RIGHT,
    RAD_315_DEG_RIGHT } from "./radians-x-degrees-right";

export function rotateEntity(entity: Entity): void {
    const zRot = entity._animationMeshes[0].rotation.z;
    switch(entity._currDirection) {
        case EntityDirection.Down: {
            zRot !== RAD_270_DEG_RIGHT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_RIGHT, 0, RAD_270_DEG_RIGHT));
            break;
        }
        case EntityDirection.Down_Left: {
            zRot !== RAD_315_DEG_RIGHT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_RIGHT, 0, RAD_315_DEG_RIGHT));
            break;
        }
        case EntityDirection.Left: {
            zRot !== 0 && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_RIGHT, 0, 0));
            break;
        }
        case EntityDirection.Up_Left: {
            zRot !== RAD_45_DEG_RIGHT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_RIGHT, 0, RAD_45_DEG_RIGHT));
            break;
        }
        case EntityDirection.Up: {
            zRot !== RAD_90_DEG_RIGHT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_RIGHT, 0, RAD_90_DEG_RIGHT));
            break;
        }
        case EntityDirection.Up_Right: {
            zRot !== RAD_135_DEG_RIGHT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_RIGHT, 0, RAD_135_DEG_RIGHT));
            break;
        }
        case EntityDirection.Right: {
            zRot !== RAD_180_DEG_RIGHT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_RIGHT, 0, RAD_180_DEG_RIGHT));
            break;
        }
        case EntityDirection.Down_Right: {
            zRot !== RAD_225_DEG_RIGHT && [0, 1, 2].forEach(i => entity._animationMeshes[i].rotation.set(RAD_90_DEG_RIGHT, 0, RAD_225_DEG_RIGHT));
            break;
        }
    }
}