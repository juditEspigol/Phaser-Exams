import { gamePrefs } from "./globals.js";

export default class studentPrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_posX,_posY,_spriteTag='student')
    { 
        // OBLIGATORIO PARA CREAR COLLISIONES EN LA ESCENA
        super(_scene,_posX,_posY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);
        
        // Seteamos caja de colisión
        this.body.setSize(10,16).setOffset(44,22);
        this.interacting = false;

        // ATTRIBUTOS
        this.farm = 0;
        this.money = 0;
        this.wood = 0;
        this.tools = false;
        this.water = false;
        
        // SETEAMOS INPUTS DEL PLAYER
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // ANIAMCIONES
        this.loadAnimations();
        this.anims.play('idle',true);
        
        // COLLISIONES
        this.setColliders(); 
    }

   loadAnimations()
   {
        this.anims.create(
        {
            key: 'idle',
            frames:this.anims.generateFrameNumbers('student', {start:0, end:8}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'walking',
            frames:this.anims.generateFrameNumbers('student', {start:23, end:30}),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create(
        {
            key: 'run',
            frames:this.anims.generateFrameNumbers('student', {start:46, end:53}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'dig',
            frames:this.anims.generateFrameNumbers('student', {start:69, end:81}),
            frameRate: 10,
            repeat: 2
        });

        this.anims.create(
        {
            key: 'axe',
            frames:this.anims.generateFrameNumbers('student', {start:92, end:101}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create(
        {
            key: 'mining',
            frames:this.anims.generateFrameNumbers('student', {start:115, end:124}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create(
        {
            key: 'watering',
            frames:this.anims.generateFrameNumbers('student', {start:138, end:142}),
            frameRate: 10,
            repeat: 2
        });

        this.anims.create(
        {
            key: 'hammering',
            frames:this.anims.generateFrameNumbers('student', {start:161, end: 183}),
            frameRate: 10,
            repeat: 0
        });
    }

    setColliders()
    {   
        // OBLIGTARIO: Collisiones del mapa
        this.collideWithMap = this.scene.physics.add.collider(this, this.scene.collisions_state0);
    }

    // Función que se llama en el update de la escena para todos los objetos interactuables
    checkIfPlayerHasLeftZone(_object, _zone) 
    {
        if (_object.isPlayerInsideZone) 
        {
            const playerBounds = this.body; // Obtiene los límites del jugador
            const zoneBounds = _zone.getBounds(); // Obtiene los límites de la zona

            // Comprobar si el jugador está completamente fuera de la zona
            if ( playerBounds.right < zoneBounds.left || playerBounds.left > zoneBounds.right ||
                playerBounds.bottom < zoneBounds.top || playerBounds.top > zoneBounds.bottom ) 
            {
                _object.isPlayerInsideZone = false;
                _object.onPlayerExit();
            }
        }
    }

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta); 

        // OBLIGATORIO: MOVIMIENTO (Si esta interactuando no puede moverse)
        if(!this.interacting) 
        {
            this.basicMovement();       
        }
    }

    // OBLIGATORIO: Movimiento básico
    basicMovement()
    { 
        if(this.cursors.left.isDown)
        {
            this.body.setVelocity(-gamePrefs.STUDENT_SPEED,0);
            this.setFlipX(true);
            this.anims.play('run', true);
        }
        else if(this.cursors.right.isDown)
        {
            this.body.setVelocity(gamePrefs.STUDENT_SPEED, 0);
            this.setFlipX(false);
            this.anims.play('run', true);
        }
        else if(this.cursors.up.isDown)
        {
            this.body.setVelocity(0,-gamePrefs.STUDENT_SPEED);
            this.anims.play('run', true);
        }
        else if(this.cursors.down.isDown)
        {
            this.body.setVelocity(0,gamePrefs.STUDENT_SPEED);
            this.anims.play('run', true);
        }
        else
        {
            this.body.setVelocity(0,0);
            this.anims.play('idle', true);
        }
    }

    getTools()
    {
        this.tools = true;
    }

    getWater()
    {
        this.water = true;
    }
}