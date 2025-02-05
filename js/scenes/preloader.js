export default class preloader extends Phaser.Scene
{
    constructor()
    {
        super({key:'preloader'});
    }

    preload()
    { //Carga assets en memoria
        this.load.setPath('assets/fonts/');
        this.load.bitmapFont('textFont','textFont.png','textFont.xml');

        this.load.setPath('assets/sounds/');
        this.load.audio('keySound', 'text.wav');

        this.load.on('complete',function()
        {
            this.scene.start('intro');
        },this);
    }
}
