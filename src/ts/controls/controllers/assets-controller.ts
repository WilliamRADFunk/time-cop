import { Audio, AudioLoader, Font, FontLoader, Texture, TextureLoader } from "three";

import { SOUNDS_CTRL } from "./sounds-controller";

/**
 * Sound file paths
 */
const SOUND_PATHS: { name: string; path: string; }[] = [
    {
        name: 'airThruster',
        /**
        * Astri : 45 minutes sound designs » Astri : 008 : rocketship hover landing.wav
        * https://freesound.org/people/prod.astri/sounds/492850/
        * license: Creative Commons 0 License
        * Recorded by: prod.astri
        */
        path: 'assets/audio/air-thruster.wav'
    },
    {
        name: 'backgroundMusicScifi01',
        /**
        * Atmospheric sci-fi drone
        * https://www.zapsplat.com/music/atmospheric-sci-fi-drone-2/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: Sumo Blanco
        */
        path: 'assets/audio/background-music-scifi-01.mp3'
    },
    {
        name: 'backgroundMusicScifi02',
        /**
        * Eerie Tense Background
        * https://freesound.org/people/Speedenza/sounds/207753/
        * license: https://creativecommons.org/licenses/by-nc/3.0/
        * Recorded by: Speedenza
        */
        path: 'assets/audio/background-music-scifi-02.wav'
    },
    {
        name: 'baseLost',
        /**
        * Gunfire In Crowd Sound
        * http://soundbible.com/1608-Gunfire-In-Crowd.html
        * license: Public Domain
        * Recorded by: KevanGC
        */
        path: 'assets/audio/base-lost.mp3'
    },
    {
        name: 'bidooo',
        /**
        * Boom, Crackle and Scream Sampler/Analo Fireworks, Boom, Glitch, Granular, Analog, Distort, Distortion, Saturation, Explode, Glitchy, Harsh, Sci-Fi
        * https://www.zapsplat.com/music/boom-crackle-and-scream-sampler-analo-fireworks-boom-glitch-granular-analog-distort-distortion-saturation-explode-glitchy-harsh-sci-fi/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: Sound Spark LLC
        */
        path: 'assets/audio/bidooo.mp3'
    },
    {
        name: 'bipBipBipBing',
        /**
        * Dead.wav
        * https://freesound.org/people/Daleonfire/sounds/406113/
        * license: Creative Commons 0 License
        * Recorded by: Daleonfire
        */
        path: 'assets/audio/bip-bip-bip-bing.wav'
    },
    {
        name: 'blap',
        /**
        * Cartoon object drop, lite clunk 2
        * https://www.zapsplat.com/music/cartoon-object-drop-lite-clunk-2/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: ZapSplat
        */
        path: 'assets/audio/blap.mp3'
    },
    {
        name: 'blip',
        /**
        * Cartoon object drop, lite clunk 1
        * https://www.zapsplat.com/music/cartoon-object-drop-lite-clunk-1/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: ZapSplat
        */
        path: 'assets/audio/blip.mp3'
    },
    {
        name: 'clickClack',
        /**
         * Click On Sound
         * http://soundbible.com/1280-Click-On.html
         * license: Attribution 3.0
         * Recorded by: Mike Koenig
         */
        path: 'assets/audio/click-clack.mp3'
    },
    {
        name: 'deathNoNoAchEhh',
        /**
        * Bug Sprayed.wav
        * https://freesound.org/people/husky70/sounds/157293/
        * license: Creative Commons 0 License
        * Recorded by: husky70
        */
        path: 'assets/audio/death-no-no-ach-ehh.wav'
    },
    {
        name: 'drilling',
        /**
        * Drone, Machine, Engine, Motor, UFO, Spaceship, Sci-Fi, Aliens, Ambience, Buzz, Hum, Noise, Seamless, Loop, Looping
        * https://www.zapsplat.com/music/drone-machine-engine-motor-ufo-spaceship-sci-fi-aliens-ambience-buzz-hum-noise-seamless-loop-looping-2/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: Sound Spark LLC
        */
        path: 'assets/audio/drilling.mp3'
    },
    {
        name: 'drone',
        /**
        * Beep Ping Sound
        * http://soundbible.com/1133-Beep-Ping.html
        * license: Attribution 3.0
        * Recorded by: Mike Koenig
        */
        path: 'assets/audio/drone.mp3'
    },
    {
        name: 'explosionLarge',
        /**
         * Bomb Exploding Sound
         * http://soundbible.com/1986-Bomb-Exploding.html
         * license: Attribution 3.0
         * Recorded by: Sound Explorer
         */
        path: 'assets/audio/boom.mp3'
    },
    {
        name: 'explosionSmall',
        /**
        * Explosion, large with glass breaking and other debris 2
        * https://www.zapsplat.com/music/explosion-large-with-glass-breaking-and-other-debris-2/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: ZapSplat
        */
        path: 'assets/audio/explosion-small.mp3'
    },
    {
        name: 'fire',
        /**
        * Tank Firing Sound
        * http://soundbible.com/1326-Tank-Firing.html
        * license: Attribution 3.0
        * Recorded by: snottyboy
        */
        path: 'assets/audio/fire.mp3'
    },
    {
        name: 'fooPang',
        /**
        * Fast swing, whoosh into a metal hit, thud or clunk, could be sword hitting shield or armor. Version 2
        * https://www.zapsplat.com/music/fast-swing-whoosh-into-a-metal-hit-thud-or-clunk-could-be-sword-hitting-shield-or-armor-version-2/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: ZapSplat
        */
        path: 'assets/audio/foop-pang.mp3'
    },
    {
        name: 'gameOver',
        /**
        * Beam Me Up Scotty Sound
        * http://soundbible.com/256-Beam-Me-Up-Scotty.html
        * license: Personal Use Only
        * Recorded by: N/A
        */
        path: 'assets/audio/game-over.mp3'
    },
    {
        name: 'hollowClank',
        /**
        * Horror, hit, heavy wood thump or clunk with reverb, good for shock, jump scare 2
        * https://www.zapsplat.com/music/horror-hit-heavy-wood-thump-or-clunk-with-reverb-good-for-shock-jump-scare-2/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: Skyclad Sound
        */
        path: 'assets/audio/hollow-clank.mp3'
    },
    {
        name: 'hollowClunk',
        /**
        * Horror, hit, heavy wood thump or clunk with reverb, good for shock, jump scare 3
        * https://www.zapsplat.com/music/horror-hit-heavy-wood-thump-or-clunk-with-reverb-good-for-shock-jump-scare-3/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: Skyclad Sound
        */
        path: 'assets/audio/hollow-clunk.mp3'
    },
    {
        name: 'mainThrusterSmall',
        /**
        * RocketThrustMaxx.wav
        * https://freesound.org/people/Maxx222/sounds/446764/
        * license: Creative Commons 0 License
        * Recorded by: Maxx222
        */
        path: 'assets/audio/main-thruster-small.wav'
    },
    {
        name: 'regen',
        /**
        * Ta Da Sound
        * http://soundbible.com/1003-Ta-Da.html
        * license: Attribution 3.0
        * Recorded by: Mike Koenig
        */
        path: 'assets/audio/regen.mp3'
    },
    {
        name: 'saucer',
        /**
        * Strange Noise Sound
        * http://soundbible.com/1636-Power-Up-Ray.html
        * license: Noncommercial 3.0
        * Recorded by: Mike Koenig
        */
        path: 'assets/audio/saucer.mp3'
    },
    {
        name: 'shieldDown',
        /**
        * Metroid Door Sound
        * http://soundbible.com/1858-Metroid-Door.html
        * license: Attribution 3.0
        * Recorded by: Brandino480
        */
        path: 'assets/audio/shield-down.mp3'
    },
    {
        name: 'shieldUp',
        /**
        * Power Up Ray Sound
        * http://soundbible.com/1636-Power-Up-Ray.html
        * license: Noncommercial 3.0
        * Recorded by: Mike Koenig
        */
        path: 'assets/audio/shield-up.mp3'
    },
    {
        name: 'teleporter',
        /**
        * New Space Sounds! » teleport
        * https://freesound.org/people/NoiseCollector/sounds/43047/
        * license: https://creativecommons.org/licenses/by/3.0/
        * Recorded by: NoiseCollector
        */
        path: 'assets/audio/teleporter.wav'
    },
    {
        name: 'walkingFastGravel',
        /**
        * Running, Snow, A.wav
        * https://freesound.org/people/InspectorJ/sounds/421022/
        * license: Attribution License
        * Recorded by: InspectorJ
        */
        path: 'assets/audio/walking-fast-gravel.wav'
    },
    {
        name: 'wind',
        /**
        * Synthesised cold, howling wind
        * https://www.zapsplat.com/music/synthesised-cold-howling-wind/
        * license: Standard License (See ZapSplat license pdf)
        * Recorded by: Adam A Johnson
        */
        path: 'assets/audio/wind.mp3'
    }
];

