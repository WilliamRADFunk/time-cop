import { Color } from "three";

export interface ExplosionOptions {
    /**
     * Starting size of the explosions, used for collision reference.
     */
    radius?: number;

    /**
     * If created as result of shield strike, it's not collidable and color is different.
     */
    color?: ExplosionType;

    /**
     * Number of segments to use when drawing the circle. Default is 32
     */
    segments?: number;

    /**
     * How fast explosion grows and fades.
     */
    speed?: number;

    /**
     * Optional y value for explosion for layering ability (ie .explosion behind or over something).
     */
    y?: number;
}

export const enum ExplosionType {
    "Electric" = 0x05EDFF,
    "Fire" = 0xF9A602,
    "Smoke" = 0x555555
}