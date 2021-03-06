import {
    Color,
    Font,
    Mesh,
    MeshLambertMaterial,
    Scene,
    TextGeometry} from 'three';

export type ScoreGeometries = TextGeometry[];
export type ScoreDigits = Mesh[];
/**
 * Iterable list of x positions for each digit of the score.
 * Necessary since constantly recreating TextGeometries with each new score is very costly.
 */
const POSITION_INDEX = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].map(val => val * 0.35);

const SCORE_VERTICAL_POSITION = -5.5;

export const SCORE_FOR_LIFE = 10000;

export const SCORE_FOR_TIME_SLOW = 1000;

/**
 * @class
 * Keeps track of all things score related.
 */
export class ScoreCtrl {
    /**
     * Keeps track of level's current color
     */
    private _currentColor: Color;

    /**
     * Keeps track of player's current score
     */
    private _currentScore: number = 0;

    /**
     * Keeps track if player's points increase warrants an extra life.
     */
    private _regenLife: boolean = false;

    /**
     * Keeps track if player's points increase warrants a slow down of time.
     */
    private _regenTimeSlow: boolean = false;

    /**
     * Reference to the scene, used to remove text in order to change it.
     */
    private _scene: Scene;

    /**
     * The loaded font, used for the scoreboard.
     */
    private _scoreFont: Font;

    /**
     * Controls size and shape of the score
     */
    private _scoreGeometry: TextGeometry;

    /**
     * A better way to iterate through the digit geometries.
     */
    private _scoreGeometries: ScoreGeometries[] = [[], [], [], [], [], [], [], [], [], []];

    /**
     * Controls the color of the score material
     */
    private _scoreMaterial: MeshLambertMaterial;

    /**
     * Controls the overall rendering of the score
     */
    private _score: Mesh;

    /**
     * A better way to iterate through the digit meshes.
     */
    private _scores: ScoreDigits[] = [[], [], [], [], [], [], [], [], [], []];

    /**
     * Keeps track of player's score amount gained since last free life.
     */
    private _scoreSinceNewLife: number = 0;

    /**
     * Keeps track of player's score amount gained since last time slow.
     */
    private _scoreSinceSlowTime: number = 0;

    /**
     * Constructor for the ScoreHandler class
     * @param scene         graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param color         level color, grabbed from the LevelHandler.
     * @param scoreFont     font to use when rendering score.
     * @param score         preset score that might be passed from one level to the next.
     * @hidden
     */
    constructor(
        scene: Scene,
        color: Color,
        scoreFont: Font,
        scoreDetails: {
        score: number,
        lastLifeScore: number,
        lastTimeSlowScore: number
    }) {
        this._scene = scene;
        this._scoreFont = scoreFont;
        this._currentColor = color;
        this._currentScore = scoreDetails.score || 0;
        this._scoreSinceNewLife = scoreDetails.lastLifeScore || 0;
        this._scoreSinceSlowTime = scoreDetails.lastTimeSlowScore || 0;
        this._scoreMaterial = new MeshLambertMaterial( {color: color || 0x084E70} );
        this._createText();
    }

    /**
     * Flips only score relevent digits to visible.
     */
    private _changeScore(): void {
        const curScore = this._currentScore.toString();
        for (let i = 0; i < POSITION_INDEX.length; i++) {
            for (let j = 0; j < POSITION_INDEX.length; j++) {
                const mesh: Mesh = this._scores[i][j];
                mesh.visible = false;
            }
        }
        for (let i = 0; i < curScore.length; i++) {
            const mesh: Mesh = this._scores[i][Number(curScore[i])];
            mesh.visible = true;
        }
    }

