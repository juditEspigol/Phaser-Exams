import { gamePrefs } from "./globals.js";
import { config } from "./main.js";

export default class npcPrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_npc)
    { 
        // OBLIGATORIO PARA CREAR COLLISIONES EN LA ESCENA
        super(_scene,_npc.posX,_npc.posY,_npc.id);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        // Seteamos caja de collisión
        this.body.setSize(16,16).setOffset(40,22).setImmovable();

        // ATTRIBUTOS
        this.npc = _npc;
        this.scene = _scene; 

        // ZONA INTERACTUBLE --> NO CAMBIAR EL NOMBRE 'areaZone'
        this.areaZone = this.scene.add.zone(_npc.posX,_npc.posY-2).setSize(24,24);
        _scene.physics.world.enable(this.areaZone); // Añadimos la zona a la escena
        this.areaZone.body.setImmovable();
        this.areaZone.body.debugBodyColor = 0xffffff;   

        // ATTRIBUTOS OBLIGATORIOS EN LOS INTERACTUABLES
        this.isPlayerInsideZone = false; 
        this.interacted = false; 
        this.interactiveIcon = this.scene.add.sprite(10,10,'UI', 2).setPosition(this.x,this.y - 15).setVisible(false);
        
        // ANIMACIONES
        this.loadAnimations();
        this.anims.play(_npc.id,true);

        // COLLISIONES
        this.setColliders();  
        
    }

    loadAnimations()
   {
        this.anims.create(
        {
            key: 'npc1',
            frames:this.anims.generateFrameNumbers('npc', {start:0, end:8}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'npc2',
            frames:this.anims.generateFrameNumbers('npc', {start:9, end:17}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'npc3',
            frames:this.anims.generateFrameNumbers('npc', {start:18, end:26}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'npc4',
            frames:this.anims.generateFrameNumbers('npc', {start:27, end:35}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'npc5',
            frames:this.anims.generateFrameNumbers('npc', {start:36, end:44}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'npc6',
            frames:this.anims.generateFrameNumbers('npc', {start:45, end:53}),
            frameRate: 10,
            repeat: -1
        });
    }

    setColliders()
    {
        // Collisión con el player
        this.scene.physics.add.collider
        (
            this.scene.student,
            this
        );

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
        // MOSTRAR DIALOGO
        this.scene.ui.dialogAppear(this.npc.dialog); 
    }

    onPlayerExit() 
    {
        // COSAS OBLIGATORIAS
        this.interacted = false; 
        this.interactiveIcon.setVisible(false);

        // Hacer que el dialogo desaparezca en 0.5 segundos
        this.scene.ui.dialogDisappear(0.5);
    }  
}