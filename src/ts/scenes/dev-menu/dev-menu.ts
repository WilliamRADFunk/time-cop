import { Scene, Mesh } from "three";

import { SceneType } from "../../models/scene-type";
import { LeftTopPanel } from "../../controls/panels/left-top-panel";
import { RightTopPanel } from "../../controls/panels/right-top-panel";
import { LeftTopMiddlePanel } from "../../controls/panels/left-top-middle-panel";
import { RightTopMiddlePanel } from "../../controls/panels/right-top-middle-panel";
import { LeftBottomMiddlePanel } from "../../controls/panels/left-bottom-middle-panel";
import { RightBottomMiddlePanel } from "../../controls/panels/right-bottom-middle-panel";
import { LeftBottomPanel } from "../../controls/panels/left-bottom-panel";
import { RightBottomPanel } from "../../controls/panels/right-bottom-panel";
import { LoadButton } from "../../controls/buttons/load-button";
import { BUTTON_COLORS } from "../../styles/button-colors";
import { LeftTopTitleText } from "../../controls/text/title/left-top-title-text";
import { COLORS } from "../../styles/colors";
import { TextType } from "../../controls/text/text-type";
import { ButtonBase } from "../../controls/buttons/button-base";
import { RightBottomMiddleTitleText } from "../../controls/text/title/right-bottom-middle-title-text";
import { LeftBottomTitleText } from "../../controls/text/title/left-bottom-title-text";
import { NextButton } from "../../controls/buttons/next-button";
import { RightBottomTitleText } from "../../controls/text/title/right-bottom-title-text";
import { TextMap } from "../../models/text-map";
import { PreviousButton } from "../../controls/buttons/previous-button";
import { LeftTopProfile } from "../../controls/profiles/left-top-profile";
import { RightTopProfile } from "../../controls/profiles/right-top-profile";
import { RightTopMiddleProfile } from "../../controls/profiles/right-top-middle-profile";
import { LeftTopMiddleProfile } from "../../controls/profiles/left-top-middle-profile";
import { LeftBottomMiddleProfile } from "../../controls/profiles/left-bottom-middle-profile";
import { RightBottomMiddleProfile } from "../../controls/profiles/right-bottom-middle-profile";
import { LeftBottomProfile } from "../../controls/profiles/left-bottom-profile";
import { RightBottomProfile } from "../../controls/profiles/right-bottom-profile";
import { ToggleBase } from "../../controls/buttons/toggle-base";
import { FreestyleText } from "../../controls/text/freestyle-text";
import { MinusButton } from "../../controls/buttons/minus-button";
import { PlusButton } from "../../controls/buttons/plus-button";
import { ProfileBase } from "../../controls/profiles/profile-base";
import { ASSETS_CTRL } from "../../controls/controllers/assets-controller";
import { NumberMapToString } from "../../models/number-map-to-string";
import { StringMapToNumber } from "../../models/string-map-to-number";
import { InputBarNoLabel } from "../../controls/inputs/text-bar-no-label";
import { InputBarBase, InputBarType } from "../../controls/inputs/input-bar-base";
import { SCORE_FOR_LIFE, SCORE_FOR_TIME_SLOW } from "../../controls/controllers/score-controller";
import { DifficultyMap } from "../../models/difficulty-map";

// const border: string = '1px solid #FFF';
const border: string = 'none';

const buttonScale: number = 2;

/**
 * Establishes a one-place fetch for the height of dev menu elements in the Main Play Level scene.
 * @param row row number on the dev menu section for the Main Play Level scene.
 * @param height the height of the window to multiply modifer against.
 * @returns the height to use on all elements on that row.
 */
function sizeHeightForMainPlayLevel(row: number, height: number): number {
    switch(row) {
        case -2: {
            return 0.755 * height;
        }
        case -1: {
            return 0.784 * height;
        }
        case 0: {
            return 0.82 * height;
        }
        case 1: {
            return 0.855 * height;
        }
        case 2: {
            return 0.89 * height;
        }
        case 3: {
            return 0.925 * height;
        }
        case 4: {
            return 0.96 * height;
        }
    }
}

/**
 * @class
 * Keeps track of all things menu related accessible only to dev.
 */
export class DevMenu {
    /**
     * List of buttons.
     */
    private _buttons: { [key: string]: ButtonBase | ToggleBase };