/**
 * Loads the audio files.
 */
const SOUND_LOADERS: { name: string; loader: AudioLoader; path: string; }[] = SOUND_PATHS.map(x => {
    return {
        name: x.name,
        loader: new AudioLoader(),
        path: x.path
    };
});

/**
 * Texture wrappers that contain source path and loaded texture.
 */
const TEXTURES: { [key: string]: [string, Texture] } = {
    arrow: ['assets/images/arrow.png', null],
    asteroid: ['assets/images/asteroid.png', null],
    astronaut1: ['assets/images/astronaut-01.png', null],
    astronaut2: ['assets/images/astronaut-02.png', null],
    astronaut3: ['assets/images/astronaut-03.png', null],
    bandit: ['assets/images/sprite-map-bandit.png', null],
    banditCowboy: ['assets/images/bandit-cowboy.png', null],
    // The loaded texture, used for the ship layout dialogue engineer profile 1.
    engineerProfile: ['assets/images/ship-layout-profile.png', null],
    keysForDown: ['assets/images/keys-down.png', null],
    keysForLeft: ['assets/images/keys-left.png', null],
    keysForRight: ['assets/images/keys-right.png', null],
    keysForUp: ['assets/images/keys-up.png', null],
    mouse: ['assets/images/mouse.png', null],
    mouseLeft: ['assets/images/mouse-left.png', null],
    sheriff: ['assets/images/sheriff.png', null],
    spriteMapGlowingBlueOrb: ['assets/images/sprite-map-glowing-blue-orb.png', null],
    spriteMapTeleporterEffects: ['assets/images/sprite-map-teleporters.png', null]
};

