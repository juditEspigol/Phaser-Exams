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
        this.zone = this.scene.add.zone(_tree.posX,_tree.posY).setSize(32,32);
        this.scene.physics.world.enable(this.zone);
        this.zone.body.setImmovable();
        this.zone.body.debugBodyColor = 0xffffff;
        this.setColliders();
        this.tree = _tree;
        this.tree.areaZone = this.zone;
        this.tree.objeto = this;
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
            this.zone,
            function()
            {
                this.scene.interactiveObject(this.tree);
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

    preUpdate(time,delta)
    {
        super.preUpdate(time, delta);
    }
}