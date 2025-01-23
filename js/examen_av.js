import { gamePrefs } from "./globals.js";
import npcPrefab from "./npcPrefab.js";
import objectPrefab from "./objectPrefab.js";
import studentPrefab from "./studentPrefab.js";

export default class examen_av extends Phaser.Scene
{
    constructor()
    {
        super({key:'examen_av'});
    }

    preload()
    { //Carga assets en memoria
        this.cameras.main.setBackgroundColor("112");
        
        this.load.setPath('assets/sprites');
        this.load.image('pozo','spr_pozo.png');
        this.load.image('monumento','spr_richards_glory.png');
        
        this.load.spritesheet('student','spr_student.png',
        {frameWidth:96,frameHeight:64});
        this.load.spritesheet('tree','spr_deco_tree_02_strip4.png',
        {frameWidth:28,frameHeight:43});
        this.load.spritesheet('npc','spr_NPC.png',
        {frameWidth:96,frameHeight:64});
        this.load.spritesheet('UI','spr_UI.png',
        {frameWidth:16,frameHeight:16});
        this.load.spritesheet('counters','spr_counters.png',
        {frameWidth:16,frameHeight:16});
        this.load.spritesheet('cofre','spr_cofre.png',
        {frameWidth:16,frameHeight:22});
        this.load.spritesheet('tienda','spr_shop.png',
        {frameWidth:64,frameHeight:96});
        this.load.spritesheet('weat','spr_weat.png',
        {frameWidth:16,frameHeight:20});
        this.load.spritesheet('cow','spr_deco_cow_strip4.png',
        {frameWidth:32,frameHeight:32});
        this.load.spritesheet('pig','spr_deco_pig_01_strip4.png',
        {frameWidth:32,frameHeight:32});
        this.load.spritesheet('chicken','spr_deco_chicken_01_strip4.png',
        {frameWidth:32,frameHeight:32});

        
        this.load.setPath('assets/tilesets');
        this.load.image('tileset_sunnysideworld_16px','spr_tileset_sunnysideworld_16px.png');
        
        this.load.setPath('assets/sounds');
        
        this.load.setPath('assets/maps');
        this.load.tilemapTiledJSON('examen_av','examen_av.json');

        this.load.setPath('assets/fonts/');
        this.load.bitmapFont('UIFont','gameFont.png','gameFont.xml');
        this.load.bitmapFont('dialogFont','ThaleahFat_16.png','ThaleahFat_16.xml');
        
    }

    create()
    { 
        // INPUTS 
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        // CREAMOS ARRAY
        this.objectGroup = [];
        // TILESET/JSON
        // 1-- Añadimos el tilemap del JSON que hemos cargado previamente
        this.map = this.add.tilemap("examen_av");
        // 2-- Añadimos el tilset(la imagen con los asstets) al mapa 
        this.map.addTilesetImage('tileset_sunnysideworld_16px'); 
        // 3-- Creamos las layers cogiendo los nombres que tienen en el Tiled
        this.water = this.map.createLayer('water', 'tileset_sunnysideworld_16px');
        this.cliff = this.map.createLayer('cliff', 'tileset_sunnysideworld_16px');
        this.land = this.map.createLayer('land', 'tileset_sunnysideworld_16px');
        this.cave_in = this.map.createLayer('cave_in', 'tileset_sunnysideworld_16px').setVisible(false);
        this.cave_out = this.map.createLayer('cave_out', 'tileset_sunnysideworld_16px');
        this.radevs_stone = this.map.createLayer('radevs_stone', 'tileset_sunnysideworld_16px');
        this.radevs_stone_profanate = this.map.createLayer('radevs_stone_profanated', 'tileset_sunnysideworld_16px').setVisible(false);
        this.land_details = this.map.createLayer('land_details', 'tileset_sunnysideworld_16px');
        this.house_lv0 = this.map.createLayer('house_lv0', 'tileset_sunnysideworld_16px');
        this.forest_devastated = this.map.createLayer('forest_devastated', 'tileset_sunnysideworld_16px');
        this.richards_glory = this.map.createLayer('richards_glory', 'tileset_sunnysideworld_16px').setVisible(false);
        this.orchad = this.map.createLayer('orchad', 'tileset_sunnysideworld_16px');
        this.farm = this.map.createLayer('farm', 'tileset_sunnysideworld_16px');
        // Layer de collisiones
        this.collisions_state0 = this.map.createLayer('collisions_state0', 'tileset_sunnysideworld_16px').setVisible(false);
        // 4-- Crear collisiones de las layers
        this.map.setCollisionByExclusion(-1, true, true, 'collisions_state0'); 

        // PLAYER Y CÁMERA
        this.student = new studentPrefab(this, 200, 290);
        this.cameras.main.startFollow(this.student).setBounds(0,0,gamePrefs.gameWidth,gamePrefs.gameHeight);

        // INSERTAMOS OBJECTOS DEL TILED
        this.game_objects = this.map.getObjectLayer('objects'); 
        this.game_objects.objects.forEach(function(object)
        {
            switch(object.type)
            {
                case 'npc':
                    // Información del JSON
                    var _npc = {
                        posX: object.x,
                        posY: object.y,
                        id: object.name,
                        dialog: object.properties[0].value
                    }
                    var npc = new npcPrefab(this, _npc); 

                break; 
                case 'tienda':
                    var _tiendaZone = {
                        posX: object.x, 
                        posY: object.y, 
                        id: object.name
                    } 
                    var tienda = new objectPrefab(this, _tiendaZone); 
                    // INTRODUCIMOS OBJETO EN EL ARRAY
                    this.objectGroup.push(tienda);                    

                break; 
                default: 
                break; 
            }
        }, this); 

        
    }

    loadAnimations()
    {
        this.anims.create(
        {
            key: 'grow',
            frames:this.anims.generateFrameNumbers('weat', {start:0, end:5}),
            frameRate: 1,
            repeat: 0,
            hideOnComplete:true
        });
        this.anims.create(
        {
            key: 'idleCow',
            frames:this.anims.generateFrameNumbers('cow', {start:0, end:3}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create(
        {
            key: 'idlePig',
            frames:this.anims.generateFrameNumbers('pig', {start:0, end:3}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create(
        {
            key: 'idleChicken',
            frames:this.anims.generateFrameNumbers('chicken', {start:0, end:3}),
            frameRate: 10,
            repeat: -1
        });
    }

    interactiveObject(_object)
    {
        _object.isPlayerInsideZone = true;
        _object.interactiveIcon.setVisible(true);

        // En el método `update`, usa `justDown` para detectar solo la primera vez que se presiona
        if (this.keyE.isDown) 
        {
            // Tecla de interactuar presionada
            if(!_object.interacted)
            {
                _object.interacted = true; 
                _object.interact(); 
                // Resetear el interactuar despues de 2 segundos
            }
        }
    }

    update()
    { //Actualiza whatever

        this.objectGroup.forEach((object) => {
           object.Check()
        });
    }
}