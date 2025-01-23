export default class treePrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_tree)
    { //instanciar el objeto
        super(_scene,_tree.posX,_tree.posY,_tree.spriteTag);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);
        this.loadAnimations();
        this.anims.play('idle',true);
        this.scene = _scene;
        this.body.setSize(16,16).setOffset(8,24).setImmovable();
        this.areaZone = this.scene.add.zone(_tree.posX,_tree.posY).setSize(32,32);
        this.scene.physics.world.enable(this.areaZone);
        this.areaZone.body.setImmovable();
        this.areaZone.body.debugBodyColor = 0xffffff;
        this.setColliders();
        this.tree = _tree;
        this.tree.objeto = this;

        this.isPlayerInsideZone = false; 
        this.interacted = false; 
        this.interactiveIcon = this.scene.add.sprite(10,10,'UI', 5).setPosition(this.x,this.y - 15).setVisible(false);
    }

    setColliders()
    {
        this.scene.physics.add.collider
        (
            this.scene.student,
            this
        );

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

    onPlayerExit() 
    {
        // COSAS OBLIGATORIAS
        this.interacted = false; 
        this.interactiveIcon.setVisible(false);       
    }
    
    interact()
    {

        this.scene.student.cutTree(this);
    }
}