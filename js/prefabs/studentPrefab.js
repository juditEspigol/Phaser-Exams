import {gamePrefs} from '/js/globals.js'

export default class studentPrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_posX,_posY,_spriteTag='student_idle')
    { 
        super(_scene,_posX,_posY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        this.setDepth(50); 

        // Seteamos caja de colisión
        this.body.setSize(10,16);

        // ATTRIBUTOS
        this.interacting = false;
        this.torchedInteractions = 0; 
        this.studentTochedSpark = false; 
        
        // SETEAMOS INPUTS DEL PLAYER
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // SETEAMOS ANIMACIONES
        this.loadAnimations(); 
        this.actualDirection = 'down'; 
        this.anims.play('student_idle_down',true);

        // SETEAMOS COLLISIONES
        this.setColliders(); 

        // SETEAMOS LA LINTERNA
        this.lightRadius = 20; 
        this.setLight(); 
    }

    setLight()
    {
        this.darkness = this.scene.add.graphics();
        this.darkness.fillStyle(0x181425, 1); // Color negro
        this.darkness.fillRect(0, 0, gamePrefs.gameWidth, gamePrefs.gameHeight);

        // Crear la máscara de luz
        this.lightMask = this.scene.make.sprite({
            x: 0,
            y: 0,
            key: 'lantern_mask',
            add: false
        });

        // Aplicar la máscara a la capa oscura
        this.darkness.mask = new Phaser.Display.Masks.BitmapMask(this, this.lightMask);
        this.darkness.mask.invertAlpha = true; // Invertir la máscara
        this.darkness.setDepth(98); //yo le meto esto en el creaete al player
    }

    updateLight()
    {
        this.lightMask.x = this.x; 
        this.lightMask.y = this.y; 
    }

    startInteraction()
    {
        this.interacting = true; 
        this.body.setVelocity(0,0);
    }

    stopInteraction()
    {
        this.interacting = false; 
    }

    setColliders()
    {
    }

    loadAnimations()
    {
        this.anims.create
        ({
            key:'student_idle_down',
            frames:this.anims.generateFrameNumbers('student_idle',{start:0,end:7}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'student_idle_right',
            frames:this.anims.generateFrameNumbers('student_idle',{start:8,end:15}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'student_idle_up',
            frames:this.anims.generateFrameNumbers('student_idle',{start:16,end:23}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'student_idle_left',
            frames:this.anims.generateFrameNumbers('student_idle',{start:24,end:31}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'student_run_down',
            frames:this.anims.generateFrameNumbers('student_run',{start:0,end:7}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'student_run_right',
            frames:this.anims.generateFrameNumbers('student_run',{start:8,end:15}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'student_run_up',
            frames:this.anims.generateFrameNumbers('student_run',{start:16,end:23}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'student_run_left',
            frames:this.anims.generateFrameNumbers('student_run',{start:24,end:31}),
            frameRate:10,
            repeat:-1
        });
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

    basicMovement()
    { 
        if(this.cursors.left.isDown)
        {
            this.body.setVelocity(-gamePrefs.STUDENT_SPEED,0);
            this.anims.play('student_run_left', true);
            this.actualDirection = 'left'; 
        }
        else if(this.cursors.right.isDown)
        {
            this.body.setVelocity(gamePrefs.STUDENT_SPEED, 0);
            this.anims.play('student_run_right', true);
            this.actualDirection = 'right'; 
        }
        else if(this.cursors.up.isDown)
        {
            this.body.setVelocity(0,-gamePrefs.STUDENT_SPEED);
            this.anims.play('student_run_up', true);
            this.actualDirection = 'up'; 
        }
        else if(this.cursors.down.isDown)
        {
            this.body.setVelocity(0,gamePrefs.STUDENT_SPEED);
            this.anims.play('student_run_down', true);
            this.actualDirection = 'down'; 
        }
        else
        {
            this.anims.play('student_idle_' + this.actualDirection, true);
            this.body.setVelocity(0,0);
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

        this.updateLight(); 
    }
}