    /**
     * Creates the text in one place to obey the DRY rule.
     */
    private _createText(): void {
        // Only remove score if it was added before.
        if (this._score) {
            this._removePreviousDigits();
        }
        // Added before or not, make a new one and add it.
        // Sadly TextGeometries must be removed and added whenever the text content changes.
        this._scoreGeometry = new TextGeometry(`Score: `,
            {
                font: this._scoreFont,
                size: 0.3,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelSegments: 3
            });
        this._score = new Mesh( this._scoreGeometry, this._scoreMaterial );
        this._score.position.x = -1.05;
        this._score.position.y = 0.75;
        this._score.position.z = SCORE_VERTICAL_POSITION;
        this._score.rotation.x = -1.5708;
        this._scene.add(this._score);
        
        for (let i = 0; i < POSITION_INDEX.length; i++) {
            for (let j = 0; j < POSITION_INDEX.length; j++) {
                this._scoreGeometries[i][j] = new TextGeometry(`${j}`,
                    {
                        font: this._scoreFont,
                        size: 0.3,
                        height: 0.2,
                        curveSegments: 12,
                        bevelEnabled: false,
                        bevelThickness: 1,
                        bevelSize: 0.5,
                        bevelSegments: 3
                    });
                this._scores[i][j] = new Mesh( this._scoreGeometries[i][j], this._scoreMaterial );
                this._scores[i][j].position.x = POSITION_INDEX[i] + 0.35;
                this._scores[i][j].position.y = 0.75;
                this._scores[i][j].position.z = SCORE_VERTICAL_POSITION;
                this._scores[i][j].rotation.x = -1.5708;
                this._scores[i][j].visible = false;
                this._scene.add(this._scores[i][j]);
            }
        }
        this._changeScore();
    }

    /**
     * Removes all previously created score text and digits to change color.
     */
    private _removePreviousDigits() {
        this._scene.remove(this._score);
        for (let i = 0; i < POSITION_INDEX.length; i++) {
            for (let j = 0; j < POSITION_INDEX.length; j++) {
                this._scene.remove(this._scores[i][j]);
            }
        }
    }

    /**
     * Adds points when blowing up asteroids, enemy missiles, and ufos.
     * @param points the amount of points to add to current score.
     */
    public addPoints(points: number): void {
        this._currentScore += points;
        this._scoreSinceNewLife += points;
        this._scoreSinceSlowTime += points;

        if (this._scoreSinceNewLife >= SCORE_FOR_LIFE) {
            this._scoreSinceNewLife -= SCORE_FOR_LIFE;
            this._regenLife = true;
        }

        if (this._scoreSinceSlowTime >= SCORE_FOR_TIME_SLOW) {
            this._scoreSinceSlowTime -= SCORE_FOR_TIME_SLOW;
            this._regenTimeSlow = true;
        }

        if (this._score && this._score.visible) {
            this._changeScore();
        }
    }

    /**
     * At the end of each loop iteration, score updates with time increase.
     * @param hide hide the score if new level, so old color isn't showing.
     */
    public endCycle(hide?: boolean): void {
        if (this._score) {
            if (hide) {
                this._score.visible = false;
                for (let i = 0; i < POSITION_INDEX.length; i++) {
                    for (let j = 0; j < POSITION_INDEX.length; j++) {
                        const mesh: Mesh = this._scores[i][j];
                        mesh.visible = false;
                    }
                }
            } else if (this._score.visible) {
                this._changeScore();
            }
        }
    }

    /**
     * Returns regeneration bonuses if there are any and resets the flags.
     * @returns bonus object containing last known regeneration rewards.
     */
    public getBonuses(): { freeLife: boolean; timeSlow: boolean; } {
        const bonus = { freeLife: this._regenLife, timeSlow: this._regenTimeSlow };
        this._regenLife = false;
        this._regenTimeSlow = false;
        return bonus;
    }

    /**
     * Passes current score value back to caller.
     * @returns the current score at time of function call.
     */
    public getScore(): number {
        return this._currentScore;
    }

    /**
     * Passes current score since bonus life value back to caller.
     * @returns the current score since bonus life at time of function call.
     */
    public getScoreSinceLife(): number {
        return this._scoreSinceNewLife;
    }

    /**
     * Passes current score since time slow value back to caller.
     * @returns the current score since time slow at time of function call.
     */
    public getScoreSinceTimeSlow(): number {
        return this._scoreSinceSlowTime;
    }

    /**
     * Only recreate the digits with the new color
     * @param color level color, grabbed from the LevelHandler
     */
    public nextLevel(color: Color) {
        this._currentColor = color;
        this._scoreMaterial = new MeshLambertMaterial( {color: this._currentColor} );
        this._createText();
    }
}