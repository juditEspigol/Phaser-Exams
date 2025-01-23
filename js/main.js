import examen_av from "./examen_av.js";
import { gamePrefs } from "./globals.js";

export const config = 
{
    type: Phaser.AUTO,
    width: gamePrefs.gameWidth,
    height: gamePrefs.gameHeight,
    scene:[examen_av], //array con las escenas
    render:
    {
        pixelArt:true
    },
    scale:
    {
        mode:Phaser.Scale.FIT,
        width:gamePrefs.gameWidth/4,
        height:gamePrefs.gameHeight/4,
        autoCenter:Phaser.Scale.CENTER_BOTH
    }
    ,
    physics:
    {
        default:'arcade',
        arcade:
        {
            gravity:{y:gamePrefs.STUDENT_GRAVITY},
            debug:true
        }
    },
    fps:
    {
        target:60,
        forceSetTimeOut:true
    }
};

var juego = new Phaser.Game(config);