import { dialogAppear } from "/js/globalFunctions.js";
import  {gamePrefs, dialogos} from "/js/globals.js"

export default class objectPrefab  extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_objeto)
    { //Instanciar el objeto

         // OBLIGATORIO PARA CREAR COLLISIONES EN LA ESCENA
         super(_scene,_objeto.posX,_objeto.posY,_objeto.type);
         _scene.add.existing(this);
         _scene.physics.world.enable(this);

        // ATTRIBUTOS
        this.scene = _scene;
        this.objeto = _objeto;
        this.startX = _objeto.posX;

        // ZONA INTERACTUBLE --> NO CAMBIAR EL NOMBRE 'areaZone'
        this.areaZone = _scene.add.zone(_objeto.posX,_objeto.posY);

            this.initTypeOfObject();  // Switch para cambiar la size de la zona y el interactiveIcon 
            // (Algunos objetos añaden collision, ya que no esta seteada en la layer!!!)
            
        _scene.physics.world.enable(this.areaZone);
        this.areaZone.body.setImmovable();
        this.areaZone.body.debugBodyColor = 0xffffff;

        // ATTRIBUTOS OBLIGATORIOS EN LOS INTERACTUABLES
        this.isPlayerInsideZone = false; 
        this.interacted = false;

        // COLLISIONES
        this.setColliders();
    }

    initTypeOfObject()
    {
        switch(this.objeto.type)
        {
            case 'torch':
                this.setVisible(false); 
                this.areaZone.setSize(20,20); 
                break; 
            case 'warp':
                this.areaZone.setSize(20,20); 
                break; 
            case 'spark':
                this.anims.play('spark', true); 
                this.areaZone.setSize(20,20); 
                break; 
            case 'totem':
                this.areaZone.setSize(24,50); 
                this.setVisible(false); 
                break; 
            case 'razor':
                this.anims.play('razor', true); 
                this.areaZone.setSize(86,8); 
                this.scene.tweens.add({
                    targets: this,             
                    x: this.x + 30,                   
                    duration: 500,     
                    yoyo: true,
                    repeat: -1
                });
                break; 
            case 'wall_torch':
                this.anims.play('wall_torch', true); 
                break; 
            case 'waterfall':
                this.anims.play('waterfall', true); 
                break; 
            case 'barrel':
                this.anims.play('barrel', true); 
                break; 
        }
    }

    setColliders()
    {
        this.scene.physics.add.overlap
        (
            this.scene.student,
            this.areaZone,
            function()
            {
                this.scene.interactiveObject(this);
            },
            null,
            this
        );        
    }

    searchObjectId(_name)
    {
        return this.scene.objectsArray.find((object) => object.objeto.id === _name);
    }

    onEnter(_student)
    {
        switch(this.objeto.type)
        {
            case 'warp':
                // GET RANDOM TEXT AND SET DIALOG APPEAR
                const mensajesWarp = [dialogos.msg34, dialogos.msg35, dialogos.msg36, dialogos.msg37];
                const randomIndexWarp = Math.floor(Math.random() * mensajesWarp.length);
                dialogAppear(this.scene, this.scene.dialogTextObject, mensajesWarp[randomIndexWarp]);

                let object; 
                switch(this.objeto.id) {
                    case 'warp_up':
                        object = this.searchObjectId('warp_down'); 
                        _student.setPosition(object.objeto.posX, object.objeto.posY - 30);
                    break; 
                    case 'warp_down':
                        object = this.searchObjectId('warp_up');
                        _student.setPosition(object.objeto.posX, object.objeto.posY + 30);
                    break; 
                    case 'warp_left':
                        object = this.searchObjectId('warp_right');
                        _student.setPosition(object.objeto.posX - 30, object.objeto.posY);
                    break; 
                    case 'warp_right':
                        object = this.searchObjectId('warp_left');
                        _student.setPosition(object.objeto.posX + 30, object.objeto.posY);
                    break; 
                }
            break; 

            case 'razor':
                this.scene.sound.play('damage'); 
                // GET RANDOM TEXT AND SET DIALOG APPEAR
                const mensajesRazor = [dialogos.msg31, dialogos.msg32, dialogos.msg33];
                const randomIndexRazor = Math.floor(Math.random() * mensajesRazor.length);
                dialogAppear(this.scene, this.scene.dialogTextObject, mensajesRazor[randomIndexRazor]);

                // UPDATE POSITION PLAYER
                _student.setPosition(gamePrefs.levelWidth / 2 - 8, gamePrefs.levelHeight / 2);

                // MAKE FLASH
                this.scene.cameras.main.flash(500, 255, 0, 0);
            break;
        }
    }

    interact(_student)
    {
        switch(this.objeto.type) 
        {
            case 'torch':
                if (_student.interacting)
                    return;

                // Jugador ha interactuando!! 
                _student.startInteraction(); 

                if(this.areaZone.body) 
                {
                    // Actualizar escenario

                    // Actiualizar jugador
                    _student.torchedInteractions += 1;
                    if (_student.torchedInteractions == 1) {
                        dialogAppear(this.scene, this.scene.dialogTextObject, dialogos.msg28);
                        _student.lightMask.setScale(2);
                    }
                    else if (_student.torchedInteractions == 2) {
                        dialogAppear(this.scene, this.scene.dialogTextObject, dialogos.msg29);
                        _student.lightMask.setScale(3);
                    }
                    else if(_student.torchedInteractions == 3) {
                        dialogAppear(this.scene, this.scene.dialogTextObject, dialogos.msg30);
                        _student.lightMask.setScale(50);
                    }
                    _student.stopInteraction(); 

                    // Destruir collisión
                    this.scene.sound.play('torch'); 
                    this.anims.play('torch', true); 
                    this.setVisible(true); 
                    this.destroyInteractable(); 
                } 
            break;

            case 'spark':
                if (_student.interacting || _student.torchedInteractions < 3) 
                    return;
                // Jugador ha interactuando!! Actualizar
                _student.startInteraction(); 

                if(this.areaZone.body) 
                {
                    // Actualizar escenario 
                    this.scene.secret.setVisible(true); 
                    dialogAppear(this.scene, this.scene.dialogTextObject, dialogos.msg26);
                    let object = this.scene.objectsArray.find((object) => object.objeto.type === 'totem'); 
                    object.setVisible(true); 
                    object.anims.play('totem', true);
                    let object2 = this.searchObjectId('waterfall02'); 
                    object2.setVisible(false); 

                    // Actiualizar jugador
                    _student.studentTochedSpark = true;
                    _student.stopInteraction(); 

                    // Destruir collisión
                    this.scene.sound.play('secret'); 
                    this.destroyInteractable(); 
                } 
                break; 

            case 'totem':
                if (_student.interacting || !_student.studentTochedSpark) 
                    return;
    
                // Jugador ha interactuando!! Actualizar
                _student.startInteraction(); 

                if(this.areaZone.body) // Importante esta linea sino peta
                {
                    // Actualizar escenario
                    dialogAppear(this.scene, this.scene.dialogTextObject, dialogos.msg27);
                    this.anims.play('totem_glow', true); 

                    // Actiualizar jugador (win)
                    _student.stopInteraction(); 

                    // Destruir collisión
                    this.scene.sound.play('win'); 
                    this.destroyInteractable(); 
                } 
            break;
        }
    }

    // IMPORTANTE QUE NO SE LLAME DESTROY() PORQUE YA EXISTE UNA FUNCIÓN ASI EN PHASER
    destroyInteractable()
    {
        this.onPlayerExit(); 
        this.areaZone.body.enable = false;
        this.areaZone.destroy(); 
    }

    onPlayerExit()
    {
        this.interacted = false; 
    }
}