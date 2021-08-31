import { InputBarBase, InputBarColors, InputBarType } from "./input-bar-base";
import { HTMLElementPosition } from "../../models/html-element-position";

/**
 * @class
 * Input bar with no label.
 */
export class InputBarNoLabel extends InputBarBase {
    /**
     * Scale to apply to input bar dimensions.
     */
    private _scale: number;

    /**
     * Constructor for the no label input bar sub class
     * @param position  height, width, left and top position of the input bar.
     * @param colors    colors of the input bar background, border, and text.
     * @param onChange  callback for onChange event.
     * @param visible   whether or not to start the input bar in a visible state.
     * @param type      type of input bar (ie. text, number, etc.).
     * @param scale     scale to apply to input bar dimensions.
     */
    constructor(position: HTMLElementPosition, colors: InputBarColors, onChange: (e?: { prev: string, next: string }) => void, visible: boolean, type: InputBarType, scale?: number) {
        super('input-bar-no-label', colors, onChange, visible, type);

        this._scale = scale || 1;

        this.element.style.borderRadius = '5px';
        document.body.appendChild(this.element);

        this.resize(position);
    }

    /**
     * Sets the height, width, left and top positioning of the element.
     * @param position height, width, left and top position of the input bar.
     */
    public resize(position: HTMLElementPosition): void {
        this.element.style.maxWidth = `${this._scale * (0.06 * position.width)}px`;
        this.element.style.width = `${this._scale * (0.06 * position.width)}px`;
        this.element.style.maxHeight = `${this._scale * (0.06 * position.height)}px`;
        this.element.style.height = `${this._scale * (0.06 * position.height)}px`;
        this.element.style.top = `${position.top}px`;
        this.element.style.left = `${position.left}px`;
        this.element.style.fontSize = `${this._scale * (0.044 * position.height)}px`;
    }
}