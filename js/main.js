//Cargamos el Intellisense
/// <reference path="../def/phaser.d.ts" />

//Importamos las escenas
import preloader from '/js/scenes/preloader.js';
import intro from '/js/scenes/intro.js';
import name from '/js/scenes/name.js';
import level1 from '/js/scenes/level1.js';
//Importamos el módulo de gamePrefs
import {gamePrefs} from '/js/globals.js';

export const config = 
{
    type: Phaser.AUTO,
    width: gamePrefs.gameWidth,
    height: gamePrefs.gameHeight,
    scene:[preloader,intro,name,level1], //array con las escenas
    render:
    {
        pixelArt:true
    },
    physics:
    {
        default:'arcade',
        arcade:
        {
            gravity:{y:gamePrefs.GRAVITY},
            debug:false
        }
    },
    scale:
    {
        mode:Phaser.Scale.FIT,
        width:gamePrefs.gameWidth,
        height:gamePrefs.gameHeight,
        autoCenter:Phaser.Scale.CENTER_BOTH
    }
}

var juego = new Phaser.Game(config);