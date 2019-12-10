//Código desenvolvido para THREE.js WebGL e modelos 3D collada.
//Base utilizada = https://threejs.org/examples/?q=coll#webgl_loader_collada_skinning

import * as THREE from '../../libs/build/three.module.js';

import Stats from '../../libs/examples/jsm/libs/stats.module.js';

import { ColladaLoader } from '../../libs/examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from '../../libs/examples/jsm/controls/OrbitControls.js';


////////////////////


//import * as THREE from '../build/three.module.js';

//import Stats from './jsm/libs/stats.module.js';

//import { ColladaLoader } from './jsm/loaders/ColladaLoader.js';
//import { OrbitControls } from './jsm/controls/OrbitControls.js';


var container, stats, controls;
var camera, scene, renderer, avatar;

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

function init() {

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
	camera.position.set( 15, 10, - 15 );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	//scene.background = new THREE.TextureLoader().load( "../../libs/examples/models/collada/uffs.png" );
	scene.fog = new THREE.Fog( 0xffffff, 1000, 4000 );

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
	
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

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
	if (crash == 1) avatar.rotateZ(5);
	crash = 0;
	

	camera.position.set( 15, 10, - 15 );
	pos_value = 0;
}
