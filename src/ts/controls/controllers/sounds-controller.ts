import { Audio, AudioListener } from 'three';

import { Sound } from "../../sound";

interface SoundWrapper {
    audio: Audio;
    misc?: any;
    notPausable?: boolean;
    sound: Sound;
}

/**
 * @class
 * The sound effects and music system.
 */
class SoundsCtrl {
    /**
     * Tracks whether game is in silent mode or not.
     */
    private _isMute: boolean = false;

    /**
     * Tracks whether game is in temporary silent mode or not.
     */
    private _isPaused: boolean = false;

    /**
     * Audio and Sound objects for each of the loaded sound effects.
     */
    private _sounds: { [key: string]: SoundWrapper } = {};
    
    /**
     * Local reference to the audiolistener made during initialization.
     */
    public audioListener: AudioListener = new AudioListener();

    /**
     * Constructor for the SoundsCtrl class
     * @hidden
     */
    constructor() {}

    /**
     * Creates game sounds from the preloaded Audio objects.
     * @param audios list of preloaded Audio objects.
     */
    public addSounds(audios: { [key: string]: Audio; }): void {
        Object.keys(audios).forEach(key => {
            this._sounds[key] = {
                audio: audios[key],
                sound: null
            };
        });
        this._sounds['airThruster'].sound = new Sound(this._sounds['airThruster'].audio, 4.5, 0.8, 0.3, true, 9);
        this._sounds['airThruster'].misc = 0;
        this._sounds['backgroundMusicScifi01'].sound = new Sound(this._sounds['backgroundMusicScifi01'].audio, 0, 0.2, 0.1, true);
        this._sounds['backgroundMusicScifi02'].sound = new Sound(this._sounds['backgroundMusicScifi02'].audio, 16, 0.7, 0.3, true);
        this._sounds['baseLost'].sound = new Sound(this._sounds['baseLost'].audio, 2.2, 0.4);
        this._sounds['bidooo'].sound = new Sound(this._sounds['bidooo'].audio, 0, 0.4, 0.2);
        this._sounds['bidooo'].notPausable = true;
        this._sounds['bipBipBipBing'].sound = new Sound(this._sounds['bipBipBipBing'].audio, 0, 0.5, 0.4);
        this._sounds['blap'].sound = new Sound(this._sounds['blap'].audio, 0, 1, 0.4);
        this._sounds['blip'].sound = new Sound(this._sounds['blip'].audio, 0, 1, 0.4);
        this._sounds['clickClack'].sound = new Sound(this._sounds['clickClack'].audio, 0, 0.8);
        this._sounds['deathNoNoAchEhh'].sound = new Sound(this._sounds['deathNoNoAchEhh'].audio, 0.5, 0.9, 0.4);
        this._sounds['drilling'].sound = new Sound(this._sounds['drilling'].audio, 0, 0.3, 0.3, true);
        this._sounds['drone'].sound = new Sound(this._sounds['drone'].audio, 0, 0.5);
        this._sounds['explosionLarge'].sound = new Sound(this._sounds['explosionLarge'].audio, 0.5, 0.3, 0.1);
        this._sounds['explosionSmall'].sound = new Sound(this._sounds['explosionSmall'].audio, 0, 1, 0.3);
        this._sounds['fire'].sound = new Sound(this._sounds['fire'].audio, 0, 0.3);
        this._sounds['fooPang'].sound = new Sound(this._sounds['fooPang'].audio, 0, 1, 0.4);
        this._sounds['gameOver'].sound = new Sound(this._sounds['gameOver'].audio, 0, 0.7);
        this._sounds['hollowClank'].sound = new Sound(this._sounds['hollowClank'].audio, 0, 0.8, 0.4);
        this._sounds['hollowClunk'].sound = new Sound(this._sounds['hollowClunk'].audio, 0, 0.8, 0.4);
        this._sounds['mainThrusterSmall'].sound = new Sound(this._sounds['mainThrusterSmall'].audio, 0, 0.8, 0.3, true);
        this._sounds['regen'].sound = new Sound(this._sounds['regen'].audio, 0, 0.3);
        this._sounds['saucer'].sound = new Sound(this._sounds['saucer'].audio, 0, 0.2);
        this._sounds['shieldDown'].sound = new Sound(this._sounds['shieldDown'].audio, 0, 0.7);
        this._sounds['shieldUp'].sound = new Sound(this._sounds['shieldUp'].audio, 0, 0.7);
        this._sounds['teleporter'].sound = new Sound(this._sounds['teleporter'].audio, 0, 1.1);
        this._sounds['walkingFastGravel'].sound = new Sound(this._sounds['walkingFastGravel'].audio, 0, 0.2, 0.1, true);
        this._sounds['wind'].sound = new Sound(this._sounds['wind'].audio, 0, 0.4, 0.2, true);
    }

