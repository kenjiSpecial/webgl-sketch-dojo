var baseSahder = require('./shader/basic');
import LineMeshGeometry from "./line-mesh-geometry";
var width = window.innerWidth;
var height = window.innerHeight;
var renderer;
var mesh;
var isMouseDown = false;
var raf = require('raf');

var loopId, scene, camera;

var windowPosArr = [
    [494, 806 - 100],
    [365, 405 - 100],
    [525, 629 - 100],
    [586, 183 - 100]
];

var posArr = [];

init();


function init() {
    windowPosArr.forEach(function (pos) {
        posArr.push([
            pos[0] - window.innerWidth / 2,
            -pos[1] + window.innerHeight / 2
        ])

    })
    var mat = new THREE.ShaderMaterial(baseSahder({
        side: THREE.DoubleSide,
        diffuse: 0x0000ff,
        thickness: 3
    }));


    var geo = new LineMeshGeometry(posArr)
    mesh = new THREE.Mesh(geo, mat);

    scene = new THREE.Scene();


    camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, devicePixelRatio: window.devicePixelRatio});
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xaaaaaa);
    document.body.appendChild(renderer.domElement);

    scene.add(mesh);

    loopId = raf(animate);

}


function onMouseDown(ev){
    isMouseDown = true;
    posArr = [];
}

var mouse = new THREE.Vector2(-9999, -9999);

function onMouseMove(ev){
    if (isMouseDown) {
        var dis = mouse.distanceTo(new THREE.Vector2(ev.clientX - window.innerWidth / 2, -ev.clientY + window.innerHeight / 2));

        if(dis > 5){
            mouse = new THREE.Vector2(ev.clientX - window.innerWidth / 2, -ev.clientY + window.innerHeight / 2);
            // var mouse = new THREE.Vector2(ev.clientX - window.innerWidth / 2, 0);
            posArr.push([mouse.x, mouse.y]);

            // createGeometry();
            // actionQuads(mouseArr[mouseArr.length-1]);


            if(posArr.length > 1){
                mesh.geometry.dispose();
                mesh.geometry = new LineMeshGeometry(posArr)
            }

        }
    }
}

function onMouseUp(ev){
    isMouseDown = false;
}

document.body.addEventListener('mousedown', onMouseDown);
document.body.addEventListener('mouseup', onMouseUp);
document.body.addEventListener('mousemove', onMouseMove);


function animate() {
    renderer.render(scene, camera);

    loopId = raf(animate);
}