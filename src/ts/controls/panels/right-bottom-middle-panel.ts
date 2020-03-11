import { Scene } from "three";

import { PanelBase } from "./panel-base";

/**
 * @class
 * Provides the necessary dimensions to the base panel class to make a panel in lower right middle.
 */
export class RightBottomMiddlePanel extends PanelBase {
    /**
     * Constructor for the Right Bottom Middle Panel class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @hidden
     */
    constructor(scene: Scene) {
        super( 'Right Bottom Middle Panel', scene, 6, 6.2, 2.7, 2.9, 1.4 );
    }
}