export interface RicochetOptions {
    /**
     * Starting size of the ricochets, used for collision reference.
     */
    radius?: number;

    /**
     * If created as result of shield strike, it's not collidable and color is different.
     */
    color?: RicochetType;

    /**
     * How fast ricochets grows and fades.
     */
    speed?: number;

    /**
     * Optional y value for ricochets for layering ability (ie .ricochets behind or over something).
     */
    y?: number;
}

export const enum RicochetType {
    "Blood" = 0x660000,
    "Electric" = 0x05EDFF,
    "Fire" = 0xF9A602,
    "Smoke" = 0x555555
}