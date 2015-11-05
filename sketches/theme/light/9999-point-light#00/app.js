var raf = require('raf');

require('../../../../src/js/vendors/shaders/DotScreenShader');
require('./ray');
//console.log(THREE.GodRay);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(-1000, -1000);

var geometry = new THREE.BoxGeometry( 10, 10, 10 );
var material = new THREE.MeshLambertMaterial({color: 0xcccccc});

var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x555555}));
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = -20;

scene.add(groundMesh);

var debugGeometry = new THREE.BoxGeometry( 12, 12, 12 );
var debugMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
var debugCube     = new THREE.Mesh( debugGeometry, debugMaterial );
scene.add( debugCube );

camera.position.x = 15;
camera.position.z = 15;
camera.position.y = 15;

camera.lookAt(scene.position);

// add subtle ambient lighting
var ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

// add spotlight for the shadows
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-30, 60, 60);
spotLight.castShadow = true;
scene.add(spotLight);

var composer = new THREE.EffectComposer(renderer);
composer.addPass( new THREE.RenderPass( scene, camera ) );

var effect = new THREE.ShaderPass( THREE.GodRay );
//effect.uniforms[ 'scale' ].value = 4;
effect.renderToScreen = true;
composer.addPass( effect );


function render() {

    composer.render();

    raf(render);
}

render();

function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener( 'mousemove', onMouseMove, false );