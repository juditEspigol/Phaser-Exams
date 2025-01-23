export default class objectPrefab   
{
    constructor(_scene,_zone)
    {
        this.areaZone = _scene.add.zone(_zone.posX,_zone.posY);
        switch(_zone.id)
        {
            case "huerto":
                this.areaZone.setSize(90,72);
            break;
            case "tienda":
                this.areaZone.setSize(80,64);
            break;
            case "granja":
                this.areaZone.setSize(90,90);
            break;
            case "monumento":
                this.areaZone.setSize(40,60);
            break;
            default:
                this.areaZone.setSize(32,32);
            break;
        }
        _scene.physics.world.enable(this.areaZone);
        this.areaZone.body.setImmovable();
        this.areaZone.body.debugBodyColor = 0xffffff;

        // ATTRIBUTOS
        this.scene = _scene;
        this.zone = _zone;
        this.zone.areaZone = this.areaZone;
        // ATTRIBUTOS DE TODOS LOS INTERACTUABLES
        this.isPlayerInsideZone = false; 
        this.interacted = false; 
        this.interactiveIcon = this.scene.add.sprite(10,10,'UI', 4).setPosition(this.areaZone.x,this.areaZone.y - 15).setVisible(false); 

        this.setColliders();
        

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

    interact()
    {
        console.log('interacted with tienda'); 
    }

    Check() 
    {
        this.scene.student.checkIfPlayerHasLeftZone(this, this.zone.areaZone);
    }

    onPlayerExit()
    {
        this.interacted = false; 
        this.interactiveIcon.setVisible(false);        
    }

}