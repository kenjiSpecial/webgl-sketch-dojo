
var raf = require('raf');

var scene, camera, renderer;
var material, light;
var cubes = [];

function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x323232);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    material = new THREE.MeshPhongMaterial({color: 0x3a9ceb});

    var c;
    for(var i = 0; i < 300; i++) {
        c = addCube();
        cubes.push(c);
        scene.add(c);
    }
    c.position.set(0, 0, 50);

    raf(animate);
}

function animate() {

    for(var i = 0; i < cubes.length; i++) {
        cubes[i].rotation.y += 0.01 + ((i - cubes.length) * 0.00001);
        cubes[i].rotation.x += 0.01 + ((i - cubes.length) * 0.00001);
    }

    renderer.render(scene, camera);

    raf(animate);
}

function addCube() {
    var cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), material);
    cube.position.set(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * -500
    );
    cube.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );
    return cube;
}

init()