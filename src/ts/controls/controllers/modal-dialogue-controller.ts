import { HTMLElementPosition } from "../../models/html-element-position";

export class ModalDialogueCtrl {
    /**
     * The HTML element containing the opaque backdrop.
     */
    protected _backdrop: HTMLElement;

    /**
     * The HTML element containing the modal itself.
     */
    protected _box: HTMLElement;

    /**
     * The HTML element containing the description text.
     */
    protected _description: HTMLElement;

    /**
     * The HTML element containing the modal dialogue's main text.
     */
    protected _mainText: string;
    
    /**
     * The HTML element containing the list of options text.
     */
    protected _options: HTMLElement;

    /**
     * The HTML element containing the whole dialogue modal and backdrop
     */
    protected _wrapper: HTMLElement;

    /**
     * Constructor for the modal dialogue Base Controller class.
     */
    constructor (container: HTMLElement) {
        // Create modal container.
        this._wrapper = document.createElement('div');
        this._wrapper.style.left = '0px';
        this._wrapper.style.top = '0px';
        this._wrapper.style.position = 'absolute';
        this._wrapper.style.zIndex = '10';

        // Create opaque backdrop.
        this._backdrop = document.createElement('div');
        this._backdrop.style.left = '0px';
        this._backdrop.style.top = '0px';
        this._backdrop.style.opacity = '0.7';
        this._backdrop.style.display = 'block';
        this._backdrop.style.position = 'absolute';
        this._backdrop.style.zIndex = '10';

        // Create modal box.
        this._box = document.createElement('div');
        this._box.style.backgroundColor = '#89CFF0';
        this._box.style.border = '5px solid #FEDC56';
        this._box.style.borderRadius = '6px';
        this._box.style.boxShadow = '#666666 2px 2px 2px';
        this._box.style.display = 'block';
        this._box.style.position = 'absolute';
        this._box.style.zIndex = '20';
        this._box.style.marginLeft = 'auto';
        this._box.style.marginRight = 'auto';

        // Create main text.
        this._description = document.createElement('p');
        this._description.style.color = '#DDDDDD';
        this._description.style.fontFamily = 'Luckiest Guy';
        this._description.style.lineHeight = '1.1';
        this._description.style.textShadow = '0px 1px 1px #000000';

        // Create main text.
        this._options = document.createElement('div');
        this._options.style.color = '#DDDDDD';
        this._options.style.fontFamily = 'Luckiest Guy';
        this._options.style.lineHeight = '1.1';
        this._options.style.textShadow = '0px 1px 1px #000000';

        // Append.
        this._wrapper.appendChild(this._backdrop);
        this._wrapper.appendChild(this._box);
        this._box.appendChild(this._description);

        container.appendChild(this._wrapper);

        this.hide();
    }

    /**
     * Places the modal dialogue out of sight.
     */
    public hide(): void {
        this._wrapper.style.display = 'none';
    }

    /**
     * Positions the modal dialogue within view with optional params for specificity.
     * @param left the left position of the modal dialogue.
     * @param top the top position of the modal dialogue.
     */
    public reposition(position?: HTMLElementPosition): void {
        this._wrapper.style.width = position.width + 'px';
        this._wrapper.style.height = position.height + 'px';
        this._backdrop.style.width = position.width + 'px';
        this._backdrop.style.height = position.height + 'px';
        this._box.style.width = (position.width * 0.7) + 'px';
        this._box.style.height = (position.height * 0.35) + 'px';
        this._box.style.left = position.left + 'px';
        this._box.style.top = (position.height * 0.2)  + 'px';
        this._description.style.fontSize = (position.width * 0.0172) + 'px';
        this._description.style.padding = (position.width * 0.01) + 'px';
        this._options.style.fontSize = (position.width * 0.0172) + 'px';
        this._options.style.padding = (position.width * 0.01) + 'px';
    }

    /**
     * Places the modal dialogue within view.
     */
    public show(): void {
        this._wrapper.style.display = 'block';
    }

    /**
     * Updates the content of the modal with main description/choices, and possible choices.
     * @param mainText the main description and request for user decision.
     * @param choices the options available to player to choose from.
     * @param selectionCallback callback function to call when a user has made a dialogue choice.
     */
    public updateContent(mainText: string, choices: string[], selectionCallback: (choice: number) => void): void {
        this._options.innerHTML = '';
        this._description.innerText = mainText;

        choices.forEach((choice, index) => {
            const option = document.createElement('p');
            option.innerText = `${String.fromCharCode(index + 65)}: ${choice}`;
            // TODO: Attach event listener for hover and click.
        });
    }
}