    /**
     * Current page number.
     */
    private _currentPage: number = 1;

    /**
     * Reference to _onWindowResize so that it can be removed later.
     */
    private _listenerRef: () => void;

    /**
    * Specification of what the starter conditions of the main level should be.
    */
    private _mainPlayLevelSpec: StringMapToNumber = {
        difficulty: 2,
        level: 1,
        lives: 3,
        score: 0
    };

    /**
     * List of buttons on page 1.
     */
    private _page1buttons: { [key: string]: ButtonBase | ToggleBase } = {};

    /**
     * List of buttons on page 2.
     */
    private _page2buttons: { [key: string]: ButtonBase | ToggleBase } = {};

    /**
     * List of buttons on page 3.
     */
    private _page3buttons: { [key: string]: ButtonBase } = {};

    /**
     * List of counters on page 1.
     */
    private _page1counters: StringMapToNumber = {};

    /**
     * List of counters on page 2.
     */
    private _page2counters: StringMapToNumber = {};

    /**
     * List of counters on page 3.
     */
    private _page3counters: StringMapToNumber = {};

    /**
     * List of countermaxes on page 1.
     */
    private _page1countermaxes: StringMapToNumber = {};

    /**
     * List of countermaxes on page 2.
     */
    private _page2countermaxes: StringMapToNumber = {};

    /**
     * List of countermaxes on page 3.
     */
    private _page3countermaxes: StringMapToNumber = {};

    /**
     * Groups of input elements for page 1.
     */
    private _page1inputElements: { [key: string]: InputBarBase } = {};

    /**
     * Groups of input elements for page 2.
     */
    private _page2inputElements: { [key: string]: InputBarBase } = {};

    /**
     * Groups of input elements for page 3.
     */
    private _page3inputElements: { [key: string]: InputBarBase } = {};

    /**
     * Contains key-value mapping of all meshes used on page 1.
     */
    private _page1Meshes: { [key: string]: Mesh } = {};

    /**
     * Contains key-value mapping of all meshes used on page 2.
     */
    private _page2Meshes: { [key: string]: Mesh } = {};

    /**
     * Contains key-value mapping of all meshes used on page 3.
     */
    private _page3Meshes: { [key: string]: Mesh } = {};

    /**
     * List of profiles on page 1.
     */
    private _page1profiles: { [key: string]: ProfileBase } = {};

    /**
     * List of profiles on page 2.
     */
    private _page2profiles: { [key: string]: ProfileBase } = {};

    /**
     * List of profiles on page 3.
     */
    private _page3profiles: { [key: string]: ProfileBase } = {};

    /**
     * Groups of text elements for page 1.
     */
    private _page1textElements: TextMap = {};

    /**
     * Groups of text elements for page 2.
     */
    private _page2textElements: TextMap = {};

    /**
     * Groups of text elements for page 3.
     */
    private _page3textElements: TextMap = {};

    /**
     * Reference to the scene, used to remove and reinstall text geometries.
     */
    private _scene: Scene;

    /**
     * Groups of text elements.
     */
    private _textElements: TextMap;