/**
 * @class AssetsCtrl
 * The Assets Controller class for tracking the loading of assets, and making them globally available.
 */
export class AssetsCtrl {
    /**
     * Tracks number of assets loaded.
     */
    private _assetsLoadedCount: number = 0;

    /**
     * Callback to fire when all assets are loaded. Set during init function.
     */
    private _callback: () => void;

    /**
     * List of loaded audio files.
     */
    private _sounds: { [key: string]: Audio; } = {};

    /**
     * Total number of assets to load.
     */
    private _totalAssetCountToLoad = Object.values(TEXTURES).length + 1 + SOUND_LOADERS.length;

    /**
    * The loaded font, used for the scoreboard.
    */
    public gameFont: Font;

    /**
     * Textures to be accessed after loading is finished.
     */
    public textures: { [key: string]: Texture } = {};

    /**
     * Constructor for the singleton Assets Controller class.
     */
    constructor() { }

    /**
     * Checks to see if all assets are finished loaded. If so, start rendering the game.
     */
    private _checkAssetsLoaded(): void {
        if (this.gameFont &&
            !Object.keys(TEXTURES).some(key => !TEXTURES[key][1]) &&
            Object.keys(this._sounds).length === SOUND_LOADERS.length) {
            SOUNDS_CTRL.addSounds(this._sounds);

            setTimeout(() => {
                const loading = document.getElementById('loading');
                loading.classList.add('hidden');
                const mainview = document.getElementById('mainview');
                mainview.classList.remove('hidden');
                this._setTextureMap();
                this._callback();
            }, 500);
        }
    };

    /**
     * Passes the callback functions to font and texture loaders,
     * each fitted with their chance to check if all others are done.
     */
    private _loadAssets(): void {
        const loadingBar = document.getElementById('loading').getElementsByClassName('ldBar')[0];
        Object.keys(TEXTURES).forEach(key => {
            (new TextureLoader()).load( TEXTURES[key][0], texture => {
                TEXTURES[key][1] = texture;
                this._assetsLoadedCount++;
                (loadingBar as any).ldBar.set((this._assetsLoadedCount / this._totalAssetCountToLoad) * 100);
                this._checkAssetsLoaded();
            });
        });
        // Callback function to set the scoreboard font once it is finished loading.
        (new FontLoader()).load('assets/fonts/Luckiest_Guy_Regular.json', font => {
            this.gameFont = font;
            this._assetsLoadedCount++;
            (loadingBar as any).ldBar.set((this._assetsLoadedCount / this._totalAssetCountToLoad) * 100);
            this._checkAssetsLoaded();
        });
        // Get the ball rolling on each of the sound file loads.
        SOUND_LOADERS.forEach((soundLoader, index) => {
            soundLoader.loader.load(
                soundLoader.path,
                (soundBuffer: any /* AudioBuffer */) => {
                    const sound = (new Audio(SOUNDS_CTRL.audioListener)).setBuffer(soundBuffer);
                    sound.setLoop(false);
                    this._sounds[soundLoader.name] = sound;
                    this._assetsLoadedCount++;
                    (loadingBar as any).ldBar.set((this._assetsLoadedCount / this._totalAssetCountToLoad) * 100);
                    this._checkAssetsLoaded();
                },
                (xhr: { loaded: number; total: number;}) => { },
                (error: ErrorEvent) => console.error(`Failed to load (${soundLoader.path.split('/').pop()}) sound file`, error.message)
            );
        });
    };

    /**
     * Converts the TEXTURES static maps completed texture values into easier to read map.
     */
    private _setTextureMap(): void {
        Object.entries(TEXTURES).forEach(entry => {
            this.textures[entry[0]] = entry[1][1];
        });
    }

    /**
     * Kicks off the assets loading process and sets the callback function for firing when it's done.
     * @param cb callback function to be fired when all assets are done loading.
     */
    public init(cb: () => void): void {
        this._callback = cb;
        this._loadAssets();
    }
}

/**
 * Singleton instance for Asset Controller class.
 */
export const ASSETS_CTRL = new AssetsCtrl();