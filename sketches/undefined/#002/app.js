var raf = require('raf');
require('vendors/controls/TrackballControls');
var createCaption = require('vendors/caption');
import CustomMesh from "./mesh";

var scene, camera, renderer;
var meshArr = [];
var customMesh;
var imageURLs = [
    "./assets/instgram/icon-outline.png",
    "./assets/instgram/icon-normal.png",
    "./assets/instgram/icon-play.png",
    "./assets/instgram/icon-pause.png",
];
var mouse = new THREE.Vector2(-9999, -9999);
var textures = {};
var loader = new THREE.TextureLoader();
var meshCount = 0;
var click = 0;
var LENGTH;
var light;
var id;
var stats, wrapper;
var time, controls;

var isAnimation = true;
var raycaster, INTERSECTED;

scene = new THREE.Scene();

(function(){


    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 400;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    setComponent();

    time = new THREE.Clock();
    time.start();



    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 2.2;
    controls.panSpeed = 1;
    controls.dynamicDampingFactor = 0.3;
    var count=0;

    imageURLs.forEach(function(imageURL, index){
        loader.load(imageURL, function(texture){
            // textures.push(texture);
            var imageSrc = texture.image.src;

            if(imageSrc.indexOf("outline") > 0) textures['outline'] = texture;
            else if(imageSrc.indexOf("normal") > 0)textures['normal'] = texture;
            else if(imageSrc.indexOf("play") > 0) textures['play'] = texture;
            else if(imageSrc.indexOf("pause") > 0) textures['pause'] = texture;

            count++;
            if(imageURLs.length == count) createMesh();
        }.bind(this))
    }.bind(this));

    //
})();

function createMesh(){
    customMesh = new CustomMesh(textures);
    scene.add(customMesh);
    meshArr.push(customMesh);

    raycaster = new THREE.Raycaster();

    raf(animate);
}

function setComponent(){
    var title = 'Plane with BufferGeometry';
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

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( meshArr);
    if ( intersects.length == 1 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {
            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            document.body.style.cursor = "pointer";
            INTERSECTED.onOver();
            // meshArr.forEach(function(mesh){
            //     mesh.onOver();
            // });
            window.addEventListener("click", onClick);
        }
    } else {
        if(INTERSECTED) {
            document.body.style.cursor = "default";
            window.removeEventListener("click", onClick);
            INTERSECTED.onOut();
            INTERSECTED = null;
        }
        // meshArr.forEach(function(mesh){
        //     mesh.onOut();
        // });
    }
    
    renderer.render(scene, camera);

    stats.end();

    id = raf(animate);
}

function onClick(ev){
    meshArr.forEach(function(mesh){
        mesh.onClick();
    });
};


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

window.addEventListener('mousemove', function(event){
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
});