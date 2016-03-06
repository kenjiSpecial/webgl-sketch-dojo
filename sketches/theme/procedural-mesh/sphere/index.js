var raf = require('raf');
require('../../../../src/js/vendors/controls/TrackballControls');
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
var time, controls;

var isAnimation = true;

scene = new THREE.Scene();

(function(){

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 20;
    camera.position.x = 20;
    camera.position.y = 20;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    var axisHelper = new THREE.AxisHelper( 3 );
    scene.add( axisHelper );

    setComponent();

    time = new THREE.Clock();
    time.start();

    customMesh = new CustomMesh();
    scene.add(customMesh);
    meshArr.push(customMesh);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 2.2;
    controls.panSpeed = 1;
    controls.dynamicDampingFactor = 0.3;


    raf(animate);
})();

function setComponent(){
    var title = 'Cube with BufferGeometry';
    var caption = '';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/procedural-mesh/cube';

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

    controls.update();

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

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
});
