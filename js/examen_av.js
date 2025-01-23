import { gamePrefs } from "./globals.js";
import npcPrefab from "./npcPrefab.js";
import objectPrefab from "./objectPrefab.js";
import studentPrefab from "./studentPrefab.js";
import treePrefab from "./treePrefab.js";
import uiPrefab from "./uiPrefab.js";

export default class examen_av extends Phaser.Scene
{
    constructor()
    {
        super({key:'examen_av'});
    }

    preload()
    { 
        // Color de fondo
        this.cameras.main.setBackgroundColor("112");

        // Carga assets en memoria
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

        // CREAMOS ARRAY DE OBJETOS INTERACTUABLES
        this.objectsArray = [];

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
        this.richards_glory = this.map.createLayer('richards_glory', 'tileset_sunnysideworld_16px').setDepth(1).setVisible(false);
        this.orchad = this.map.createLayer('orchad', 'tileset_sunnysideworld_16px');
        this.farm = this.map.createLayer('farm', 'tileset_sunnysideworld_16px');
        // 4-- Crear collisiones de las layers
        this.collisions_state0 = this.map.createLayer('collisions_state0', 'tileset_sunnysideworld_16px').setVisible(false);
        this.map.setCollisionByExclusion(-1, true, true, 'collisions_state0'); 

        // PLAYER Y CÁMERA
        this.student = new studentPrefab(this, 200, 290);
        this.cameras.main.startFollow(this.student).setBounds(0,0,gamePrefs.gameWidth,gamePrefs.gameHeight); // camera sigue al player

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
                    this.objectsArray.push(npc);    
                break; 
                case 'tienda':
                    var _tiendaZone = {
                        posX: object.x, 
                        posY: object.y, 
                        id: object.name
                    } 
                    var tienda = new objectPrefab(this, _tiendaZone); 
                    this.objectsArray.push(tienda);                    
                break; 
                case 'huerto':
                    var _huertoZone = {
                        posX: object.x, 
                        posY: object.y, 
                        id: object.name
                    } 
                    var huerto = new objectPrefab(this, _huertoZone); 
                    this.objectsArray.push(huerto);                    
                break; 
                
                case 'granja':
                    var _granjaZone = {
                        posX: object.x, 
                        posY: object.y, 
                        id: object.name
                    } 
                    var granja = new objectPrefab(this, _granjaZone); 
                    this.objectsArray.push(granja);                    
                break; 
                case 'monumento':
                    var _monumentoZone = {
                        posX: object.x, 
                        posY: object.y, 
                        id: object.name
                    } 
                    var monumento = new objectPrefab(this, _monumentoZone); 
                    this.objectsArray.push(monumento);                    
                break; 
                case 'tumba':
                    var _tumbaZone = {
                        posX: object.x, 
                        posY: object.y, 
                        id: object.name
                    } 
                    var tumba = new objectPrefab(this, _tumbaZone); 
                    this.objectsArray.push(tumba);                    
                break; 
                case 'tree':
                    var _tree ={
                        posX: object.x,
                        posY: object.y,
                        id: object.name
                    }
                    var tree = new treePrefab(this, _tree);
                    this.objectsArray.push(tree);    
                break;
                case 'pozo':
                    var _pozoZone = {
                        posX: object.x, 
                        posY: object.y, 
                        id: object.name
                    } 
                    var pozo = new objectPrefab(this, _pozoZone); 
                    this.objectsArray.push(pozo);                    
                break; 
                default: 
                break; 
            }
        }, this); 

        // CREAMOS LA UI LO ULTIMO PARA QUE SE VEA POR ENCIMA
        this.ui = new uiPrefab(this);   
        
        // SETEAMOS ANIMACIONES
        this.loadAnimations(); 
    }

    loadAnimations()
    {
        this.anims.create(
        {
            key: 'grow',
            frames:this.anims.generateFrameNumbers('weat', {start:0, end:4}),
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

    // TIMER DE 1 SEGUNDO
    timer(_callback)
    {
        this.time.addEvent({
            delay: 1000,  // El intervalo en milisegundos (1000 ms = 1 segundo)
            callback: _callback,
            loop: true  // Hace que el evento se repita infinitamente
        });
    }

    // OBLIGATORIO: Detectamos si el juador puede interactuar
    interactiveObject(_object)
    {
        _object.isPlayerInsideZone = true;
        _object.interactiveIcon.setVisible(true);

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
            if(object.areaZone.body) {   
                this.student.checkIfPlayerHasLeftZone(object, object.areaZone);
            }
        });
    }
}