    /**
     * Constructor for the Menu class
     * @param scene graphic rendering scene object. Used each iteration to redraw things contained in scene.
     * @param menuFont loaded font to use for menu button text.
     * @hidden
     */
    constructor(scene: SceneType, callbacks: { [key: string]: (...args: any) => void }) {
        this._scene = scene.scene;

        this._listenerRef = this._onWindowResize.bind(this);
        window.addEventListener('resize', this._listenerRef, false);

        const leftTopPanel = new LeftTopPanel(this._scene);
        const rightTopPanel = new RightTopPanel(this._scene);
        const leftTopMiddlePanel = new LeftTopMiddlePanel(this._scene);
        const rightTopMiddlePanel = new RightTopMiddlePanel(this._scene);
        const leftBottomMiddlePanel = new LeftBottomMiddlePanel(this._scene);
        const rightBottomMiddlePanel = new RightBottomMiddlePanel(this._scene);
        const leftBottomPanel = new LeftBottomPanel(this._scene);
        const rightBottomPanel = new RightBottomPanel(this._scene);

        // Get window dimmensions
        let width = window.innerWidth * 0.99;
        let height = window.innerHeight * 0.99;
        width < height ? height = width : width = height;
        const left = (((window.innerWidth * 0.99) - width) / 2);
//#region Page 1
    //#region LaunchGameMenu
        this._page1textElements.leftTopTitleText = new LeftTopTitleText(
            'Game Menu',
            { left, height, top: null, width },
            COLORS.neutral,
            border,
            TextType.FADABLE);

        let onClick = () => {
            this._page1buttons.launchGameMenuButton.disable();
            callbacks.activateGameMenu();
        };

        this._page1buttons.launchGameMenuButton = new LoadButton(
            { left: left + (0.115 * width), height, top: 0.1 * height, width },
            BUTTON_COLORS,
            onClick,
            true,
            buttonScale);
    //#endregion
    //#region LaunchIntroScene
        this._page1textElements.rightBottomMiddleTitleText = new RightBottomMiddleTitleText(
            'Intro',
            { left, height, top: null, width },
            COLORS.neutral,
            border,
            TextType.FADABLE);

        onClick = () => {
            this._page1buttons.launchIntroSceneButton.disable();
            callbacks.activateIntroScene();
        };

        this._page1buttons.launchIntroSceneButton = new LoadButton(
            { left: left + width - (buttonScale * 0.12 * width) - (0.14 * width), height, top: 0.61 * height, width },
            BUTTON_COLORS,
            onClick,
            true,
            buttonScale);
    //#endregion
    //#region LaunchMainPlayLevelScene
        this._page1textElements.leftBottomTitleText = new LeftBottomTitleText(
            'Main Play Level',
            { left, height, top: null, width },
            COLORS.highlighted,
            border,
            TextType.FADABLE);

        onClick = () => {
            this._page1buttons.launchMainPlayLevelSceneButton.disable();
            callbacks.activateMainPlayLevelScene(
                this._mainPlayLevelSpec.level,
                this._mainPlayLevelSpec.lives,
                this._mainPlayLevelSpec.difficulty,
                {
                    score: this._mainPlayLevelSpec.score,
                    lastLifeScore: this._mainPlayLevelSpec.score % SCORE_FOR_LIFE,
                    lastTimeSlowScore: this._mainPlayLevelSpec.score % SCORE_FOR_TIME_SLOW
                });
        };

        this._page1buttons.launchMainPlayLevelSceneButton = new LoadButton(
            { left: left + (0.175 * width), height, top: 0.787 * height, width },
            BUTTON_COLORS,
            onClick,
            true,
            buttonScale * 0.5);
            
        let row0Left = 0.0625;
        const row0height = sizeHeightForMainPlayLevel(0, height);
        
        this._page1textElements.levelTitleText = new FreestyleText(
            'Level',
            { left: left + (row0Left * width), height, top: row0height, width },
            COLORS.default,
            'none',
            TextType.STATIC);
        
        row0Left += 0.3;
        
        this._page1textElements.livesTitleText = new FreestyleText(
            'Lives',
            { left: left + (row0Left * width), height, top: row0height, width },
            COLORS.default,
            'none',
            TextType.STATIC);

        onClick = () => {
            let level = this._mainPlayLevelSpec.level - 1;
            if (level < 1) {
                level = 40;
            }
            this._mainPlayLevelSpec.level = level;
            this._page1textElements.levelReadoutText.update(this._mainPlayLevelSpec.level.toString());
        };

        let row1Left = 0.015;
        const row1height = sizeHeightForMainPlayLevel(1, height);
        this._page1buttons.levelMinusButton = new MinusButton(
            { left: left + (row1Left * width), height, top: row1height, width },
            BUTTON_COLORS,
            onClick,
            true,
            0.5);

        row1Left += 0.065;
        this._page1textElements.levelReadoutText = new FreestyleText(
            this._mainPlayLevelSpec.level.toString(),
            { left: left + (row1Left * width), height, top: row1height, width },
            COLORS.default,
            'none',
            TextType.STATIC);

        onClick = () => {
            let level = this._mainPlayLevelSpec.level + 1;
            if (level > 40) {
                level = 1;
            }
            this._mainPlayLevelSpec.level = level;
            this._page1textElements.levelReadoutText.update(this._mainPlayLevelSpec.level.toString());
        };

        row1Left += 0.05;
        this._page1buttons.levelPlusButton = new PlusButton(
            { left: left + (row1Left * width), height, top: row1height, width },
            BUTTON_COLORS,
            onClick,
            true,
            0.5);

        onClick = () => {
            let lives = this._mainPlayLevelSpec.lives - 1;
            if (lives < 1) {
                lives = 5;
            }
            this._mainPlayLevelSpec.lives = lives;
            this._page1textElements.livesReadoutText.update(this._mainPlayLevelSpec.lives.toString());
        };

        row1Left += 0.18;
        this._page1buttons.livesMinusButton = new MinusButton(
            { left: left + (row1Left * width), height, top: row1height, width },
            BUTTON_COLORS,
            onClick,
            true,
            0.5);

        row1Left += 0.07;
        this._page1textElements.livesReadoutText = new FreestyleText(
            this._mainPlayLevelSpec.lives.toString(),
            { left: left + (row1Left * width), height, top: row1height, width },
            COLORS.default,
            'none',
            TextType.STATIC);

        onClick = () => {
            let lives = this._mainPlayLevelSpec.lives + 1;
            if (lives > 5) {
                lives = 1;
            }
            this._mainPlayLevelSpec.lives = lives;
            this._page1textElements.livesReadoutText.update(this._mainPlayLevelSpec.lives.toString());
        };

        row1Left += 0.05;
        this._page1buttons.livesPlusButton = new PlusButton(
            { left: left + (row1Left * width), height, top: row1height, width },
            BUTTON_COLORS,
            onClick,
            true,
            0.5);

        let row2Left = 0.145;
        const row2height = sizeHeightForMainPlayLevel(2, height);

        this._page1textElements.startingScoreText = new FreestyleText(
            'Starting Score (>= 0)',
            { left: left + (row2Left * width), height, top: row2height, width },
            COLORS.default,
            'none',
            TextType.STATIC);

        let row3Left = 0.085;
        const row3height = sizeHeightForMainPlayLevel(3, height);

        const onChange = (e: { prev: string, next: string }) => {
            if (Number(e.next || 0) < 0) {
                this._mainPlayLevelSpec.score = Number(e.prev || 0);
            } else {
                this._mainPlayLevelSpec.score = Number(e.next || 0);
            }
        
            this._page1inputElements.startingScore.element.setAttribute('value', this._mainPlayLevelSpec.score.toString());
        };

        this._page1inputElements.startingScore = new InputBarNoLabel(
            { left: left + (row3Left * width), height, top: row3height, width: width * 10 },
            { background: '#00000000', border: COLORS.neutral, text: COLORS.default },
            onChange,
            true,
            InputBarType.Number,
            0.5);
        
        this._page1inputElements.startingScore.element.setAttribute('value', this._mainPlayLevelSpec.score.toString());
        this._page1inputElements.startingScore.element.setAttribute('min', '0');

        let row4Left = 0.145;
        const row4height = sizeHeightForMainPlayLevel(4, height);

        this._page1textElements.difficultyLabelText = new FreestyleText(
            'Difficulty: ',
            { left: left + (row4Left * width), height, top: row4height, width },
            COLORS.default,
            'none',
            TextType.STATIC);
        
        row4Left += 0.1;

        this._page1textElements.difficultyChoiceText = new FreestyleText(
            DifficultyMap[this._mainPlayLevelSpec.difficulty],
            { left: left + (row4Left * width), height, top: row4height, width },
            COLORS.default,
            'none',
            TextType.STATIC);

        onClick = () => {
            let difficulty = this._mainPlayLevelSpec.difficulty + 1;
            if (difficulty > 3) {
                difficulty = 0;
            }
            this._mainPlayLevelSpec.difficulty = difficulty;
            this._page1textElements.difficultyChoiceText.update(DifficultyMap[this._mainPlayLevelSpec.difficulty]);

            this._mainPlayLevelSpec.lives = 5 - difficulty;
            this._page1textElements.livesReadoutText.update(this._mainPlayLevelSpec.lives.toString());
        };

        row4Left += 0.1;
        this._page1buttons.difficultyNextButton = new NextButton(
            { left: left + (row4Left * width), height, top: row4height, width },
            BUTTON_COLORS,
            onClick,
            true,
            0.5);
    //#endregion
    //#region Page1 Next
        this._page1textElements.rightBottomTitleText = new RightBottomTitleText(
            'Next Page',
            { left, height, top: null, width },
            COLORS.neutral,
            border,
            TextType.FADABLE);

        onClick = () => {
            this._page1buttons.nextPageButton.disable();
            this._next();
            this._page1buttons.nextPageButton.enable();
        };

        this._page1buttons.nextPageButton = new NextButton(
            { left: left + width - (0.29 * width), height, top: 0.845 * height, width },
            BUTTON_COLORS,
            onClick,
            true);
    //#endregion
//#endregion

//#region Page 2
        this._page2profiles.leftBottomMiddleProfile = new LeftBottomMiddleProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, false);
        this._page2profiles.leftTopMiddleProfile = new LeftTopMiddleProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, false);
        this._page2profiles.leftTopProfile = new LeftTopProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, false);
        this._page2profiles.rightBottomMiddleProfile = new RightBottomMiddleProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, false);
        this._page2profiles.rightTopMiddleProfile = new RightTopMiddleProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, false);
        this._page2profiles.rightTopProfile = new RightTopProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, false);
        this._page2profiles.leftBottomMiddleProfile.hide();
        this._page2profiles.leftTopMiddleProfile.hide();
        this._page2profiles.leftTopProfile.hide();
        this._page2profiles.rightBottomMiddleProfile.hide();
        this._page2profiles.rightTopMiddleProfile.hide();
        this._page2profiles.rightTopProfile.hide();

        this._page2textElements.leftBottomTitleText2 = new LeftBottomTitleText(
            'Previous Page',
            { left, height, top: null, width },
            COLORS.neutral,
            border,
            TextType.FADABLE);
        this._page2textElements.leftBottomTitleText2.hide();

        onClick = () => {
            this._page2buttons.previousPageButton2.disable();
            this._previous();
            this._page2buttons.previousPageButton2.enable();
        };

        this._page2buttons.previousPageButton2 = new PreviousButton(
            { left: left + (0.21 * width), height, top: 0.845 * height, width },
            BUTTON_COLORS,
            onClick,
            true);
        this._page2buttons.previousPageButton2.hide();

        this._page2textElements.rightBottomTitleText2 = new RightBottomTitleText(
            'Next Page',
            { left, height, top: null, width },
            COLORS.neutral,
            border,
            TextType.FADABLE);
        this._page2textElements.rightBottomTitleText2.hide();

        onClick = () => {
            this._page2buttons.nextPageButton2.disable();
            this._next();
            this._page2buttons.nextPageButton2.enable();
        };

        this._page2buttons.nextPageButton2 = new NextButton(
            { left: left + width - (0.29 * width), height, top: 0.845 * height, width },
            BUTTON_COLORS,
            onClick,
            true);
        this._page2buttons.nextPageButton2.hide();
