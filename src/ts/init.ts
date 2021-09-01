import { ASSETS_CTRL } from './controls/controllers/assets-controller';

import { SceneType } from './models/scene-type';

import { DevMenu } from './scenes/dev-menu/dev-menu';
import { Intro } from './scenes/cut-scenes/intro/intro';
import { MainPlayLevel } from './scenes/main-play-level/main-play-level';
import { Menu } from './scenes/main-menu/menu';

import { ENVIRONMENT } from './environment';

import { createSceneModule } from './utils/create-scene-module';
import { disposeScene } from './utils/dispose-scene';
import { adjustWindowDimensions } from './utils/on-window-resize';
import { ScoreCtrl } from './controls/controllers/score-controller';
import { Color } from 'three';
import { LifeCtrl } from './controls/controllers/lives-controller';
import { SlowMo_Ctrl } from './controls/controllers/slow-mo-controller';

const scenes: { [ key: string ]: SceneType } = {
    devMenu: {
        active: false,
        camera: null,
        instance: null,
        raycaster: null,
        renderer: null,
        scene: null
    },
    intro: {
        active: false,
        camera: null,
        instance: null,
        raycaster: null,
        renderer: null,
        scene: null
    },
    mainPlayLevel: {
        active: false,
        camera: null,
        instance: null,
        raycaster: null,
        renderer: null,
        scene: null
    },
    menu: {
        active: false,
        camera: null,
        instance: null,
        raycaster: null,
        renderer: null,
        scene: null
    }
};

/**
 * Loads the dev menu with all the mini games and game sections separated as testable/playable games.
 */
const loadDevMenu = () => {
    const sceneMod = createSceneModule(scenes.devMenu);

    window.addEventListener( 'resize', sceneMod.onWindowResizeRef, false);
    // Click event listeners that activates certain menu options.
    const activateIntroScene = () => {
        scenes.devMenu.active = false;
        window.removeEventListener( 'resize', sceneMod.onWindowResizeRef, false);
        sceneMod.container.removeChild( (scenes.devMenu.renderer as any).domElement );
        setTimeout(() => {
            loadIntroScene();
        }, 50);
    };
    const activateGameMenu = () => {
        scenes.devMenu.active = false;
        window.removeEventListener( 'resize', sceneMod.onWindowResizeRef, false);
        sceneMod.container.removeChild( (scenes.devMenu.renderer as any).domElement );
        setTimeout(() => {
            loadGameMenu();
        }, 50);
    };
    const activateMainPlayLevelScene = (
        level: number,
        lives: number,
        difficulty: number,
        scoreDetails: {
            score: number,
            lastLifeScore: number,
            lastTimeSlowScore: number
        }) => {
        scenes.devMenu.active = false;
        window.removeEventListener( 'resize', sceneMod.onWindowResizeRef, false);
        sceneMod.container.removeChild( (scenes.devMenu.renderer as any).domElement );
        setTimeout(() => {
            loadMainPlayLevelScene(
                level,
                lives,
                difficulty,
                scoreDetails);
        }, 50);
    };
    
    // Create instance of game section.
    scenes.devMenu.instance = new DevMenu(
        scenes.devMenu,
        {
            activateGameMenu,
            activateIntroScene,
            activateMainPlayLevelScene
        });
    
    /**
     * The render loop. Everything that should be checked, called, or drawn in each animation frame.
     */
    const render = () => {
        if (scenes.devMenu.active) {
            scenes.devMenu.instance.endCycle();
        } else {
            scenes.devMenu.instance.dispose();
            // Clear up memory used by dev menu scene.
            disposeScene(scenes.devMenu);
            return;
        }
        scenes.devMenu.renderer.render( scenes.devMenu.scene, scenes.devMenu.camera );
        requestAnimationFrame( render );
    };
    // Kick off the first render loop iteration.
    scenes.devMenu.renderer.render( scenes.devMenu.scene, scenes.devMenu.camera );
    requestAnimationFrame( render );
};

/**
 * Loads the game menu with the actual gameplay starting point
 */
const loadGameMenu = () => {
    const sceneMod = createSceneModule(scenes.menu, true);
    // Create instance of game section.
    scenes.menu.instance = new Menu(scenes.menu);

    /**
     * The render loop. Everything that should be checked, called, or drawn in each animation frame.
     */
    const render = () => {
        const difficultyChosen = scenes.menu.instance.endCycle();
        if (isNaN(Number(difficultyChosen))) {
            setTimeout(() => {
                scenes.menu.instance.dispose();
                window.removeEventListener( 'resize', sceneMod.onWindowResizeRef, false);
                sceneMod.container.removeChild( (scenes.menu.renderer as any).domElement );
                // Clears up memory used by menu scene.
                disposeScene(scenes.menu);

                loadMainPlayLevelScene(
                    1,
                    5 - difficultyChosen,
                    difficultyChosen,
                    {
                        score: 0,
                        lastLifeScore: 0,
                        lastTimeSlowScore: 0
                    });
            }, 750);
        } else {
            scenes.menu.renderer.render( scenes.menu.scene, scenes.menu.camera );
            requestAnimationFrame( render );
        }
    };
    // Kick off the first render loop iteration.
    scenes.menu.renderer.render( scenes.menu.scene, scenes.menu.camera );
	requestAnimationFrame( render );
};

