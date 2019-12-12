//Código desenvolvido para THREE.js WebGL e modelos 3D collada.
//Base utilizada = https://threejs.org/examples/?q=coll#webgl_loader_collada_skinning

import * as THREE from './libs/build/three.module.js';

import Stats from './libs/examples/jsm/libs/stats.module.js';

import { ColladaLoader } from './libs/examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from './libs/examples/jsm/controls/OrbitControls.js';

var container, stats, controls;
var scene, renderer, avatar;

//Camera
var camera, camera_x = 0, camera_y = 10, camera_z = -18; 

//Imagens
var ground;

//Obstaculo
var pedras;
var tam_obstaculo = 2.5, pos_init_z_obstaculo = 40, pos_init_x_obstaculo = 5;
var crash = 0, pedra_posit = pos_init_x_obstaculo, eixo_z_virtual = 40;
var max_rand_obstaculo = 13.0; // Tamanho base para gerar os números randomicos para o eixo x do obstaculo.
var timeObstaculo = 4000; // Tempo para surgir um novo obstaculo.

//Controle movimentos carro
var pos_value = 0.0; //Posição do eixo x do carro. (mesma função do eixo_z_virtual).
var limite_r = -4.55; //Limite para velocidade plena do lado direito da pista
var limite_l = 5.25; //Limite para velocidade plena do lado esquerdo da pista
var l_crash = 7.0; //Limite para do lado esquerdo da pista
var r_crash = -6.0; //Limite para do lado direito da pista
var speed_max = -0.6;
var speed_normal = 1.2;
var speed_min = 0.3;


init();
animate();
geraObstaculo();

document.addEventListener("keydown", teclado);

function init() {

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
	camera.position.set( camera_x, camera_y, camera_z );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	scene.fog = new THREE.Fog( 0xffffff, 1000, 4000 );

	//Gera a pista.
	var gt_1 = new THREE.TextureLoader().load( "./libs/examples/models/collada/pista_3.png" );
	var gg_1 = new THREE.PlaneBufferGeometry( 400, 160000 );
	var gm_1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt_1 } );
	ground = new THREE.Mesh( gg_1, gm_1 );
	ground = new THREE.Mesh( gg_1, gm_1 );
	ground.rotation.x = - Math.PI / 2;
	ground.material.map.repeat.set( 5, 100 );
	ground.material.map.wrapS = THREE.RepeatWrapping;
	ground.material.map.wrapT = THREE.RepeatWrapping;
	ground.receiveShadow = true;
	scene.add( ground );

	//Gera o primeiro obistaculo.
	var gt_2 = new THREE.TextureLoader().load( "./libs/examples/models/collada/buraco_2.png" );
	var gg_2 = new THREE.PlaneBufferGeometry( 3, 2 );
	var gm_2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt_2 } );
	pedras = new THREE.Mesh( gg_2, gm_2 );
	pedras = new THREE.Mesh( gg_2, gm_2 );
	pedras.position.set(pos_init_x_obstaculo, 0.3, pos_init_z_obstaculo);
	pedras.rotation.x = - Math.PI / 2;
	pedras.material.map.repeat.set( 1, 1 );
	pedras.material.map.wrapS = THREE.RepeatWrapping;
	pedras.material.map.wrapT = THREE.RepeatWrapping;
	pedras.receiveShadow = true;
	scene.add( pedras );
	
	// Carrega modelo 3D do carro no padrão collada
	var loader = new ColladaLoader();
	loader.load( './libs/examples/models/collada/mazda_2/mazda.dae', function ( collada ) {

		avatar = collada.scene;
		avatar.traverse( function ( node ) {
			if ( node.isSkinnedMesh ) {
				node.frustumCulled = false;
			}
		} );
		scene.add( avatar );
	} );

	//Iluminação.
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
	
	//
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	
	//
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

	var teste_colidio = 0;
	
	if ((pedra_posit + tam_obstaculo) >= pos_value && 
	(pedra_posit - tam_obstaculo) <= pos_value && 
	(eixo_z_virtual + tam_obstaculo) >= 0 && 
	(eixo_z_virtual - tam_obstaculo) <= 0 )
	{
		//console.log("colidiu");
		teste_colidio = 1;
	}
	if ((pos_value < r_crash || pos_value > l_crash  || teste_colidio == 1) && crash == 0 ){
		avatar.rotateZ(-5);
		crash = 1;		
	} else if ((pos_value < limite_r || pos_value > limite_l) && crash == 0 ){
		ground.translateY(speed_min);
		pedras.translateY(speed_min);
		eixo_z_virtual = eixo_z_virtual - speed_min;
	} else if ( crash == 0 ){
		ground.translateY(speed_normal);
		pedras.translateY(speed_normal);
		eixo_z_virtual = eixo_z_virtual - speed_normal;
	}
}

function animate() {

	requestAnimationFrame( animate );
	crashControl();
	render();
	stats.update();
}

function geraObstaculo(){

	var loop = setTimeout(function(){ 
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
	}

function carMoveRight(){

	avatar.translateX(-0.15);
	camera.translateX(0.15);
	pos_value -= 0.15;
}

function carMoveLeft(){

	avatar.translateX(0.15);
	camera.translateX(-0.15);
	pos_value += 0.15;
}

function carMoveFront(){
	//console.log(ground);
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
	pedras.position.set(pos_init_x_obstaculo, 0.3, pos_init_z_obstaculo);
	eixo_z_virtual = 40;
	pedra_posit = pos_init_x_obstaculo;

}

function obstaculosRand(max){
	
	var xPos = Math.floor(Math.random() * max + 1);
	
	xPos = xPos - (max / 2.0);
	pedra_posit = xPos;
	
	pedras.position.set(xPos,0.03,pos_init_z_obstaculo);
	eixo_z_virtual = pos_init_z_obstaculo;
}