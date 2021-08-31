import { HTMLElementPosition } from '../../models/html-element-position';

export interface InputBarColors {
    background: string;
    border: string;
    text: string;
}

export enum InputBarType {
    'Number' = 'number',
    'Text' = 'text'
}

/**
 * @class
 * Base class for all input bars in the game.
 */
export class InputBarBase {
    /**
     * Callback for onChange event.
     */
    private _callback: (e?: any) => void;

    /**
     * Colors of the border, background, and text.
     */
    private _colorTheme: InputBarColors;

    /**
     * Flag to track if element is currently supposed to be disabled.
     */
    private _isEnabled: boolean = true;

    /**
     * Value contained within the input bar.
     */
    private _value: string = '';

    /**
     * HTMLElement that is the input bar itself.
     */
    public readonly element: HTMLInputElement;

    /**
     * Id attribute on the element.
     */
    public readonly id: string;

    /**
     * Constructor for the input bar base class
     * @param id        id attribute on the element.
     * @param colors    colors of the input bar.
     * @param onChange  callback for onChange event.
     * @param visible   whether or not to start the input bar in a visible state.
     * @param type      type of input bar (ie. text, number, etc.).
     */
    constructor(id: string, colors: InputBarColors, onChange: (e?: { prev: string, next: string }) => void, visible: boolean, type: InputBarType) {
        this.element = document.createElement('input');
        this.element.setAttribute('type', type);
        this.element.id = this.id = id;
        this.element.style.outline = 'none';
        this.element.style.position = 'absolute';
        this.element.style.textAlign = 'center';
        this.element.style.boxSizing = 'border-box';
        this.element.style.padding = '0';
        this.element.style.border = '1px solid ' + colors.border;
        this.element.style.backgroundColor = colors.background;
        this.element.style.color = colors.text;
        this.element.style.visibility = visible ? 'visible' : 'hidden';

        this._colorTheme = colors;
        this._callback = onChange;

        this.element.addEventListener('input', this.onChange.bind(this));
    }

    /**
     * Sets the opacity lower on the input bar to give it the disabled look, and prevents interaction.
     */
    public disable(): void {
        this._isEnabled = false;
        this.element.style.opacity = '0.4';
    }

    /**
     * Sets the opacity higher on the input bar to give it the enabled look, and allows interaction.
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
     * Hides the input bar from visibility.
     */
    public hide(): void {
        this.element.style.visibility = 'hidden';
    }

    /**
     * Determines whether the input bar is visible or not.
     * @returns TRUE == visible, FALSE == not visible
     */
    public isVisible(): boolean {
        return this.element.style.visibility !== 'hidden';
    }

    /**
     * When enabled, this calls the callback with the new value.
     * @param e the DOM input element event object.
     */
    public onChange(e: Event): void {
        if (this._isEnabled) {
            const prev = this._value;
            this._value = this.element.value;
            this._callback({
                prev,
                next: this._value
            });
        }
    }

    /**
     * Sets the height, width, left and top positioning of the element.
     * @param position height, width, left and top position of the input bar.
     */
    public resize(position: HTMLElementPosition) {}

    /**
     * Makes the input bar visible.
     */
    public show() {
        this.element.style.visibility = 'visible';
    }
}