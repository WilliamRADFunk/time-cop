import { Mesh } from "three";

export interface CrewDictionaryValue {
    devDescription: string;
    spritePositionX: [number, number, number];
    spritePositionY: [number, number, number];
}

export interface CrewDictionary {
    [key: number]: CrewDictionaryValue
}

export interface GridDictionaryValue {
    blocker?: boolean;
    customSize?: [number, number];
    devDescription: string;
    gameDescription: string;
    hasVariation?: boolean;
    spritePosition: [number, number];
    xPosMod?: number;
    xScaleMod?: number;
    zPosMod?: number;
    zScaleMod?: number;
}

export interface GridDictionary {
    [key: number]: GridDictionaryValue
}

export enum GroundMaterial {
    'Dirt' = 1,
    'Gravel' = 2,
    'Sand' = 3
}

export enum PlantColor {
    'Green' = 1,
    'Yellow' = 2,
    'Purple' = 3,
    'None' = 4
}

export enum TreeLeafColor {
    'Grey' = 1,
    'Red' = 2,
    'Purple' = 3,
    'Yellow' = 4,
    'Blue' = 5,
    'Brown' = 6,
    'Green' = 7,
    'None' = 8
}

export enum TreeTrunkColor {
    'Grey' = 1,
    'Yellow' = 2,
    'Purple' = 3,
    'Red' = 4,
    'Blue' = 5,
    'Brown' = 6,
    'None' = 7
}

export enum RuinsBiome {
    'Monastery' = 1,
    'Village' = 2,
    'Town' = 3,
    'City' = 4,
    'Military_Base' = 5,
    'Library' = 6,
    'Cemetery' = 7
}

export interface TeamMember {
    animationCounter: number;
    animationMeshes: [Mesh, Mesh, Mesh];
    appearance: TeamMemberAppearance;
    currDirection: TeamMemberDirection;
    health: number;
    name: string;
    position: [number, number];
    rank: number;
    status: TeamMemberStatus;
    tileValue: number;
    title: string;
}

export enum TeamMemberAppearance {
    'Human_Light_Black' = 0,
    'Human_Light_Bald' = 1,
    'Human_Light_Brown' = 2,
    'Human_Light_Red' = 3,
    'Human_Light_Blond' = 4,
    'Human_Dark_Black' = 5
}

export enum TeamMemberDirection {
    'Down' = 0,
    'Down_Left' = 1,
    'Left' = 2,
    'Up_Left' = 3,
    'Up' = 4,
    'Up_Right' = 5,
    'Right' = 6,
    'Down_Right' = 7,
}

export enum TeamMemberStatus {
    'Healthy' = 0,
    'Injured' = 1,
    'Ill' = 2,
    'Dead' = 3,
    'Unconscious' = 4
}

export enum WaterBiome {
    'Large_Lake' = 1,
    'Beach' = 2,
    'River' = 3,
    'Creek' = 4,
    'Small_Lakes' = 5
}

export enum WaterColor {
    'Blue' = 1,
    'Green' = 2,
    'Purple' = 3,
    'None' = 4
}

export interface AncientRuinsSpecifications {
    biomeRuins: RuinsBiome;
    biomeWater: WaterBiome;
    crew: TeamMember[];
    groundMaterial: GroundMaterial;
    hasAnimalLife?: boolean;
    hasClouds: boolean;
    plantColor: PlantColor;
    plantPercentage: number;
    plantSpreadability: number;
    treeLeafColor: TreeLeafColor;
    treePercentage: number;
    treeTrunkColor: TreeTrunkColor;
    waterColor: WaterColor;
    waterPercentage: number;
    waterSpreadability: number;
}