//#endregion
//#region Page 3
        this._page3profiles.leftBottomProfile3 = new LeftBottomProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, false);
        this._page3profiles.rightBottomProfile3 = new RightBottomProfile(this._scene, ASSETS_CTRL.textures.engineerProfile, false);
        this._page3profiles.leftBottomProfile3.hide();
        this._page3profiles.rightBottomProfile3.hide();

        this._page3textElements.leftTopTitleText3 = new LeftTopTitleText(
            'Previous Page',
            { left, height, top: null, width },
            COLORS.neutral,
            border,
            TextType.FADABLE);
        this._page3textElements.leftTopTitleText3.hide();

        onClick = () => {
            this._page3buttons.previousPageButton3.disable();
            this._previous();
            this._page3buttons.previousPageButton3.enable();
        };

        this._page3buttons.previousPageButton3 = new PreviousButton(
            { left: left + (0.21 * width), height, top: 0.115 * height, width },
            BUTTON_COLORS,
            onClick,
            true);
        this._page3buttons.previousPageButton3.hide();
//#endregion

        this._textElements = {
            ...this._page1textElements,
            ...this._page2textElements,
            ...this._page3textElements
        };
        this._buttons = {
            ...this._page1buttons,
            ...this._page2buttons,
            ...this._page3buttons
        };
    }

    /**
     * Transitions to the next page in the dev menu options.
     */
    private _next(): void {
        this._currentPage++;
        if (this._currentPage === 2) {
            Object.keys(this._page1buttons).forEach(x => this._page1buttons[x] && this._page1buttons[x].hide());
            Object.keys(this._page1Meshes).forEach(x => this._page1Meshes[x] && (this._page1Meshes[x].visible = false));
            Object.keys(this._page1profiles).forEach(x => this._page1profiles[x] && this._page1profiles[x].hide());
            Object.keys(this._page1textElements).forEach(x => this._page1textElements[x] && this._page1textElements[x].hide());
            Object.keys(this._page2buttons).forEach(x => this._page2buttons[x] && this._page2buttons[x].show());
            Object.keys(this._page2Meshes).forEach(x => this._page2Meshes[x] && (this._page2Meshes[x].visible = true));
            Object.keys(this._page2profiles).forEach(x => this._page2profiles[x] && this._page2profiles[x].show());
            Object.keys(this._page2textElements).forEach(x => this._page2textElements[x] && this._page2textElements[x].show());
        } else if (this._currentPage === 3) {
            Object.keys(this._page2buttons).forEach(x => this._page2buttons[x] && this._page2buttons[x].hide());
            Object.keys(this._page2Meshes).forEach(x => this._page2Meshes[x] && (this._page2Meshes[x].visible = false));
            Object.keys(this._page2profiles).forEach(x => this._page2profiles[x] && this._page2profiles[x].hide());
            Object.keys(this._page2textElements).forEach(x => this._page2textElements[x] && this._page2textElements[x].hide());
            Object.keys(this._page3buttons).forEach(x => this._page3buttons[x] && this._page3buttons[x].show());
            Object.keys(this._page3Meshes).forEach(x => this._page3Meshes[x] && (this._page3Meshes[x].visible = true));
            Object.keys(this._page3profiles).forEach(x => this._page3profiles[x] && this._page3profiles[x].show());
            Object.keys(this._page3textElements).forEach(x => this._page3textElements[x] && this._page3textElements[x].show());
        }
    }

    /**
     * When the browser window changes in size, all html elements are updated in kind.
     */
    private _onWindowResize(): void {
        // Get new window dimmensions
        let width = window.innerWidth * 0.99;
        let height = window.innerHeight * 0.99;
        width < height ? height = width : width = height;
        const left = (((window.innerWidth * 0.99) - width) / 2);

        // Update the various structured texts
        Object.keys(this._textElements).forEach(el =>this._textElements[el] && this._textElements[el].resize({ left, height, top: null, width }));

        this._buttons.launchGameMenuButton.resize({ left: left + (0.115 * width), height, top: 0.1 * height, width });
        this._buttons.launchIntroSceneButton.resize({ left: left + width - (buttonScale * 0.12 * width) - (0.14 * width), height, top: 0.61 * height, width });
        this._buttons.launchMainPlayLevelSceneButton.resize({ left: left + (0.175 * width), height, top: 0.787 * height, width });

        let row0Left = 0.065;
        const row0height = sizeHeightForMainPlayLevel(0, height);
        this._page1textElements.levelTitleText.resize({ left: left + (row0Left * width), height, top: row0height, width });
        row0Left += 0.3;
        this._page1textElements.livesTitleText.resize({ left: left + (row0Left * width), height, top: row0height, width });

        let row1Left = 0.015;
        const row1height = sizeHeightForMainPlayLevel(1, height);
        this._page1buttons.levelMinusButton.resize({ left: left + (row1Left * width), height, top: row1height, width });
        row1Left += 0.065;
        this._page1textElements.levelReadoutText.resize({ left: left + (row1Left * width), height, top: row1height, width });
        row1Left += 0.05;
        this._page1buttons.levelPlusButton.resize({ left: left + (row1Left * width), height, top: row1height, width });
        row1Left += 0.18;
        this._page1buttons.livesMinusButton.resize({ left: left + (row1Left * width), height, top: row1height, width });
        row1Left += 0.07;
        this._page1textElements.livesReadoutText.resize({ left: left + (row1Left * width), height, top: row1height, width });
        row1Left += 0.05;
        this._page1buttons.livesPlusButton.resize({ left: left + (row1Left * width), height, top: row1height, width });

        let row2Left = 0.17;
        const row2height = sizeHeightForMainPlayLevel(2, height);
        this._page1textElements.startingScoreText.resize({ left: left + (row2Left * width), height, top: row2height, width });

        let row3Left = 0.085;
        const row3height = sizeHeightForMainPlayLevel(3, height);
        this._page1inputElements.startingScore.resize({ left: left + (row3Left * width), height, top: row3height, width: width * 10 });

        let row4Left = 0.145;
        const row4height = sizeHeightForMainPlayLevel(4, height);
        this._page1textElements.difficultyLabelText.resize({ left: left + (row4Left * width), height, top: row4height, width });
        
        row4Left += 0.1;
        this._page1textElements.difficultyChoiceText.resize({ left: left + (row4Left * width), height, top: row4height, width });

        row4Left += 0.1;
        this._page1buttons.difficultyNextButton.resize({ left: left + (row4Left * width), height, top: row4height, width });

        this._buttons.nextPageButton.resize({ left: left + width - (0.29 * width), height, top: 0.845 * height, width });
        this._buttons.nextPageButton2.resize({ left: left + width - (0.29 * width), height, top: 0.845 * height, width });
        this._buttons.previousPageButton2.resize({ left: left + (0.21 * width), height, top: 0.845 * height, width });
        this._buttons.previousPageButton3.resize({ left: left + (0.21 * width), height, top: 0.115 * height, width });
    };

    /**
     * Transitions to the previous page in the dev menu options.
     */
    private _previous(): void {
        this._currentPage--;
        if (this._currentPage === 1) {
            Object.keys(this._page2buttons).forEach(x => this._page2buttons[x] && this._page2buttons[x].hide());
            Object.keys(this._page2Meshes).forEach(x => this._page2Meshes[x] && (this._page2Meshes[x].visible = false));
            Object.keys(this._page2profiles).forEach(x => this._page2profiles[x] && this._page2profiles[x].hide());
            Object.keys(this._page2textElements).forEach(x => this._page2textElements[x] && this._page2textElements[x].hide());
            Object.keys(this._page1buttons).forEach(x => this._page1buttons[x] && this._page1buttons[x].show());
            Object.keys(this._page1Meshes).forEach(x => this._page1Meshes[x] && (this._page1Meshes[x].visible = true));
            Object.keys(this._page1profiles).forEach(x => this._page1profiles[x] && this._page1profiles[x].show());
            Object.keys(this._page1textElements).forEach(x => this._page1textElements[x] && this._page1textElements[x].show());
        } else if (this._currentPage === 2) {
            Object.keys(this._page3buttons).forEach(x => this._page3buttons[x] && this._page3buttons[x].hide());
            Object.keys(this._page2Meshes).forEach(x => this._page2Meshes[x] && (this._page2Meshes[x].visible = false));
            Object.keys(this._page3profiles).forEach(x => this._page3profiles[x] && this._page3profiles[x].hide());
            Object.keys(this._page3textElements).forEach(x => this._page3textElements[x] && this._page3textElements[x].hide());
            Object.keys(this._page2buttons).forEach(x => this._page2buttons[x] && this._page2buttons[x].show());
            Object.keys(this._page2Meshes).forEach(x => this._page2Meshes[x] && (this._page2Meshes[x].visible = true));
            Object.keys(this._page2profiles).forEach(x => this._page2profiles[x] && this._page2profiles[x].show());
            Object.keys(this._page2textElements).forEach(x => this._page2textElements[x] && this._page2textElements[x].show());
        }
    }

    /**
     * Removes any attached DOM elements, event listeners, or anything separate from ThreeJS
     */
    public dispose(): void {
        document.onmousemove = () => {};
        document.onclick = () => {};
        Object.keys(this._textElements).forEach(x => this._textElements[x] && this._textElements[x].dispose());
        Object.keys(this._buttons).forEach(x => this._buttons[x] && this._buttons[x].dispose());
        Object.keys(this._page1inputElements).forEach(x => this._page1inputElements[x] && this._page1inputElements[x].dispose());
        window.removeEventListener('resize', this._listenerRef, false);
    }

    /**
     * Something called once per frame on every scene.
     */
    public endCycle(): void {
        Object.keys(this._textElements).forEach(el =>
            this._textElements[el]
            && this._textElements[el].element.style.visibility === 'visible'
            && this._textElements[el].cycle());
        
        if (this._currentPage === 1) {
            // Move all counters up by one and reset if they hit the ceiling
            Object.keys(this._page1counters).forEach(counter => {
                this._page1counters[counter]++;
                if (this._page1counters[counter] > this._page1countermaxes[counter]) {
                    this._page1counters[counter] = 0;
                }
            });
        }
    }

}