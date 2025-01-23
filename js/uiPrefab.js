import { config } from "./main.js";

export default class uiPrefab 
{
    constructor(_scene) 
    {
        // ATTRIBUTOS
        this.scene = _scene;

        this.farmText = this.scene.add.bitmapText(30, 3, 'UIFont',this.scene.student.farm , 12).setScrollFactor(0).setDepth(3); 
        this.woodText = this.scene.add.bitmapText(80, 3, 'UIFont',this.scene.student.wood , 12).setScrollFactor(0).setDepth(3); 
        this.moneyText = this.scene.add.bitmapText(130, 3, 'UIFont',this.scene.student.money , 12).setScrollFactor(0).setDepth(3); 
        // CREAR LOS ICONOS PARA QUE APAREZCAN EN ESCENA
        this.farmIcon = this.scene.add.sprite(10, 10, 'counters', 3).setScrollFactor(0).setDepth(3);
        this.woodIcon = this.scene.add.sprite(60, 10, 'counters', 4).setScrollFactor(0).setDepth(3); 
        this.moneyIcon = this.scene.add.sprite(110, 10, 'counters', 5).setScrollFactor(0).setDepth(3);

        // Seteamos la posicion donde va a ir el dialogo
        this.dialog = this.scene.add.bitmapText(10, config.scale.height, 'dialogFont', ' ', 15).setOrigin(0, 1).setVisible(false).setScrollFactor(0).setDepth(3); 
    }

    updateText()
    {
        this.farmText.setText(this.scene.student.farm);
        this.woodText.setText(this.scene.student.wood);
        this.moneyText.setText(this.scene.student.money);
    }

    // LLamamos esta función si queremos que aprezca el dialogo, con el texto que queremos que aparezca
    dialogAppear(_textDialog)
    {
        if (this.scene.tweens.isTweening(this.dialog)) 
        {
            this.scene.tweens.killTweensOf(this.dialog);  // Detener el tween actual si esta desapareciendo
        }
    
        this.dialog.setText(_textDialog);
        this.dialog.alpha = 1;
        this.dialog.setVisible(true);
    }

    // LLamamos esta función con el tiempo que queremos que tarde en desaparezer
    dialogDisappear(_time)
    {
        this.scene.tweens.add({
            targets: this.dialog,      
            alpha: 0,                  
            duration: _time * 1000,
            ease: 'Linear', 
            onComplete: () => 
            {
                this.dialog.setVisible(false); // Lo seteamos a invisible por si acaso
            }
        });
    }
}
