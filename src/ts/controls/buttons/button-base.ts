import { SOUNDS_CTRL } from '../controllers/sounds-controller';
import { ButtonColors } from "../../models/button-colors";
import { HTMLElementPosition } from "../../models/html-element-position";

/**
 * @class
 * Base class for all buttons in the game.
 */
export class ButtonBase {
    /**
     * Callback for onClick event.
     */
    private _callback: (e?: any) => void;

    /**
     * Colors of the buttons at the different stages of its lifecycle.
     */
    private _colorTheme: ButtonColors;

    /**
     * Flag to track if element is currently supposed to be diabled.
     */
    private _isEnabled: boolean = true;

    /**
     * HTMLElement that is the button itself.
     */
    public readonly element: HTMLElement;

    /**
     * Id attribute on the element.
     */
    public readonly id: string;

    /**
     * Constructor for the button base class
     * @param id id attribute on the element.
     * @param colors colors of the buttons at the different stages of its lifecycle.
     * @param onClick callback for onClick event.
     * @param visible whether or not to start the button in a visible state.
     */
    constructor(id: string, colors: ButtonColors, onClick: (e?: any) => void, visible: boolean) {
        this.element = document.createElement('button');
        this.element.id = this.id = id;
        this.element.style.outline = 'none';
        this.element.style.position = 'absolute';
        this.element.style.textAlign = 'center';
        this.element.style.boxSizing = 'border-box';
        this.element.style.padding = '0';
        this.element.style.border = '1px solid ' + colors.default.border;
        this.element.style.backgroundColor = colors.default.backgroundColor;
        this.element.style.color = colors.default.color;
        this.element.style.visibility = visible ? 'visible' : 'hidden';

        this._colorTheme = colors;
        this._callback = onClick;

        this.element.onmouseover = this.onHover.bind(this);
        this.element.onmouseleave = this.onExit.bind(this);
        this.element.onmousedown = this.onMouseDown.bind(this);
        this.element.onmouseup = this.onMouseUp.bind(this);
    }

    /**
     * Sets the opacity lower on the button to give it the disabled look, and prevents interaction.
     */
    public disable(): void {
        this._isEnabled = false;
        this.element.style.opacity = '0.4';
    }

    /**
     * Sets the opacity higher on the button to give it the enabled look, and allows interaction.
     */
    public enable(): void {
        this._isEnabled = true;
        this.element.style.opacity = '1';
    }

    /**
     * Remove the element from the DOM
     */
    public dispose(): void {
        this.element && this.element.remove();
    }

    /**
     * Hides the button from visibility.
     */
    public hide(): void {
        this.element.style.visibility = 'hidden';
    }

    /**
     * Determines whether the button is visible or not.
     * @returns TRUE == visible, FALSE == not visible
     */
    public isVisible(): boolean {
        return this.element.style.visibility !== 'hidden';
    }

    /**
     * Activates button changes related to onmouseleave listeners.
     */
    public onExit(): void {
        if (this._isEnabled) {
            this.element.style.backgroundColor = this._colorTheme.onExit.backgroundColor;
            this.element.style.color = this._colorTheme.onExit.color;
            this.element.style.border = '1px solid ' + this._colorTheme.onExit.border;
        }
    }

    /**
     * Activates button changes related to onmouseenter listeners.
     */
    public onHover(): void {
        if (this._isEnabled) {
            this.element.style.backgroundColor = this._colorTheme.onHover.backgroundColor;
            this.element.style.color = this._colorTheme.onHover.color;
            this.element.style.border = '1px solid ' + this._colorTheme.onHover.border;
        }
    }

    /**
     * Activates button changes related to onmousedown listeners.
     */
    public onMouseDown(): void {
        if (this._isEnabled) {
            this.element.style.backgroundColor = this._colorTheme.onMouseDown.backgroundColor;
            this.element.style.color = this._colorTheme.onMouseDown.color;
            this.element.style.border = '1px solid ' + this._colorTheme.onMouseDown.border;
        }
    }

    /**
     * Activates button changes related to onmouseup listeners.
     */
    public onMouseUp(): void {
        if (this._isEnabled) {
            this.element.style.backgroundColor = this._colorTheme.onMouseUp.backgroundColor;
            this.element.style.color = this._colorTheme.onMouseUp.color;
            this.element.style.border = '1px solid ' + this._colorTheme.onMouseUp.border;

            SOUNDS_CTRL.playBidooo();

            this._callback();
        }
    }

    /**
     * Sets the height, width, left and top positioning of the element.
     * @param position height, width, left and top position of the button.
     */
    public resize(position: HTMLElementPosition) {}

    /**
     * Makes the button visible.
     */
    public show() {
        this.element.style.visibility = 'visible';
    }
}