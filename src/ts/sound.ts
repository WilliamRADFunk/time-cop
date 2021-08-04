import { Audio } from 'three';

export class Sound {
    /**
     * The volume to use for the sound when muffled is passed in.
     */
    private _muffledVolume: number;

    /**
     * The volume to use for the sound when conditions are normal.
     */
    private _normalVolume: number;

    /**
     * The offset that best suites the audio clip as many have dead space in the beginning.
     */
    private _offset: number;

    /**
     * Audio clip belonging to this sound.
     */
    private _sound: Audio;

    /**
     * Flag to track if this sound had been paused.
     */
    private _wasPlaying: boolean = false;

    /**
     * Constructor for the Sound class
     * @param audio         audio clip belonging to this sound.
     * @param offset        the offset that best suites the audio clip as many have dead space in the beginning.
     * @param normalVolume  the volume to use for the sound when normal is passed in.
     * @param muffledVolume the volume to use for the sound when muffled is passed in.
     * @hidden
     */
    constructor(
        audio: Audio,
        offset: number,
        normalVolume?: number,
        muffledVolume?: number,
        isLooped?: boolean,
        duration?: number) {
        if (isLooped) {
            audio.setLoop(true);
        }
        if (duration) {
            (audio as any).duration = duration;
        }
        this._sound = audio;
        this._normalVolume = normalVolume || 1;
        this._muffledVolume = muffledVolume || normalVolume;
        this._offset = offset;
    }

    /**
     * Activate the clip.
     */
    public play(muffled?: boolean): void {
        this._wasPlaying = false;
        if (this._sound.isPlaying) this._sound.stop();
        this._sound.offset = this._offset;
        this._sound.setVolume(muffled ? this._muffledVolume : this._normalVolume);
        this._sound.play();
    }

    /**
     * Pauses clip if currently playing.
     */
    public pause(): void {
        if (this._sound.isPlaying) {
            this._wasPlaying = true;
            this._sound.pause();
        }
    }

    /**
     * Pauses clip if currently playing.
     */
    public resume(): void {
        if (this._wasPlaying) {
            this._wasPlaying = false;
            this._sound.play();
        }
    }

    /**
     * Stops the clip.
     */
    public stop(): void {
        this._wasPlaying = false;
        if (!this._sound.isPlaying) return;
        this._sound.stop();
    }
}