    /**
     * Getter for the isMute variable (mainly for preselecting the appropriate button in menu).
     * @returns the current isMute state. TRUE --> no sound | FALSE --> there is sound
     */
    public getMute(): boolean {
        return this._isMute;
    }

    /**
     * Getter for the isPaused variable (mainly for preselecting the appropriate button in menu).
     * @returns the current isPaused state. TRUE --> paused | FALSE --> not paused
     */
    public getPaused(): boolean {
        return this._isPaused;
    }

    /**
     * Checks if sound is already playing
     * @param name name of the sound to check.
     * @returns the current isPlaying state. TRUE --> playing | FALSE --> not playing
     */
    public isPlaying(name: string): boolean {
        return this._sounds[name] && this._sounds[name].audio.isPlaying;
    }

    /**
     * Pauses all the sound clips where they are.
     */
    public pauseSound(): void {
        if (!this._isMute && !this._isPaused) {
            Object.keys(this._sounds).forEach(key => {
                !this._sounds[key].notPausable && this._sounds[key].sound.pause();
            });
            this._isPaused = true;
        }
    }

    /**
     * Plays the air thruster sound.
     */
    public playAirThruster(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.airThruster.misc += 1;
        if (this._sounds.airThruster.misc > 2) {
            this._sounds.airThruster.misc = 2;
        } else {
            this._sounds.airThruster.sound.play();
        }
    }

    /**
     * Plays the background scifi looping music 01 sound.
     */
    public playBackgroundMusicScifi01(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.backgroundMusicScifi01.sound.play();
    }

    /**
     * Plays the background scifi looping music 02 sound.
     */
    public playBackgroundMusicScifi02(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.backgroundMusicScifi02.sound.play();
    }

    /**
     * Plays the crowd screaming in death sound.
     */
    public playBaseLost(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.baseLost.sound.play();
    }

    /**
     * Plays the bidooo sound. (Button clicked ~ immune to pause sound)
     */
    public playBidooo(): void {
        if (this._isMute) { return; }
        this._sounds.bidooo.sound.play();
    }

    /**
     * Plays the bipBipBipBing sound.
     */
    public playBipBipBipBing(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.bipBipBipBing.sound.play();
    }

    /**
     * Plays the blahp sound.
     */
    public playBlap(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.blap.sound.play();
    }

    /**
     * Plays the blip sound.
     */
    public playBlip(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.blip.sound.play();
    }

    /**
     * Plays the mouse click clack sound.
     */
    public playClickClack(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.clickClack.sound.play();
    }

    /**
     * Plays the deathNoNoAchEhh sound.
     */
    public playDeathNoNoAchEhh(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.deathNoNoAchEhh.sound.play();
    }

    /**
     * Plays the drilling drop sound.
     */
    public playDrilling(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.drilling.sound.play();
    }

    /**
     * Plays the drone drop sound.
     */
    public playDrone(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.drone.sound.play();
    }

