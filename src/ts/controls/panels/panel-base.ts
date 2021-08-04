import {
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Scene } from "three";

/**
 * @class
 * Creates the necessary pieces for text panels.
 */
export class PanelBase {
    /**
     * Reference to the inner panel's mesh.
     */
    private _innerbox: Mesh;

    /**
     * Reference to the inner panel's material.
     */
    private _innermaterial: MeshBasicMaterial;

    /**
     * Reference to the outer panel's mesh.
     */
    private _outerbox: Mesh;

    /**
     * Reference to the outer panel's material.
     */
    private _outermaterial: MeshBasicMaterial;

    /**
     * Reference to the scene, used to remove and reinstall text geometries.
     */
    private _scene: Scene;

    /**
     * Constructor for the Dev Menu class
     * @param id id of the given panel.
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param innerWidth width of the internal rectangle.
     * @param outerWidth width of the outer, glowing rectangle.
     * @param height height of the outer, glowing rectangle.
     * @param x x coordinate of the center point for both rectangles.
     * @param z z coordinate of the center point for both rectangles.
     * @hidden
     */
    constructor(
        id: string,
        scene: Scene,
        innerWidth: number,
        outerWidth: number,
        height: number,
        x: number,
        z: number
    ) {
        this._scene = scene;
        this._innermaterial = new MeshBasicMaterial({
            color: 0xFFFFFF,
            opacity: 0.6,
            transparent: true,
            side: DoubleSide
        });

        let textBoxGeometry = new PlaneGeometry( outerWidth, height, 10, 10 );
        let barrier = new Mesh( textBoxGeometry, this._innermaterial );
        barrier.name = `${id} - Outter Box`;
        barrier.position.set(x, -1, z);
        barrier.rotation.set(1.5708, 0, 0);
        this._innerbox = barrier;
        scene.add(barrier);

        this._outermaterial = new MeshBasicMaterial({
            color: 0x000000,
            opacity: 1,
            transparent: true,
            side: DoubleSide
        });
        textBoxGeometry = new PlaneGeometry( innerWidth, height - 0.2, 10, 10 );
        barrier = new Mesh( textBoxGeometry, this._outermaterial );
        barrier.name = `${id} - Inner Box`;
        barrier.position.set(x, -6, z);
        barrier.rotation.set(1.5708, 0, 0);
        this._outerbox = barrier;
        scene.add(barrier);
    }

    /**
     * Removes the panel from the scene.
     */
    public dispose(): void {
        this._scene.remove(this._innerbox);
        this._scene.remove(this._outerbox);
    }

    /**
     * Hides the panel from view.
     */
    public hide(): void {
        this._outerbox.visible = false;
        this._innerbox.visible = false;
    }

    /**
     * Makes the panel visible.
     */
    public show(): void {
        this._outerbox.visible = true;
        this._innerbox.visible = true;
    }

    /**
     * Adjusts the opacity if the panel from partly transparent to completely opaque.
     */
    public toggleOpacity(): void {
        if (this._outermaterial.opacity < 1) {
            this._innermaterial.opacity = 1;
            this._outermaterial.opacity = 1;
        } else {
            this._innermaterial.opacity = 0.35;
            this._outermaterial.opacity = 0.35;
        }
    }
}