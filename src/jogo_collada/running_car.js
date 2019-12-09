//Código desenvolvido para THREE.js WebGL e modelos 3D collada.
//Base utilizada = https://threejs.org/examples/?q=coll#webgl_loader_collada_skinning

import * as THREE from '../../libs/build/three.module.js';

import Stats from '../../libs/examples/jsm/libs/stats.module.js';

import { GUI } from '../../libs/examples/jsm/libs/dat.gui.module.js';
import { ColladaLoader } from '../../libs/examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from '../../libs/examples/jsm/controls/OrbitControls.js';


////////////////////


//import * as THREE from '../build/three.module.js';

//import Stats from './jsm/libs/stats.module.js';

//import { ColladaLoader } from './jsm/loaders/ColladaLoader.js';
//import { OrbitControls } from './jsm/controls/OrbitControls.js';


var container, stats, clock, controls;
var camera, scene, renderer, mixer, avatar;

var ground;
			
//Controle movimentos carro
			
//var limite_r =  new THREE.Vector3( -2.0, 0, 0 );
//var limite_l =  new THREE.Vector3( 9.0, 0, 0 );
var pos_value = 0.0;
var limite_r = -2.3;
var limite_l = 5.55;
var l_crash = 9.0;
var r_crash = -6.5;
var speed_max = -0.6;
var speed_normal = -0.8;
var speed_min = -0.3;
var crash = 0;
init();
animate();

document.addEventListener("keydown", teclado);

var gui, playbackConfig = {
    speed: 1.0,
    wireframe: false
};

function init() {

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
	//camera.position.set( 0, 150, 1300 );
				

	//camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 15, 10, - 15 );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x0000 );
	scene.fog = new THREE.Fog( 0xffffff, 1000, 4000 );

	clock = new THREE.Clock();

	var gt = new THREE.TextureLoader().load( "../../libs/examples/models/collada/pista_3.png" );
	var gg = new THREE.PlaneBufferGeometry( 300, 160000 );
	var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

	ground = new THREE.Mesh( gg, gm );
	ground.rotation.x = - Math.PI / 2;
	ground.rotateZ(33.75);
	ground.translateX(-2);
	ground.material.map.repeat.set( 5, 100 );
	ground.material.map.wrapS = THREE.RepeatWrapping;
	ground.material.map.wrapT = THREE.RepeatWrapping;
	
	// note that because the ground does not cast a shadow, .castShadow is left false
	ground.receiveShadow = true;
	scene.add( ground );
	// collada

	var loader = new ColladaLoader();
	loader.load( '../../libs/examples/models/collada/mazda_2/mazda.dae', function ( collada ) {

		avatar = collada.scene;
		avatar.rotateZ(-0.8);

		avatar.traverse( function ( node ) {

			if ( node.isSkinnedMesh ) {

				node.frustumCulled = false;

			}

		} );
		//avatar.multiplyScalar(1.2);
		//avatar.scale = escala;
		scene.add( avatar );

	} );

	var light = new THREE.DirectionalLight( 0xffffff, 2.25 );
	light.position.set( 200, 450, 500 );

	light.castShadow = true;

	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 512;

	light.shadow.camera.near = 100;
	light.shadow.camera.far = 1200;

	light.shadow.camera.left = - 1000;
	light.shadow.camera.right = 1000;
	light.shadow.camera.top = 350;
	light.shadow.camera.bottom = - 350;
	scene.add( light );

	/*var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
	scene.add( ambientLight );

	var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	scene.add( camera );
	camera.add( pointLight );*/

	//

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	//

	/*   // GUI

	   gui = new GUI();

	   gui.add(playbackConfig, 'speed', 0, 2).onChange(function () {
   
		   character.setPlaybackRate(playbackConfig.speed);
   
	   });
   
	   gui.add(playbackConfig, 'wireframe', false).onChange(function () {
   
		   character.setWireframe(playbackConfig.wireframe);
   
	   });

	   var config = {

        baseUrl: "../../libs/examples/models/md2/ratamahatta/",

        body: "ratamahatta.md2",
        skins: [
            "ratamahatta.png", "ctf_b.png", "ctf_r.png", "dead.png", "gearwhore.png", "coiso.png","ogrobase.png",
            "pikachu.png","weapon.jpg","Mat_cuerpo_AO.jpeg",
        ],
        weapons: [
            ["weapon.md2", "weapon.png"],
            ["w_bfg.md2", "w_bfg.png"],
            ["w_blaster.md2", "w_blaster.png"],
            ["w_chaingun.md2", "w_chaingun.png"],
            ["w_glauncher.md2", "w_glauncher.png"],
            ["w_hyperblaster.md2", "w_hyperblaster.png"],
            ["w_machinegun.md2", "w_machinegun.png"],
            ["w_railgun.md2", "w_railgun.png"],
            ["w_rlauncher.md2", "w_rlauncher.png"],
            ["w_shotgun.md2", "w_shotgun.png"],
            ["w_sshotgun.md2", "w_sshotgun.png"]
        ]
	};
	
	character.onLoadComplete = function () {

        setupSkinsGUI(character);
        setupWeaponsGUI(character);
        setupGUIAnimations(character);

        character.setAnimation(character.meshBody.geometry.animations[0].name);

    };*/
   

	controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 2, 0 );
	controls.update();

	/*controls = new OrbitControls( camera, renderer.domElement );
	controls.screenSpacePanning = true;
	controls.minDistance = 2;
	controls.maxDistance = 60;
	controls.target.set( 0, 2, 0 );
	controls.update();*/

	//

	stats = new Stats();
	container.appendChild( stats.dom );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function crashControl(){

	if ((pos_value < r_crash || pos_value > l_crash) && crash == 0 ){
		avatar.rotateZ(-5);
		crash = 1;		
	} else if ((pos_value < limite_r || pos_value > limite_l) && crash == 0 ){
		ground.translateY(speed_min);
	} else if ( crash == 0 ){
		ground.translateY(speed_normal);
	}
}

function speedControl (result){
	result = crashControl();
}

function animate() {

	requestAnimationFrame( animate );
	crashControl();
	render();
	stats.update();

}

function render() {

	renderer.render( scene, camera );

}


function teclado(tecla){

	if (tecla.key == "ArrowRight"){
		carMoveRight();
	}
	if (tecla.key == "ArrowLeft"){
		carMoveLeft();
	}
	if (tecla.key == "ArrowUp"){
		carMoveFront();
	}
	if (tecla.key == "ArrowDown"){
		carMoveBack();
	}
	if (tecla.key == "r")
		carReset();

	//console.log(tecla);
	}

function carMoveRight(){

	avatar.translateX(-0.1);
	camera.translateX(0.1);
	pos_value -= 0.1;
}

function carMoveLeft(){

	avatar.translateX(0.1);
	camera.translateX(-0.1);
	pos_value += 0.1;
}

function carMoveFront(){
	console.log(avatar.position);
	console.log(pos_value);
	
	//ground.translateY(0.01);
	//ground.translateX(0.01);
	//avatar.translateX(-0.01);
	//camera.rotateZ(0.02);
}

function carMoveBack(){

	//camera.rotateZ(0.01);
}

function carReset(){
	avatar.position.set (0, 0, 0);
	crash = 0;
	avatar.rotateZ(5);

	camera.position.set( 15, 10, - 15 );
	pos_value = 0;
}