    /**
     * Plays the large explosion sound.
     * @param muffled inert explosions should have a shallower sound.
     */
    public playExplosionLarge(muffled?: boolean): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.explosionLarge.sound.play(muffled);
    }

    /**
     * Plays the small explosion sound.
     * @param muffled inert explosions should have a shallower sound.
     */
    public playExplosionSmall(muffled?: boolean): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.explosionSmall.sound.play(muffled);
    }

    /**
     * Plays the weapon firing sound.
     */
    public playFire(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.fire.sound.play();
    }

    /**
     * Plays the fwoop pang sound.
     */
    public playFooPang(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.fooPang.sound.play();
    }

    /**
     * Plays the weapon firing sound.
     */
    public playGameOver(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.gameOver.sound.play();
    }

    /**
     * Plays the hollowClank sound.
     */
    public playHollowClank(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.hollowClank.sound.play();
    }

    /**
     * Plays the hollowClunk sound.
     */
    public playHollowClunk(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.hollowClunk.sound.play();
    }

    /**
     * Plays the small main thruster sound.
     */
    public playMainThrusterSmall(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.mainThrusterSmall.sound.play();
    }

    /**
     * Plays the regenerated/extra life sound.
     */
    public playRegen(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.regen.sound.play();
    }

    /**
     * Plays the saucer is coming sound.
     */
    public playSaucer(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.saucer.sound.play();
    }

    /**
     * Plays the shield deactivation sound.
     */
    public playShieldDown(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.shieldDown.sound.play();
    }

    /**
     * Plays the shield activation sound.
     */
    public playShieldUp(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.shieldUp.sound.play();
    }

    /**
     * Plays the teleporters sound.
     */
    public playTeleporter(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.teleporter.sound.play();
    }

    /**
     * Plays the walkingFastGravel sound.
     */
    public playWalkingFastGravel(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.walkingFastGravel.sound.play();
    }

    /**
     * Plays the wind sound.
     */
    public playWind(): void {
        if (this._isMute || this._isPaused) { return; }
        this._sounds.wind.sound.play();
    }

    /**
     * Resumes all the sound clips that were paused.
     */
    public resumeSound(): void {
        if (!this._isMute && this._isPaused) {
            Object.keys(this._sounds).forEach(key => {
                this._sounds[key].sound.resume();
            });
            this._isPaused = false;
        }
    }

    /**
     * Stops the air thruster sound.
     */
    public stopAirThruster(): void {
        if (this._isMute) { return; }
        this._sounds.airThruster.misc -= 1;
        if (this._sounds.airThruster.misc <= 0) {
            this._sounds.airThruster.misc = 0;
            this._sounds.airThruster.sound.stop();
        }
    }

    /**
     * Stops the background scifi looping music 01 sound.
     */
    public stopBackgroundMusicScifi01(): void {
        if (this._isMute) { return; }
        this._sounds.backgroundMusicScifi01.sound.stop();
    }

    /**
     * Stops the background scifi looping music 02 sound.
     */
    public stopBackgroundMusicScifi02(): void {
        if (this._isMute) { return; }
        this._sounds.backgroundMusicScifi02.sound.stop();
    }

    /**
     * Stops the drilling is coming sound.
     */
    public stopDrilling(): void {
        if (this._isMute) { return; }
        this._sounds.drilling.sound.stop();
    }

    /**
     * Stops the small main thruster sound.
     */
    public stopMainThrusterSmall(): void {
        if (this._isMute) { return; }
        this._sounds.mainThrusterSmall.sound.stop();
    }

    /**
     * Stops the saucer is coming sound.
     */
    public stopSaucer(): void {
        if (this._isMute) { return; }
        this._sounds.saucer.sound.stop();
    }

    /**
     * Stops the teleporter sound.
     */
    public stopTeleporter(): void {
        if (this._isMute) { return; }
        this._sounds.teleporter.sound.stop();
    }

    /**
     * Stops the walkingFastGravel sound.
     */
    public stopWalkingFastGravel(): void {
        if (this._isMute) { return; }
        this._sounds.walkingFastGravel.sound.stop();
    }

    /**
     * Stops the wind sound.
     */
    public stopWind(): void {
        if (this._isMute) { return; }
        this._sounds.wind.sound.stop();
    }

    /**
     * Toggles sound for the entire game.
     * @param mute TRUE --> mute the game | FALSE --> turn sound on
     */
    public toggleMute(mute: boolean): void {
        this._isMute = mute;
        if (this._isMute) {
            Object.keys(this._sounds).forEach(key => {
                this._sounds[key].sound.stop();
            });
        }
    }
}
export const SOUNDS_CTRL = new SoundsCtrl();