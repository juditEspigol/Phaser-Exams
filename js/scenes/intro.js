import studentPrefab from '/js/prefabs/studentPrefab.js';
import {gamePrefs, dialogos} from '/js/globals.js';
import {typeEffectText} from '/js/globalFunctions.js'; 

export default class intro extends Phaser.Scene
{
    constructor() 
    {
        super({key:'intro'});
    }

    init()
    {//Pintar todo lo que se va a ver en pantalla mientras se cargan los assets
        this.secuencia = 
        [
            {tipo:"dialogo",personaje:'alumno',texto:dialogos.msg01},
            {tipo:"dialogo",personaje:'alumno',texto:dialogos.msg02},

            {tipo:"dialogo",personaje:'alumno',texto:dialogos.msg03},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg04},
            {tipo:"dialogo",personaje:'alumno',texto:dialogos.msg05},
            {tipo:"dialogo",personaje:'alumno',texto:dialogos.msg06},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg07},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg08},
            {tipo:"dialogo",personaje:'alumno',texto:dialogos.msg09},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg10},

            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg11},     
            {tipo:"dialogo",personaje:'alumno',texto:dialogos.msg12},

            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg13},
            {tipo:"accion",accion:'inicio'},

            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg14},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg15},
            {tipo:"dialogo",personaje:'alumno',texto:dialogos.msg16},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg17},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg18},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg19},
            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg20},

            {tipo:"dialogo",personaje:'boss',texto:dialogos.msg21},
            {tipo:"accion",accion:'abrirVerja'}
        ]
    }

    preload()
    {
        this.cameras.main.setBackgroundColor('#181425');

        this.load.setPath('assets/sprites/');
        this.load.spritesheet('student_idle','Blue Asha Idle 32x32.png',
        {frameWidth:32,frameHeight:32});
        this.load.spritesheet('student_run','Blue Asha Run 32x32.png',
        {frameWidth:32,frameHeight:32});
        this.load.spritesheet('verja','Basic Door 2.png',
        {frameWidth:16,frameHeight:16});
        this.load.spritesheet('barrel','Barrel down sheet 1.png',
        {frameWidth:16,frameHeight:32});    
        this.load.spritesheet('waterfall','Short waterfall sheet 1.png',
        {frameWidth:16,frameHeight:32});
        this.load.spritesheet('spark','Sparks.png',
        {frameWidth:16,frameHeight:16});
        this.load.spritesheet('torch','Torch Blue.png',
        {frameWidth:16,frameHeight:16});
        this.load.spritesheet('wall_torch','Wall Blue Torch.png',
        {frameWidth:16,frameHeight:16});
        this.load.spritesheet('razor','razor.png',
        {frameWidth:48,frameHeight:16});
        this.load.spritesheet('totem','Set 1.7 pillars.png',
        {frameWidth:16,frameHeight:32});
        
        this.load.image('lantern_mask','lantern.png');
        
        this.load.setPath('assets/tilesets');
        this.load.image('tileset_examen','tileset_examen.png');

        this.load.setPath('assets/sounds/');
        this.load.audio('openDoor', 'LTTP_Chest_Open.mp3');
        this.load.audio('torch', 'LTTP_heart piece 1.wav');
        this.load.audio('damage', 'LTTP_Link_Dying.wav');
        this.load.audio('secret', 'LTTP_Secret.wav');
        this.load.audio('win', 'LTTP_ItemFanfare.wav');         
        
        this.load.setPath('assets/maps');
        this.load.tilemapTiledJSON('inicio','inicio.json');
    }

    loadAnimations()
    {
        this.anims.create
        ({
            key:'verja_open',
            frames:this.anims.generateFrameNumbers('verja',{start:0,end:7}),
            frameRate:10,
            repeat:0
        });

        this.anims.create
        ({
            key:'wall_torch',
            frames:this.anims.generateFrameNumbers('wall_torch',{start:0,end:15}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'torch',
            frames:this.anims.generateFrameNumbers('torch',{start:0,end:7}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'spark',
            frames:this.anims.generateFrameNumbers('spark',{start:0,end:4}),
            frameRate:10,
            delay:3000,
            repeat:-1
        });

        this.anims.create
        ({
            key:'waterfall',
            frames:this.anims.generateFrameNumbers('waterfall',{start:0,end:15}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'barrel',
            frames:this.anims.generateFrameNumbers('barrel',{start:0,end:7}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create
        ({
            key:'totem',
            frames:this.anims.generateFrameNumbers('totem',{start:16,end:31}),
            frameRate:5,
            repeat:0
        });

        this.anims.create
        ({
            key:'totem_glow',
            frames:this.anims.generateFrameNumbers('totem',{start:24,end:31}),
            frameRate:5,
            yoyo:true,
            repeat:-1
        });

        this.anims.create
        ({
            key:'razor',
            frames:
            [
                { key: 'razor', frame: 1 },
                { key: 'razor', frame: 2 },                
                { key: 'razor', frame: 3 },                
                { key: 'razor', frame: 3 },                
                { key: 'razor', frame: 3 },                
                { key: 'razor', frame: 3 },                
                { key: 'razor', frame: 3 },                
                { key: 'razor', frame: 3 },                
                { key: 'razor', frame: 3 },                
                { key: 'razor', frame: 2 },
                { key: 'razor', frame: 1 }
            ],
            frameRate:20,
            yoyo:true,
            repeat:-1
        });
    }

    create()
    {
        // SETEAMOS INPUTS DEL PLAYER
        this.cursors = this.input.keyboard.createCursorKeys();

        // FUNCIONES DE RICHARD!!!
        this.init(); // Inicializar sequenceia 
        this.loadAnimations(); 

        // EMPEZAR EL DIÁLOGO
        this.dialogTextObject = this.add.bitmapText(20, 150, 'textFont', '', 10).setDepth(99); 
        this.speed = 100;  // Velocidad de escritura en milisegundos entre cada letra
        typeEffectText(this, this.dialogTextObject, this.secuencia, this.speed);
    }

    abrirVerja()
    {
        // ACTUALIZAR PARAMETROS DE LA VERJA
        this.sound.play('openDoor'); 
        this.verja.anims.play('verja_open',true).on('animationcomplete',function (){
            
            this.verja.body.enable = false;
        }, this);

        this.physics.add.overlap(this.student, this.scapeZone,
            function()
            {
                this.scene.start('name');
            },
            null, this
        ); 
    }

    inicio()
    {
        // TILESET
        this.map = this.add.tilemap("inicio"); 
        this.map.addTilesetImage('tileset_examen'); 
        // PINTAMOS CAPAS
        this.floor = this.map.createLayer('layer_floor', 'tileset_examen');  
        this.walls = this.map.createLayer('layer_walls', 'tileset_examen'); 
        this.overlap = this.map.createLayer('layer_overlap', 'tileset_examen').setDepth(60);
        // CAPAS CON COLLISIONES
        this.map.setCollisionByExclusion(-1, true, true, 'layer_walls'); 
        this.map.setCollisionByExclusion(-1, true, true, 'layer_overlap'); 

        // CREAMOS VERJA
        this.verja = this.add.sprite(152,55 ,'verja'); 
        this.physics.world.enable(this.verja); //!!!!!!!!
        this.verja.body.immovable = true; 
        // CREAMOS ZONA DE ESCAPE
        this.scapeZone = this.add.zone(152,35,16,8); 
        this.physics.world.enable(this.scapeZone);
        
        // CREAMOS STUDENT
        this.student = new studentPrefab(this, gamePrefs.levelWidth/2-8,gamePrefs.levelHeight/2); 
        // CREAMOS LAS COLLISIONES DEL STUDENT
        this.physics.add.collider(this.student, this.walls); 
        this.physics.add.collider(this.student, this.verja);
    }

    handleAction(_action, _currentIndex) 
    {
        // Dependiendo del tipo de acción, llama a la función correspondiente
        switch (_action) 
        {
            case 'inicio':
                this.inicio(); 
                break;
            case 'abrirVerja':
                this.abrirVerja();
                break;
            default:
                console.log('Acción desconocida: ' + _action);
                break; 
        }
    }
}