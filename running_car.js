//Código desenvolvido para THREE.js WebGL e modelos 3D collada.
//Base utilizada = https://threejs.org/examples/?q=coll#webgl_loader_collada_skinning

import * as THREE from '../build/three.module.js';
import Stats from './jsm/libs/stats.module.js';
import { ColladaLoader } from './jsm/loaders/ColladaLoader.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

var container, stats, clock, controls;
var camera, scene, renderer, mixer, avatar;

var ground;
			
//Controle movimentos carro
			
var limite = 0.8;
var translado = 0.0;

init();
animate();

document.addEventListener("keydown", teclado);

function init() {

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
	//camera.position.set( 0, 150, 1300 );
				

	//camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 15, 10, - 15 );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	scene.fog = new THREE.Fog( 0xffffff, 1000, 4000 );

	clock = new THREE.Clock();

	var gt = new THREE.TextureLoader().load( "./models/collada/pista_3.png" );
	var gg = new THREE.PlaneBufferGeometry( 16000, 16000 );
	var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

	ground = new THREE.Mesh( gg, gm );
	ground.rotation.x = - Math.PI / 2;
	ground.rotateZ(33.75);
	ground.translateX(52);
	ground.material.map.repeat.set( 140, 150 );
	ground.material.map.wrapS = THREE.RepeatWrapping;
	ground.material.map.wrapT = THREE.RepeatWrapping;
	
	// note that because the ground does not cast a shadow, .castShadow is left false
	ground.receiveShadow = true;
	scene.add( ground );
	// collada

	var loader = new ColladaLoader();
	loader.load( './models/collada/mazda_2/mazda.dae', function ( collada ) {

		var escala = new THREE.Vector3( 2, 2, 2 );
		var animations = collada;//.animations;
		//var avatar = collada.scene;
		avatar = collada.scene;
		avatar.rotateZ(-0.8);

		avatar.traverse( function ( node ) {

			if ( node.isSkinnedMesh ) {

				node.frustumCulled = false;

			}

		} );
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

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	var delta = clock.getDelta();

	/*if ( mixer !== undefined ) {

		mixer.update( 0.5* (delta) );

	}*/
	ground.translateY(-0.3);
	//avatar.translateY(-0.8);
	//camera.translateY(0.05);
	//camera.translateZ(-0.05);
	//camera.translateX(0.1);
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

	//console.log(tecla);
	}

function carMoveRight(){

	ground.rotateZ(0.1);
	//avatar.rotateZ(-0.001);
	//ground.translateX(-0.3);

	//camera.translateX(0.3);
	//camera.translateZ(0.2);
	//camera.rotateY(-0.01);
	//camera.rotateZ(-0.01);
}

function carMoveLeft()
			{
	ground.rotateZ(-0.1);
	//avatar.rotateZ(0.01);
	//ground.translateX(0.3);

	//camera.translateX(-0.3);
	//camera.rotateY(0.01);
				
	//camera.rotateZ(0.02);
	//camera.rotateY(0.003);
}

function carMoveFront(){

	console.log(avatar);
	//ground.translateY(0.01);
	//ground.translateX(0.01);
	//avatar.translateX(-0.01);
	//camera.rotateZ(0.02);
}

function carMoveBack(){

	//camera.rotateZ(0.01);
}