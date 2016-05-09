
var raf = require('raf');
var createCaption = require('../../dom/caption');

var scene, camera, renderer;
var material, light;
var textures = [];
var textureMeshes = [];
var originMeshes = [];

var imageURLs = [
    "assets/texture00.jpg",
    "assets/texture01.jpg",
    "assets/texture02.jpg",
    "assets/texture03.jpg",
    "assets/texture04.jpg"
];
var totalLength = 0;
var loader = new THREE.TextureLoader();
var object, id;
var stats, wrapper;
var mouse = new THREE.Vector2();
var INTERSECTED, raycaster;

var isAnimation = true;

function init(){
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, -10000, 10000 );
    camera.updateProjectionMatrix();
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    var count = 0;
    imageURLs.forEach(function(imageURL, index){
        loader.load(imageURL, function(texture){
            textures.push(texture);
            count++;
            if(imageURLs.length == count) createTexture();
        })
    });

    setComponent();
}

function createTexture(){
    var scale = 1/8;
    var margin = 20;
    textures.forEach(function(texture, index){
        var wid = texture.image.width * scale;
        var hig = texture.image.height * scale;
        var plane = new THREE.PlaneGeometry( wid, hig);
        var originPlane = new THREE.PlaneGeometry( texture.image.width, texture.image.height );
        plane.size = {width : wid, height : hig};
        texture.minFilter = THREE.LinearFilter
        var mat = new THREE.MeshBasicMaterial({side : THREE.DoubleSide, map : texture});
        var mesh = new THREE.Mesh(plane, mat);
        var objMat=new THREE.MeshBasicMaterial({side : THREE.DoubleSide, map : texture});
        var originMesh = new THREE.Mesh(originPlane, objMat);

        mesh.objectId = index;


        textureMeshes.push(mesh);
        originMeshes.push(originMesh);

        scene.add(mesh);
        totalLength += wid + margin;
    })

    var curPosition = -totalLength/2;

    textureMeshes.forEach(function(mesh){
        var meshSize = mesh.geometry.size;
        mesh.position.x =curPosition + meshSize.width/2;

        curPosition += meshSize.width + margin;
    });

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    raf(animate);
}

function setComponent(){
    var title = 'Interaction';
    var caption = 'Interaction with RayCaster';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/boilerplate/interactive';

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

    renderer.render(scene, camera);

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            document.body.style.cursor = "pointer";
            window.addEventListener("click", onClick);
        }
    } else {
        document.body.style.cursor = "default";
        window.removeEventListener("click", onClick);
        INTERSECTED = null;
    }

    stats.end();

    id = raf(animate);
}


var prevObjectId;
function onClick(ev){
    var objectId = INTERSECTED.objectId;
    if(prevObjectId >= 0 && prevObjectId != objectId){
        scene.remove(originMeshes[prevObjectId]);
    }
    originMeshes[objectId].position.z = -100;
    scene.add(originMeshes[objectId]);
    prevObjectId = objectId;
}

window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener("resize", function(ev){
    camera.left = window.innerWidth/-2;
    camera.right = window.innerWidth/2;
    camera.top = window.innerHeight/2;
    camera.bottom = -window.innerHeight/2;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
});

init()
