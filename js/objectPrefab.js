export default class objectPrefab   
{
    constructor(_scene,_zone)
    {
        // NO TIENE COLLSIONES BÁSICAS DE LA ESCENA PORQUE NO ES HIJO DE SPRTIE

        // ATTRIBUTOS
        this.scene = _scene;
        this.zone = _zone;

        // ZONA INTERACTUBLE --> NO CAMBIAR EL NOMBRE 'areaZone'
        this.areaZone = _scene.add.zone(_zone.posX,_zone.posY);
        this.interactiveIcon = this.scene.add.sprite(16,16,'UI', 0).setPosition(this.areaZone.x,this.areaZone.y- 16).setVisible(false).setOrigin(0.5, 0.5); 

            this.initTypeOfObject();  // Switch para cambiar la size de la zona y el interactiveIcon 
            // (Algunos objetos añaden collision, ya que no esta seteada en la layer!!!)
            
        _scene.physics.world.enable(this.areaZone);
        this.areaZone.body.setImmovable();
        this.areaZone.body.debugBodyColor = 0xffffff;

        // ATTRIBUTOS OBLIGATORIOS EN LOS INTERACTUABLES
        this.isPlayerInsideZone = false; 
        this.interacted = false;
        // this.interactiveIcon --> seteado en la linea 13

        // COLLISIONES
        this.setColliders();

    }

    initTypeOfObject()
    {
        switch(this.zone.id)
        {
            case "huerto":
                this.areaZone.setSize(90,72);
                this.interactiveIcon.setFrame(7); 
            break;
            case 'cofre':
                this.areaZone.setSize(32,32);
                this.interactiveIcon.setFrame(0); 

                // El cofre no esta seteado en las layers creamos una collisión!!
                this.chest = this.scene.add.sprite(this.zone.posX, this.zone.posY, 'cofre', 0);
                this.scene.physics.world.enable(this.chest);
                this.scene.physics.add.collider(this.chest, this.scene.student, null, null, this);
                this.chest.body.setImmovable();
            break;
            case "tienda":
                this.areaZone.setSize(80,64);
            break;
            case "granja":
                this.areaZone.setSize(90,90);
                this.interactiveIcon.setFrame(9); 
            break;
            case "monumento":
                this.areaZone.setSize(40,60);
                this.interactiveIcon.setFrame(8); 
            break;
            case "pozo":
                this.areaZone.setSize(40,40);
                this.interactiveIcon.setFrame(6);
            break;
            default: // Tumba
                this.areaZone.setSize(32,32);
                this.interactiveIcon.setFrame(1); 
            break;
        }
    }

    setColliders()
    {   
        // Collision de la zona interactuable con el player
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

    interact(_student)
    {
        switch(this.zone.id)
        {
            case "huerto":
                // Condición para interactuar!!
                if (_student.interacting || !_student.water) 
                {
                    this.scene.ui.dialogAppear('No tienes agua'); 
                    this.scene.ui.dialogDisappear(2); 
                    return;
                }
        
                // Jugador ha interactuando!! Actualizar
                _student.interacting = true; 
                _student.body.setVelocity(0,0);
                // Seteamos animación
                _student.anims.play('watering', true).on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () 
                {
                    if(this.areaZone.body) // Importante esta linea sino peta
                    {
                        // Actualizar escenario (plantas creciendo)
                        for (let x = 0; x < 5; x++) 
                        {
                            for (let y = 0; y < 4; y++) 
                            { 
                                let sprite = this.scene.add.sprite(x * 16 + 56, y * 16 + 260, 'weat', 0);
                                sprite.anims.play('grow', true).on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () 
                                {
                                    _student.farm += 1; 
                                    this.scene.ui.updateText(); 
                                }, this);
                            }
                        }
                        
                        // Actiualizar jugador
                        _student.interacting = false;

                        // Destruir collisión
                        this.destroyInteractable(); 
                    }
                }, this );
            break;
            case "tienda":
                
            break;
            case "granja":
                // Condición para interactuar!!
                if (_student.interacting || _student.farm < 10) 
                {
                    this.scene.ui.dialogAppear('No tienes follage'); 
                    this.scene.ui.dialogDisappear(2); 
                    return;
                }
                
                // Jugador ha interactuando!! Actualizar
                _student.farm -= 10; 
                this.scene.ui.updateText(); 

                if(this.areaZone.body) // Importante esta linea sino peta
                {
                    // Añadir contador
                    this.scene.timer(() => {
                        _student.money++;  // Incrementa el valor de dinero en 1
                        this.scene.ui.updateText();   // Actualiza la UI
                    });

                    // Destruir collisión
                    this.destroyInteractable(); 
                }
            break;
            case "monumento":
                // Condición para interactuar!!
                if (_student.interacting || _student.money < 10) 
                {
                    this.scene.ui.dialogAppear('No tienes dinero'); 
                    this.scene.ui.dialogDisappear(2); 
                    return;
                }

                // Jugador ha interactuando!! Actualizar
                _student.money -= 10; 
                this.scene.ui.updateText(); 

                if(this.areaZone.body)  // Importante esta linea sino peta
                {
                    // Actualizar escenario con visibility (poner texto)
                    this.scene.richards_glory.setVisible(true); 
                    this.scene.ui.dialogAppear('He aprobado oleeeee'); 
                    
                    // Destruir collisión
                    this.destroyInteractable(); 
                }
            break;
            case "pozo":
                // Condición para interactuar!!
                if (_student.interacting || !_student.tools)
                {
                    this.scene.ui.dialogAppear('No tienes herramientas'); 
                    this.scene.ui.dialogDisappear(2);
                    return;
                }
                
                // Jugador ha interactuando!! Actualizar
                _student.interacting = true; 
                _student.body.setVelocity(0,0);
                // Seteamos animación
                _student.anims.play('dig', true).on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () 
                {
                    if(this.areaZone.body) // Importante esta linea sino peta
                    {
                        // Actualizar escenario con visibility
                        this.pozo = this.scene.add.sprite(this.zone.posX, this.zone.posY, 'pozo', 0)
                        this.scene.physics.world.enable(this.pozo);
                        
                        // Actiualizar jugador
                        _student.interacting = false;
                        _student.getWater();

                        // Destruir collisión
                        this.destroyInteractable(); 
                    }
                }, this);
            break;
            case "cofre":
                // Setear cofre abierto
                this.chest.setFrame(1);

                // Jugador ha interactuando!! Actualizar
                _student.getTools();
                this.scene.ui.dialogAppear("Has obtenido Radev Tools");
                this.scene.ui.dialogDisappear(2);

                // Destruir collisión
                this.destroyInteractable()

            break;
            default: // TUMBA

                // Actualizar escenario con visibility
                this.scene.cave_out.setVisible(false); 
                this.scene.radevs_stone.setVisible(false);
                this.scene.cave_in.setVisible(true);

                // Añadir el cofre en la escena (es un object prefab)
                var _cofreZone = 
                {
                    posX: 296,
                    posY: 84,
                    id: 'cofre'
                }
                this.scene.objectsArray.push( new objectPrefab(this.scene, _cofreZone)); 

                // Jugador ha interactuando!! Actualizar
                _student.setPosition(296, 84 + 30)

                // Destruir collisión
                this.destroyInteractable(); 
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
        this.interactiveIcon.setVisible(false);
    }

}