import { FunctionMap } from "../../models/function-map";
import { HTMLElementPosition } from "../../models/html-element-position";
import { FreestyleSquareButton } from "../buttons/freestyle-square-button";
import { BUTTON_COLORS } from "../../styles/button-colors";
import { SOUNDS_CTRL } from "../controllers/sounds-controller";

/**
 * @class
 * Base class for control panel in any scene of the game.
 */
export class ControlPanel {
    /**
     * List of buttons in the control panel.
     */
    private readonly _buttons: { [key: string]: FreestyleSquareButton } = {};

    /**
     * List of callback functions from Control Panel creator to pair with matching buttons.
     */
    private readonly _callbacks: FunctionMap;

    /**
     * Tracks what sound mute state was before user clicked help, or settings.
     */
    private _prevMute: boolean = SOUNDS_CTRL.getMute();

    /**
     * When pause button is pressed, a previous state may be captured for return when play button is pressed.
     */
    private _prevState: any;

    /**
     * HTMLElement that is the panel itself.
     */
    public readonly element: HTMLElement;

    /**
     * Id attribute on the element.
     */
    public readonly id: string;

    /**
     * Constructor for the text base class
     * @param id id attribute on the element.
     * @param sentence text content in the element.
     * @param color color attribute on the element.
     * @param align test align attribute on the element.
     * @param border border attribute on the element.
     * @param type type of text on the element.
     */
    constructor(position: HTMLElementPosition, callbacks: FunctionMap, startPaused?: boolean) {
        this.element = document.createElement('div');
        this.element.id = this.id = 'control-panel';
        this.element.style.fontFamily = 'Luckiest Guy';
        this.element.style.color = '#CCC';
        this.element.style.position = 'absolute';
        this.element.style.position = 'absolute';
        this.element.style.backgroundColor = '#000';
        this.element.style.overflowY = 'hidden';
        this.element.style.textAlign = 'center';
        this.element.style.border = '1px solid #CCC';
        this.element.style.borderRadius = '5px';

        this._callbacks = callbacks;

        document.body.appendChild(this.element);

        this._buttons.exitHelpButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.964 * position.width), top: ( 0.964 * position.height), width: position.width },
            BUTTON_COLORS,
            this._onExitHelpClicked.bind(this),
            false,
            'fa-sign-out',
            0.5);

        this._buttons.exitSettingsButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.93 * position.width), top: ( 0.964 * position.height), width: position.width },
            BUTTON_COLORS,
            this._onExitSettingsClicked.bind(this),
            false,
            'fa-sign-out',
            0.5);

        this._buttons.helpButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.964 * position.width), top: ( 0.964 * position.height), width: position.width },
            BUTTON_COLORS,
            this._onHelpClicked.bind(this),
            true,
            'fa-question',
            0.5);

        this._buttons.settingsButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.93 * position.width), top: ( 0.964 * position.height), width: position.width },
            BUTTON_COLORS,
            this._onSettingsClicked.bind(this),
            true,
            'fa-gear',
            0.5);

        this._buttons.soundMuffledButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.896 * position.width), top: ( 0.964 * position.height), width: position.width },
            BUTTON_COLORS,
            () => {},
            false,
            'fa-volume-down',
            0.5);

        this._buttons.soundOffButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.896 * position.width), top: ( 0.964 * position.height), width: position.width },
            BUTTON_COLORS,
            this._onSoundOffClicked.bind(this),
            false,
            'fa-volume-off',
            0.5);

        this._buttons.soundOnButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.896 * position.width), top: ( 0.964 * position.height), width: position.width },
            BUTTON_COLORS,
            this._onSoundOnClicked.bind(this),
            true,
            'fa-volume-up',
            0.5);

        this._buttons.pauseButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.862 * position.width), top: ( 0.964 * position.height), width: position.width },
            BUTTON_COLORS,
            this._onPauseClicked.bind(this),
            true,
            'fa-pause',
            0.5);

        this._buttons.playButton = new FreestyleSquareButton(
            { height: position.height, left: position.left + (0.862 * position.width), top: ( 0.964 * position.height), width: position.width },
            BUTTON_COLORS,
            this._onPlayClicked.bind(this),
            false,
            'fa-play',
            0.5);

        SOUNDS_CTRL.getMute() ? this._buttons.soundOnButton.show() : this._buttons.soundOnButton.hide();
        SOUNDS_CTRL.getMute() ? this._buttons.soundOnButton.hide() : this._buttons.soundOnButton.show();
        startPaused ? this._buttons.pauseButton.show() : this._buttons.pauseButton.hide();
        startPaused ? this._buttons.playButton.hide() : this._buttons.playButton.show();

        this.resize(position);
    }

    /**
     * Handles the hiding, showing, and enabling of relevant buttons after exiting help mode, and tracks state.
     */
    private _onExitHelpClicked(): void {
        SOUNDS_CTRL.resumeSound();

        this._buttons.exitHelpButton.hide();
        this._buttons.helpButton.show();

        this._buttons.playButton.hide();
        this._buttons.pauseButton.show();

        this._callbacks.exitHelp(this._prevState);
        this._prevState = null;

        this._buttons.settingsButton.enable();
        this._buttons.pauseButton.enable();
        this._buttons.playButton.enable();
    }

    /**
     * Handles the hiding, showing, and enabling of relevant buttons after exiting settings mode, and tracks state.
     */
    private _onExitSettingsClicked(): void {
        SOUNDS_CTRL.resumeSound();

        this._buttons.exitSettingsButton.hide();
        this._buttons.settingsButton.show();

        this._buttons.playButton.hide();
        this._buttons.pauseButton.show();

        this._callbacks.exitSettings(this._prevState);
        this._prevState = null;

        this._buttons.helpButton.enable();
        this._buttons.pauseButton.enable();
        this._buttons.playButton.enable();
    }

    /**
     * Handles the hiding, showing, and enabling of relevant buttons after entering help mode, and tracks state.
     */
    private _onHelpClicked(): void {
        SOUNDS_CTRL.pauseSound();

        this._buttons.helpButton.hide();
        this._buttons.exitHelpButton.show();

        const state = this._callbacks.help();
        if (!this._prevState) {
            this._prevState = state;
        }

        this._buttons.settingsButton.disable();
        this._buttons.pauseButton.disable();
        this._buttons.playButton.disable();
    }

    private _onPauseClicked(): void {
        SOUNDS_CTRL.pauseSound();

        this._buttons.pauseButton.hide();
        this._buttons.playButton.show();

        const state = this._callbacks.pause();
        if (!this._prevState) {
            this._prevState = state;
        }
    }

    /**
     * Handles the hiding, showing, and enabling of relevant buttons after play button clicked, and tracks state.
     */
    private _onPlayClicked(): void {
        SOUNDS_CTRL.resumeSound();

        this._buttons.playButton.hide();
        this._buttons.pauseButton.show();

        this._callbacks.play(this._prevState);
        this._prevState = null;
    }

    /**
     * Handles the hiding, showing, and enabling of relevant buttons after entering settings mode, and tracks state.
     */
    private _onSettingsClicked(): void {
        SOUNDS_CTRL.pauseSound();

        this._buttons.exitSettingsButton.show();
        this._buttons.settingsButton.hide();

        const state = this._callbacks.settings();
        if (!this._prevState) {
            this._prevState = state;
        }

        this._buttons.helpButton.disable();
        this._buttons.pauseButton.disable();
        this._buttons.playButton.disable();
    }

    /**
     * Handles the hiding, showing, and enabling of relevant buttons after sound off is clicked, and tracks state.
     */
    private _onSoundOffClicked(): void {
        SOUNDS_CTRL.resumeSound();

        this._buttons.soundOffButton.hide();
        this._buttons.soundOnButton.show();
    }

    /**
     * Handles the hiding, showing, and enabling of relevant buttons after sound on is clicked, and tracks state.
     */
    private _onSoundOnClicked(): void {
        SOUNDS_CTRL.pauseSound();

        this._buttons.soundOnButton.hide();
        this._buttons.soundOffButton.show();
    }

    /**
     * Remove the element from the DOM
     */
    public dispose(): void {
        Object.values(this._buttons).forEach(button => button && button.dispose());
        this.element && this.element.remove();
    }

    /**
     * Allows the exit of settings through method other than button click in control panel.
     */
    public exitSettings(): void {
        this._onExitSettingsClicked();
    }

    /**
     * Hides the button from visibility.
     */
    public hide(): void {
        this.element.style.visibility = 'hidden';
    }

    /**
     * Sets the height, width, left and top positioning of the element.
     * @param position height, width, left and top position of the button.
     */
    public resize(position: HTMLElementPosition): void {
        this.element.style.maxWidth = `${0.1425 * position.width}px`;
        this.element.style.width = `${0.1425 * position.width}px`;
        this.element.style.maxHeight = `${0.04 * position.height}px`;
        this.element.style.height = `${0.04 * position.height}px`;
        this.element.style.top = `${0.958 * position.height}px`;
        this.element.style.left = `${position.left + (0.8555 * position.width)}px`;
        this.element.style.fontSize = `${0.03 * position.width}px`;

        this._buttons.exitHelpButton.resize({ height: position.height, left: position.left + (0.964 * position.width), top: ( 0.964 * position.height), width: position.width });
        this._buttons.exitSettingsButton.resize({ height: position.height, left: position.left + (0.93 * position.width), top: ( 0.964 * position.height), width: position.width });
        this._buttons.helpButton.resize({ height: position.height, left: position.left + (0.964 * position.width), top: ( 0.964 * position.height), width: position.width });
        this._buttons.pauseButton.resize({ height: position.height, left: position.left + (0.862 * position.width), top: ( 0.964 * position.height), width: position.width });
        this._buttons.playButton.resize({ height: position.height, left: position.left + (0.862 * position.width), top: ( 0.964 * position.height), width: position.width });
        this._buttons.settingsButton.resize({ height: position.height, left: position.left + (0.93 * position.width), top: ( 0.964 * position.height), width: position.width });
        this._buttons.soundMuffledButton.resize({ height: position.height, left: position.left + (0.896 * position.width), top: ( 0.964 * position.height), width: position.width });
        this._buttons.soundOffButton.resize({ height: position.height, left: position.left + (0.896 * position.width), top: ( 0.964 * position.height), width: position.width });
        this._buttons.soundOnButton.resize({ height: position.height, left: position.left + (0.896 * position.width), top: ( 0.964 * position.height), width: position.width });
    }

    /**
     * Makes the button visible.
     */
    public show(): void {
        this.element.style.visibility = 'visible';
    }
}