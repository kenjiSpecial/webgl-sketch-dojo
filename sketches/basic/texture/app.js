
var raf = require('raf');

var scene, camera, renderer;
var material, light;
var plane;
var width = window.innerWidth;
var height = window.innerHeight;

var loader = new THREE.TextureLoader();

function init(){
    scene = new THREE.Scene();


    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 10;
    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x323232);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);


    loader.load('assets/sample3.jpg', function(texture){
        var geometry = new THREE.PlaneGeometry( width - 20, height -20 );
        var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: texture, transparent : true } );

        plane = new THREE.Mesh( geometry, material );
        scene.add( plane );

    });

    raf(animate);
}

function animate() {
    renderer.render(scene, camera);

    raf(animate);
}

init();