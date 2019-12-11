//Código desenvolvido para THREE.js WebGL e modelos 3D collada.
//Base utilizada = https://threejs.org/examples/?q=coll#webgl_loader_collada_skinning

import * as THREE from '../../libs/build/three.module.js';

import Stats from '../../libs/examples/jsm/libs/stats.module.js';

import { ColladaLoader } from '../../libs/examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from '../../libs/examples/jsm/controls/OrbitControls.js';

var container, stats, controls;
var scene, renderer, avatar;

//Camera
var camera, camera_x = 0, camera_y = 15, camera_z = -20; 

//Imagens
var ground;
var pedras;
			
//Controle movimentos carro
var pos_value = 0.0;
var limite_r = -4.55;
var limite_l = 5.25;
var l_crash = 7.0;
var r_crash = -6.0;
var speed_max = -0.6;
var speed_normal = 0.8;
var speed_min = 0.3;
var crash = 0;
var max_rand_obstaculo = 15.0, timeObstaculo = 4500;

init();
animate();
//obstaculosInit();
geraObstaculo();

document.addEventListener("keydown", teclado);

function init() {

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
	//camera.position.set( 15, 10, - 15 );
	camera.position.set( camera_x, camera_y, camera_z );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	//scene.background = new THREE.TextureLoader().load( "../../libs/examples/models/collada/uffs.png" );
	scene.fog = new THREE.Fog( 0xffffff, 1000, 4000 );

	var gt_1 = new THREE.TextureLoader().load( "../../libs/examples/models/collada/pista_3.png" );
	var gg_1 = new THREE.PlaneBufferGeometry( 400, 160000 );
	var gm_1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt_1 } );

	ground = new THREE.Mesh( gg_1, gm_1 );
	ground = new THREE.Mesh( gg_1, gm_1 );
	ground.rotation.x = - Math.PI / 2;
	ground.material.map.repeat.set( 5, 100 );
	ground.material.map.wrapS = THREE.RepeatWrapping;
	ground.material.map.wrapT = THREE.RepeatWrapping;
	
	// note that because the ground does not cast a shadow, .castShadow is left false
	ground.receiveShadow = true;
	scene.add( ground );

	var gt_2 = new THREE.TextureLoader().load( "../../libs/examples/models/collada/buraco.png" );
	var gg_2 = new THREE.PlaneBufferGeometry( 3, 1 );
	var gm_2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt_2 } );

	pedras = new THREE.Mesh( gg_2, gm_2 );
	pedras = new THREE.Mesh( gg_2, gm_2 );
	pedras.position.set(0,0.3,4);
	pedras.rotation.x = - Math.PI / 2;
	pedras.material.map.repeat.set( 1, 1 );
	pedras.material.map.wrapS = THREE.RepeatWrapping;
	pedras.material.map.wrapT = THREE.RepeatWrapping;
	
	pedras.receiveShadow = false;
	scene.add( pedras );
	
	// collada
	var loader = new ColladaLoader();
	loader.load( '../../libs/examples/models/collada/mazda_2/mazda.dae', function ( collada ) {

		avatar = collada.scene;
		avatar.traverse( function ( node ) {
			if ( node.isSkinnedMesh ) {
				node.frustumCulled = false;
			}
		} );
		scene.add( avatar );
	} );

	var light = new THREE.DirectionalLight( 0xffffff, 2.25 );
	light.position.set( 500, 250, -900 );

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
	
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 2, 0 );
	controls.update();
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
		pedras.translateY(speed_min);
	} else if ( crash == 0 ){
		ground.translateY(speed_normal);
		pedras.translateY(speed_normal);
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

function geraObstaculo(){

	var loop = setInterval(function(){ 
	  geraObstaculo();
	}, timeObstaculo);
	obstaculosRand(max_rand_obstaculo);
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
	//console.log(avatar.position);
	console.log(pedras);
	console.log(ground);

	//setInterval(obstaculosRand(), 1000000);

}

function carMoveBack(){

	//camera.rotateZ(0.01);
}

function carReset(){
	avatar.position.set (0, 0, 0);
	if (crash == 1) avatar.rotateZ(5);
	crash = 0;
	

	camera.position.set( camera_x, camera_y, camera_z );
	pos_value = 0;
}

function obstaculosInit(){

	var gt = new THREE.TextureLoader().load( "../../libs/examples/models/collada/buraco.png" );
	var gg = new THREE.PlaneBufferGeometry( 3, 1 );
	var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

	pedras = new THREE.Mesh( gg, gm );
	pedras = new THREE.Mesh( gg, gm );
	pedras.position.set(0,0.3,2);
	pedras.rotation.x = - Math.PI / 2;
	pedras.material.map.repeat.set( 1, 1 );
	pedras.material.map.wrapS = THREE.RepeatWrapping;
	pedras.material.map.wrapT = THREE.RepeatWrapping;
	
	pedras.receiveShadow = false;
	scene.add( pedras );
}

//setTimeout(obstaculosRand(), 10000);
//setInterval(obstaculosRand(), 10000);

function obstaculosRand(max){
	var xPos = Math.floor(Math.random() * max + 1);
	xPos = xPos - (max / 2.0);
	pedras.position.set(xPos,0.03,40);
}