/**
 * Environment specific menu.
 * Dev environment loads Dev menu, while Prod environment loads regular menu.
 */
const loadMenu = ENVIRONMENT === 'production' ? loadGameMenu : loadDevMenu;

/**
 * Game's intro scene. Only starts when all assets are finished loading.
 */
const loadIntroScene = () => {
    const sceneMod = createSceneModule(scenes.intro);
    // Create instance of game section.
    scenes.intro.instance = new Intro(scenes.intro);

    /**
     * The render loop. Everything that should be checked, called, or drawn in each animation frame.
     */
    const render = () => {
        if (scenes.intro.instance.endCycle()) {
            scenes.intro.instance.dispose();
            // Remove renderer from the html container, and remove event listeners.
            window.removeEventListener( 'resize', sceneMod.onWindowResizeRef, false);
            sceneMod.container.removeChild( (scenes.intro.renderer as any).domElement );
            // Clear up memory used by intro scene.
            disposeScene(scenes.intro);
            // Always launch menu after intro is complete.
            loadMenu();
            return;
        }
        scenes.intro.renderer.render( scenes.intro.scene, scenes.intro.camera );
        requestAnimationFrame( render );
    };
    // Kick off the first render loop iteration.
    scenes.intro.renderer.render( scenes.intro.scene, scenes.intro.camera );
	requestAnimationFrame( render );
};

/**
 * Game's main level scene, where player actually plays the game. Only starts when all assets are finished loading.
 */
const loadMainPlayLevelScene = (
    level: number,
    lives: number,
    difficulty: number,
    scoreDetails: {
        score: number,
        lastLifeScore: number,
        lastTimeSlowScore: number
    }) => {
    const sceneMod = createSceneModule(scenes.mainPlayLevel);
    // Create instance of game section.
    scenes.mainPlayLevel.instance = new MainPlayLevel(scenes.mainPlayLevel, level, lives);
    // Create instance of score keeper.
    const scoreboard = new ScoreCtrl(scenes.mainPlayLevel.scene, new Color(0xFFFFFF), ASSETS_CTRL.gameFont, scoreDetails);
    scenes.mainPlayLevel.instance.addScoreBoard(scoreboard);
    const lifeHandler = new LifeCtrl(scenes.mainPlayLevel.scene, level, lives);
    scenes.mainPlayLevel.instance.addLifeHandler(lifeHandler);

    SlowMo_Ctrl.setDifficulty(difficulty || 0);
    /**
     * The render loop. Everything that should be checked, called, or drawn in each animation frame.
     */
    const render = () => {
        if (!scenes.mainPlayLevel.active) {
            scenes.mainPlayLevel.instance.dispose();
            // Remove renderer from the html container, and remove event listeners.
            window.removeEventListener( 'resize', sceneMod.onWindowResizeRef, false);
            sceneMod.container.removeChild( (scenes.mainPlayLevel.renderer as any).domElement );
            // Clear up memory used by mainPlayLevel scene.
            disposeScene(scenes.mainPlayLevel);
            return;
        } else {
            const isOver: boolean = scenes.mainPlayLevel.instance.endCycle();
            if (isOver) {
                scenes.mainPlayLevel.instance.dispose();
                scenes.mainPlayLevel.active = false;
                // Remove renderer from the html container, and remove event listeners.
                window.removeEventListener( 'resize', sceneMod.onWindowResizeRef, false);
                sceneMod.container.removeChild( (scenes.mainPlayLevel.renderer as any).domElement );
                // Clear up memory used by mainPlayLevel scene.
                disposeScene(scenes.mainPlayLevel);
                setTimeout(() => {
                    SlowMo_Ctrl.exitSlowMo();
                    if (level === 40) {
                        // TODO: Play the You Win scene and collect initials.
                        loadMenu();
                    } else if(lifeHandler.getLives() <= 0) {
                        // TODO: Play the You suck you lost scene and collect initials.
                        loadMenu();
                    } else {
                        loadMainPlayLevelScene(
                            level + 1,
                            lifeHandler.getLives(),
                            difficulty,
                            {
                                score: scoreboard.getScore(),
                                lastLifeScore: scoreboard.getScoreSinceLife(),
                                lastTimeSlowScore: scoreboard.getScoreSinceTimeSlow()
                            });
                    }
                }, 10);
                return;
            }
        }
        scenes.mainPlayLevel.renderer.render( scenes.mainPlayLevel.scene, scenes.mainPlayLevel.camera );
        requestAnimationFrame( render );
    };
    // Kick off the first render loop iteration.
    scenes.mainPlayLevel.renderer.render( scenes.mainPlayLevel.scene, scenes.mainPlayLevel.camera );
	requestAnimationFrame( render );
};

/**
 * Called by DOM when page is finished loading. Now load assets, then the game.
 */
export default () => {
    adjustWindowDimensions();

    ASSETS_CTRL.init(loadDevMenu); // TODO: Add ability to read game load code from url query param.
}