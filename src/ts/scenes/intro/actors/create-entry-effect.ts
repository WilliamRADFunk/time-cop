import {
    DoubleSide,
    Mesh,
    MeshStandardMaterial,
    SphereGeometry } from "three";

import { Actor } from "../../../models/actor";
import { createActor } from "../../../utils/create-actor";

export function createEntryEffect(): Actor {
    const entryEffect = createActor();
    entryEffect.currentPoint = [0, 0];
    entryEffect.endingPoint = [0, 0];
    entryEffect.originalStartingPoint = [0, 0];
    // Creates the semi-transparent flame shield over ship's nose cone.
    entryEffect.geometry = new SphereGeometry(0.5, 32, 32, 0, 2*Math.PI, 0, 0.5 * Math.PI);
    // const envMap = entryEffectTexture;
    // envMap.mapping = SphericalReflectionMapping;
    entryEffect.material = new MeshStandardMaterial({
        color: 0xFFDE05,
        // envMap: envMap,
        opacity: 0.45,
        roughness: 0,
        transparent: true
    });
    entryEffect.material.side = DoubleSide;
    entryEffect.mesh = new Mesh(entryEffect.geometry, entryEffect.material);
    entryEffect.mesh.position.set(entryEffect.originalStartingPoint[0], -4, entryEffect.originalStartingPoint[1]);
    entryEffect.mesh.rotation.set(Math.PI / 8, 0, -Math.PI / 2);
    entryEffect.mesh.name = 'Shield';
    return entryEffect;
}