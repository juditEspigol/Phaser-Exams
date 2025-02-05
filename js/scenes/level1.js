import studentPrefab from "/js/prefabs/studentPrefab.js"
import  {gamePrefs} from "/js/globals.js"
import objectPrefab from "/js/prefabs/objectPrefab.js";

export default class level1 extends Phaser.Scene
{
    constructor()
    {
        super({key:'level1'});
    }
    
    init()
    {

    }

    preload()
    {
        this.cameras.main.setBackgroundColor('#181425');

        this.load.setPath('assets/maps');
        this.load.tilemapTiledJSON('dungeon_lv1','dungeon_lv1.json'); 
    }

    create()
    {
        // FUNCIONES DE RICHARD!!!!
        this.init(); 
        
        // INPUTS 
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // TILESET
        this.map = this.add.tilemap("dungeon_lv1"); 
        this.map.addTilesetImage('tileset_examen'); 
        // CREATE LAYERS
        this.floor = this.map.createLayer('layer_floor', 'tileset_examen');
        this.floor_details = this.map.createLayer('layer_floor_details', 'tileset_examen'); 
        this.walls = this.map.createLayer('layer_walls', 'tileset_examen');  
        this.secret = this.map.createLayer('layer_secret', 'tileset_examen').setVisible(false);  
        this.props = this.map.createLayer('layer_props', 'tileset_examen');  
        this.collisions = this.map.createLayer('layer_collisions', 'tileset_examen').setVisible(false);  
        // SET COLLIDERS AL TILE
        this.map.setCollisionByExclusion(-1, true, true, 'layer_collisions'); 

        // PLAYER
        this.student = new studentPrefab(this, gamePrefs.levelWidth/2-8,gamePrefs.levelHeight/2); 
        this.physics.add.collider(this.student, this.collisions); 

        // INSERTAMOS OBJETOS DEL TILED
        this.objectsArray = [];
        this.game_objects = this.map.getObjectLayer('layer_objects'); 
        this.game_objects.objects.forEach(function(object)
        {
            var _object =  {
                type: object.type, 
                posX: object.x, 
                posY: object.y, 
                id: object.name
            }; 
            this.objectsArray.push(new objectPrefab(this, _object)); 
        }, this); 

        this.dialogTextObject = this.add.bitmapText(20, 150, 'textFont', ' ', 10).setDepth(99); 
    }

    // OBLIGATORIO: Detectamos si el juador puede interactuar
    interactiveObject(_object)
    {
        _object.isPlayerInsideZone = true;
        _object.onEnter(this.student); 
        if (this.keyE.isDown) 
        {
            // Tecla de interactuar presionada
            if(!_object.interacted)
            {
                _object.interacted = true;
                _object.interact(this.student); 
            }
        }
    }

    update()
    { 
        // OBLIGATORIO: Detectamos si el jugador ha salido de la zona interactuable
        this.objectsArray.forEach((object) => 
        {
            if(object.areaZone.body) 
            {
                this.student.checkIfPlayerHasLeftZone(object, object.areaZone);
            }
        });
    }
}