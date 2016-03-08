var raf = require('raf');
require('../../../../src/js/vendors/controls/TrackballControls');
var createCaption = require('../../../dom/caption');
import CustomMesh from "./mesh";

var scene, camera, renderer;
var meshArr = [];
var customMesh;

var meshCount = 0;
var click = 0;
var raycaster;
var texture;
var id;
var stats, wrapper;
var time, controls;
var mouse = new THREE.Vector2();

var isAnimation = true;

scene = new THREE.Scene();

function init() {

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 100;
    //camera.position.x = 20;
    //camera.position.y = 20;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var axisHelper = new THREE.AxisHelper(3);
    scene.add(axisHelper);

    setComponent();

    time = new THREE.Clock();
    time.start();

    for(var xx = -1; xx <= 1; xx++){
        for(var zz = -1; zz <= 1; zz++){
            var mesh = new CustomMesh(texture);
            scene.add(mesh);
            mesh.position.x = xx * (mesh.radius+ 0.5) * 2;
            mesh.position.y = zz * (mesh.radius+ 0.5) * 2;
            meshArr.push(mesh);
        }
    }


    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 2.2;
    controls.panSpeed = 1;
    controls.dynamicDampingFactor = 0.3;

    raycaster = new THREE.Raycaster();

    raf(animate);
};

function setComponent() {
    var title = 'Interaction Eyes';
    var caption = 'Custom BufferGeometry + Simple Physics + Interaction with Raycaster';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/procedural-mesh/raycaster-sphere';

    wrapper = createCaption(title, caption, url);
    wrapper.style.width = (window.innerWidth / 2 - 50) + "px";
    wrapper.style.position = "absolute";
    wrapper.style.top = '30px';
    wrapper.style.left = '30px';

    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '30px';
    stats.domElement.style.left = '30px';
    stats.domElement.style.zIndex = 9999;

    document.body.appendChild(stats.domElement);
}

function animate() {
    stats.begin();

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(meshArr, true);

    //console.log(intersects);


    var dt = time.getDelta();

    //customMesh.updateLoop(intersects[0], dt);
    meshArr.forEach(function(mesh){
        mesh.updateLoop(intersects[0], dt);
    });
    renderer.render(scene, camera);

    stats.end();

    id = raf(animate);
}


window.addEventListener('keydown', function (ev) {
    if (ev.keyCode == 27) {
        if (isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', function (event) {
    //event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
});

window.addEventListener('click', function(){
    meshArr.forEach(function(mesh){
        mesh.click();
    });
});

var loader = new THREE.TextureLoader();
loader.load(
    // resource URL
    './assets/eye.jpg',
    // Function when resource is loaded
    function (_tex) {
        texture = _tex;

        init();
    }
);

