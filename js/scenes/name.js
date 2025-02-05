import {gamePrefs, dialogos} from '/js/globals.js';
import {typeEffectText, writeName} from '/js/globalFunctions.js';

export default class name extends Phaser.Scene
{
    constructor()
    {
        super({key:'name'});
    }

    init()
    {
        this.secuencia = 
        [
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg22},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg23},
            {tipo:"accion",accion:'introducirNombre'},
            {tipo:"dialogo",personaje:'boss',texto:gamePrefs.STUDENT_NAME + dialogos.msg24},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg25},
            {tipo:"accion",accion:'iniciaJuego'}
        ];
    }

    preload()
    { 
        this.cameras.main.setBackgroundColor('#181425');
    }

    create()
    {
        // FUNCIONES DE RICHARD!!!
        this.init();     

        // EMPEZAR EL DIÁLOGO
        this.dialogTextObject = this.add.bitmapText(20, 150, 'textFont', '', 10).setDepth(99); 
        this.speed = 100;  // Velocidad de escritura en milisegundos entre cada letra
        typeEffectText(this, this.dialogTextObject, this.secuencia, this.speed);
    }

    handleAction(_action, _currentIndex) 
    {
        // Dependiendo del tipo de acción, llama a la función correspondiente
        switch (_action) 
        {
            case 'introducirNombre':
                writeName(this, this.dialogTextObject, _currentIndex);
                break;
            case 'iniciaJuego':
                this.iniciaJuego();
                break;
            default:
                console.log('Acción desconocida: ' + _action);
                break; 
        }
    }

    iniciaJuego()
    {
        this.scene.start('level1');
    }

}    