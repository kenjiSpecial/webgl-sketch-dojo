
var raf = require('raf');
var createCaption = require('../../../dom/caption');

var scene, camera, renderer;
var material, light;
var plane;
var mouse = new THREE.Vector2( 0, 0 );

var loader = new THREE.TextureLoader();

var object, id;

var raycaster = new THREE.Raycaster();

var title = 'Image Gallery with Three.js.';
var caption = '';
var wrapper = createCaption(title, caption, 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/gallery/gallery00');
wrapper.style.position = "absolute";
wrapper.style.top = '30px';
wrapper.style.left = '30px';

var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '20px';
stats.domElement.style.left = '30px';
stats.domElement.style.zIndex= 9999;
document.body.appendChild( stats.domElement );

var canvasWidth = 40;
var canvasHeight = 60;
var canvasNextArrow = document.createElement('canvas');
var canvasPrevArrow = document.createElement('canvas');

var nextTexture;

var totalTime     = 0;
var startTime;

var count = 0;
var nextCount;
var textures = [];

var isAnimation = false;
var ImagePlane0 = require('./imagePlanes/image0');
var ImagePlane1 = require('./imagePlanes/image1');
var ImagePlane2 = require('./imagePlanes/image2');
var imagePlanes = [];

var assets = [
    'assets/sq0.jpg',
    'assets/sq1.jpg',
    'assets/sq2.jpg',
    'assets/sq3.jpg',
    'assets/sq4.jpg',
    'assets/sq5.jpg',
];

function init(){
    scene = new THREE.Scene();
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;

    camera = new THREE.OrthographicCamera( wWidth / - 2, wWidth / 2,  wHeight/ 2, wHeight / - 2, 1, 1000 );
    //camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 100;

    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( wWidth , wHeight);
    renderer.setClearColor( 0x000000 );
    renderer.autoClear = false;

    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    //renderer.domElement.style.left = (window.innerWidth - sWidth)/2 + 'px';
    //renderer.domElement.style.top = (window.innerHeight - sWidth)/2 + 'px';


    assets.forEach(function(asset){
        loader.load(asset, function(texture){
            textures.push(texture);
            if(textures.length == assets.length) loaded();
        });
    });



}

function loaded(){
    var imageSize = 256;

    var plane = new ImagePlane0(textures[count]);
    plane.position.set( -imageSize, imageSize/2, 0 );
    scene.add( plane );
    imagePlanes.push(plane);


    count++;
    var plane = new ImagePlane1(textures[count]);
    plane.position.set( 0, imageSize/2, 0 );
    scene.add( plane );
    imagePlanes.push(plane);

    count++;
    var plane = new ImagePlane2(textures[count]);
    plane.position.set( imageSize, imageSize/2, 0 );
    scene.add( plane );
    imagePlanes.push(plane);


    startTime = +new Date;

    id = raf(animate);
}


function animate() {
    stats.begin();

    totalTime = (+new Date - startTime)/1000;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );

    if(intersects.length > 0)
        imagePlanes.forEach(function(imagePlane){
            imagePlane.update(totalTime, intersects[0]);
        });
    else
        imagePlanes.forEach(function(imagePlane){
            imagePlane.update(totalTime);
        });


    renderer.render(scene, camera);

    stats.end();

    id = raf(animate);
}


window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);


        isAnimation = !isAnimation;
    }
});

function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

window.addEventListener( 'mousemove', onMouseMove, false );
init();