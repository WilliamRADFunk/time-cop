import {
    CircleGeometry,
    Color,
    Geometry,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PlaneGeometry,
    Vector3 } from "three";

/**
 * 
 * @param color color of the bullet body.
 * @param headY layer coordinate for the head of the bullet.
 * @param tailY layer coordinate for the tail of the bullet.
 * @param hasTail whether to create the bullet trail (bullets in chamber around player character have no tail).
 * @param numFrames number of frames to create. Only one necessary if static graphic.
 * @returns the two graphics 
 */
export function makeBullet(color: Color, headY: number, tailY: number, rotation: [number, number, number], numFrames = 2, hasTail?: boolean): Object3D[] {
    const projectileObjects: Object3D[] = [];
//#region Creates glowing body of the projectile.
    //#region The primary frame for projectile body.
    // Glowing head of the projectile.
    let headGeometry = new CircleGeometry(0.06, 64);
    let headMaterial = new MeshBasicMaterial({
        color: color,
        opacity: 1,
        transparent: true
    });
    let head = new Mesh(headGeometry, headMaterial);
    head.position.set(0, headY, 0);
    head.rotation.set(-1.5708, 0, 0);

    // Glowing shaft of the projectile.
    let shaftGeometry = new PlaneGeometry(0.12, 0.12, 32, 32);
    let shaftMaterial = new MeshBasicMaterial({
        color: color,
        opacity: 1,
        transparent: true
    });
    let shaft = new Mesh(shaftGeometry, shaftMaterial);
    shaft.position.set(0, headY, 0.06);
    shaft.rotation.set(-1.5708, 0, 0);

    // Black stripes in body of projectile.
    let rivetGeometry = new PlaneGeometry(0.15, 0.01, 32, 32);
    let rivetMaterial = new MeshBasicMaterial({
        color: new Color(0x000000),
        opacity: 1,
        transparent: true
    });
    let rivet1 = new Mesh(rivetGeometry, rivetMaterial);
    rivet1.position.set(0, headY - 2, 0.01);
    rivet1.rotation.set(-1.5708, 0, 0);
    let rivet2 = new Mesh(rivetGeometry, rivetMaterial);
    rivet2.position.set(0, headY - 2, 0.04);
    rivet2.rotation.set(-1.5708, 0, 0);
    
    projectileObjects[0] = new Object3D();
    projectileObjects[0].add(head);
    projectileObjects[0].add(shaft);
    projectileObjects[0].add(rivet1);
    projectileObjects[0].add(rivet2);
    //#endregion
    //#region The alternate frame for projectile body.
    if (numFrames > 1) {
        // Glowing head of the projectile.
        headGeometry = new CircleGeometry(0.06, 64);
        headMaterial = new MeshBasicMaterial({
            color: color,
            opacity: 1,
            transparent: true
        });
        head = new Mesh(headGeometry, headMaterial);
        head.position.set(0, headY, 0);
        head.rotation.set(-1.5708, 0, 0);

        // Glowing shaft of the projectile.
        shaftGeometry = new PlaneGeometry(0.12, 0.12, 32, 32);
        shaftMaterial = new MeshBasicMaterial({
            color: color,
            opacity: 1,
            transparent: true
        });
        shaft = new Mesh(shaftGeometry, shaftMaterial);
        shaft.position.set(0, headY, 0.06);
        shaft.rotation.set(-1.5708, 0, 0);

        // Black stripes in body of projectile.
        rivetGeometry = new PlaneGeometry(0.15, 0.01, 32, 32);
        rivetMaterial = new MeshBasicMaterial({
            color: new Color(0x000000),
            opacity: 1,
            transparent: true
        });
        rivet1 = new Mesh(rivetGeometry, rivetMaterial);
        rivet1.position.set(0, headY - 2, 0.01);
        rivet1.rotation.set(-1.5708, 0, 0);
        rivet2 = new Mesh(rivetGeometry, rivetMaterial);
        rivet2.position.set(0, headY - 2, 0.04);
        rivet2.rotation.set(-1.5708, 0, 0);
        
        projectileObjects[1] = new Object3D();
        projectileObjects[1].add(head);
        projectileObjects[1].add(shaft);
        projectileObjects[1].add(rivet1);
        projectileObjects[1].add(rivet2);
    }
    //#endregion
//#endregion

//#region Creates the projectile's fiery trail.
    //#region The primary frame for projectile trail.
    if (hasTail) {
        // Straight line
        let tailGeometry = new Geometry();
        tailGeometry.vertices.push(
            new Vector3(
                0,
                tailY,
                0.1),
            new Vector3(
                0,
                tailY,
                0.2));
        let tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
        let line = new Line(tailGeometry, tailMaterial);
        projectileObjects[0].add(line);

        // Angled lines for projectiles traveling vertically.
        // First angled line.
        tailGeometry = new Geometry();
        tailGeometry.vertices.push(
            new Vector3(
                0.05,
                tailY,
                0.1),
            new Vector3(
                0.05,
                tailY,
                0.3));
        tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
        line = new Line(tailGeometry, tailMaterial);
        projectileObjects[0].add(line);

        // Second angled line.
        tailGeometry = new Geometry();
        tailGeometry.vertices.push(
            new Vector3(
                -0.05,
                tailY,
                0.1),
            new Vector3(
                -0.05,
                tailY,
                0.3));
        tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
        line = new Line(tailGeometry, tailMaterial);
        projectileObjects[0].add(line);
        projectileObjects[0].rotation.set(...rotation);
        //#endregion
    //#region The alternate frame for projectile trail.
        if (numFrames > 1) {
            // Straight line
            tailGeometry = new Geometry();
            tailGeometry.vertices.push(
                new Vector3(
                    0,
                    tailY,
                    0.1),
                new Vector3(
                    0,
                    tailY,
                    0.3));
            tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
            line = new Line(tailGeometry, tailMaterial);
            projectileObjects[1].add(line);

            // First angled line.
            tailGeometry = new Geometry();
            tailGeometry.vertices.push(
                new Vector3(
                    0.05,
                    tailY,
                    0.2),
                new Vector3(
                    0.05,
                    tailY,
                    0.4));
            tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
            line = new Line(tailGeometry, tailMaterial);
            projectileObjects[1].add(line);

            // Second angled line.
            tailGeometry = new Geometry();
            tailGeometry.vertices.push(
                new Vector3(
                    -0.05,
                    tailY,
                    0.2),
                new Vector3(
                    -0.05,
                    tailY,
                    0.4));
            tailMaterial = new LineBasicMaterial({color: new Color(0x555555)});
            line = new Line(tailGeometry, tailMaterial);
            projectileObjects[1].add(line);
            projectileObjects[1].rotation.set(...rotation);
            projectileObjects[1].visible = false;
        }
    }
    //#endregion
//#endregion

    return projectileObjects;
}