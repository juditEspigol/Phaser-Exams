export default class treePrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_tree)
    { 
        // OBLIGATORIO PARA CREAR COLLISIONES EN LA ESCENA
        super(_scene,_tree.posX,_tree.posY,_tree.spriteTag).setOrigin(0.5, 0.75);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        // Seteamos caja de collisión
        this.body.setSize(16,16).setOffset(8,24).setImmovable();
        
        // ATTRIBUTOS
        this.scene = _scene;

        // ZONA INTERACTUBLE --> NO CAMBIAR EL NOMBRE 'areaZone'
        this.areaZone = this.scene.add.zone(_tree.posX,_tree.posY).setSize(32,32);
        this.scene.physics.world.enable(this.areaZone);
        this.areaZone.body.setImmovable();
        this.areaZone.body.debugBodyColor = 0xffffff;

        // ATTRIBUTOS OBLIGATORIOS EN LOS INTERACTUABLES
        this.isPlayerInsideZone = false; 
        this.interacted = false; 
        this.interactiveIcon = this.scene.add.sprite(10,10,'UI', 5).setPosition(this.x,this.y - 15).setVisible(false);
        
        // ANIMACIONES
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
            frames:this.anims.generateFrameNumbers('tree', {start:0, end:3}),
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
        // Si el jugador ya esta interactuando o no tiene lo necesario adios interactuar!!
        if (_student.interacting || !_student.tools)
        {
            this.scene.ui.dialogAppear('No tienes herramientas'); 
            this.scene.ui.dialogDisappear(2); 
            return;
        }

        // El estudiante no se mueve y esta interactuando!!
        _student.interacting = true; 
        _student.body.setVelocity(0,0);

        _student.anims.play('axe', true).on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () 
        {
            if(this.areaZone.body) // Importante esta linea sino peta
            {
                // El estudiante deja de interactuar y actualizamos lo que ha cogido
                _student.interacting = false;
                _student.wood += 7;
                this.scene.ui.updateText(); 
                
                // Destruimos el arbol
                this.destroyInteraction(); 
            }
        }, this);
    }

    onPlayerExit() 
    {
        // COSAS OBLIGATORIAS
        this.interacted = false; 
        this.interactiveIcon.setVisible(false);       
    }

    // IMPORTANTE QUE NO SE LLAME DESTROY() PORQUE YA EXISTE UNA FUNCIÓN ASI EN PHASER
    destroyInteraction()
    {
        this.onPlayerExit(); 
        this.areaZone.body.enable = false;
        this.areaZone.destroy(); 
        this.destroy();
    }
}