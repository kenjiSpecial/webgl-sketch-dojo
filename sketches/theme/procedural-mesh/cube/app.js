
var raf = require('raf');
var createCaption = require('../../../dom/caption');
import CustomMesh from "./mesh";

var scene, camera, renderer;
var meshArr = [];
var customMesh;
var meshURLArr = [
    "./assets/portraits/portrait00.jpg",
    "./assets/portraits/portrait01.jpg",
    "./assets/portraits/portrait02.jpg",
];
var meshCount = 0;
var click = 0;
var LENGTH;
var light;
var id;
var stats, wrapper;
var time;

var isAnimation = true;

scene = new THREE.Scene();

function init(){


    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);


    setComponent();

    time = new THREE.Clock();
    time.start();

    /**
    window.addEventListener("click", function(){
        var prevCount = click;
        click = (click + 1) % meshArr.length;

        meshArr[prevCount].backToWall();
        meshArr[click].backToInitState();
    });

    setTimeout(function(){meshArr[0].backToInitState()}, 10); */
    customMesh = new CustomMesh();
    scene.add(customMesh);
    meshArr.push(customMesh);

    raf(animate);
}

function setComponent(){
    var title = '';
    var caption = 'Click the window to change the image';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/geometry/animation-geometry';

    wrapper = createCaption(title, caption, url);
    wrapper.style.width = (window.innerWidth/2 - 50) + "px";
    wrapper.style.position = "absolute";
    wrapper.style.top = '50px';
    wrapper.style.left = '30px';

    stats = new Stats();
    stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom  = '30px';
    stats.domElement.style.left = '30px';
    stats.domElement.style.zIndex= 9999;

    document.body.appendChild( stats.domElement );
}

function animate() {
    stats.begin();
    var dt = time.getDelta ();

    meshArr.forEach(function(mesh){
        mesh.updateLoop(dt)
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


/**
var loader = new THREE.TextureLoader();
meshURLArr.forEach(function(url){
     loader.load(url, function(texture){
         texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
         var mesh = new CustomMesh(meshCount, texture);
         //mesh.animate();
         meshArr.push(mesh);
         scene.add(mesh);
         meshCount++;

         if(meshCount == meshURLArr.length) init();
    });
}); */

init();
