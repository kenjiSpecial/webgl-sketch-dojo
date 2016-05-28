
var raf = require('raf');
var createCaption = require('vendors/caption');
var glslify = require('glslify');

var windowSize = new THREE.Vector2(window.innerWidth, window.innerHeight);

var SwapRenderer = require('vendors/swapRenderer'), swapRenderer;
var velocityRenderer, pressureRenderer;

// var Solver = require('./fluid/solver');
import Solver from "./fluid/solver"
var solver;

var scene, camera, renderer;
var selectorScene;
var object, id;
var stats, wrapper;
var mouse = new THREE.Vector2(-9999, -9999);

var isAnimation = true;
var orthShaderMaterial;
var orthScene, orthCamera, orthPlane;

var loader = new THREE.TextureLoader();
var renderPlane, renderMaterial;
var renderScene, renderCamera;
var clock;
var textureScene;
var outputRenderer;
var randomMesh, texturePlane, textureCamera;

var grid = {
    size : new THREE.Vector2(window.innerWidth/2, window.innerHeight/2),
    scale : 1
};

var time = {
    step : 1
};


var imageURLs = [
    "assets/texture00.jpg",
    "assets/texture01.jpg",
    "assets/texture02.jpg",
    "assets/texture03.jpg",
    "assets/texture04.jpg"
];
var textures = [];
var textureMeshes = [];
var originMeshes = [];
var raycaster, INTERSECTED;

function init(){

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    // renderer.atuoClear = false;
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    solver = new Solver(grid, renderer);

    outputRenderer = new SwapRenderer({
        width : grid.size.width, height : grid.size.height,
        renderer : renderer
    });

    swapRenderer = new SwapRenderer({
        shader : glslify('./shaders/advect.frag'),

        width : window.innerWidth,
        height: window.innerHeight,
        uniforms: {
            "target" : { type: "t", value: null },
            "velocity" : { type: "t", value:  solver.velocity.output},
            // "randomTex" : { type: "t", value: velocityRenderer.target },
            "invresolution" : {type : "v2", value: new THREE.Vector2(1/window.innerWidth, 1/window.innerHeight)},
            "resolution" : {type : "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            "aspectRatio" : {type: "f", value:  window.innerWidth/window.innerHeight },
            "dt" : {type : "f", value: 0.0},
            "rdx" : {type: "f", value: 1.0},
            "uWindow"  : { type: "v2", value: null },
            "uMouse"   : { type: "v2", value: null }

        },
        renderer : renderer
    });

    swapRenderer.uniforms.target.value =  swapRenderer.target;
    swapRenderer.uniforms.uWindow.value  = new THREE.Vector2( window.innerWidth, window.innerHeight );
    swapRenderer.uniforms.uMouse.value   = mouse;


    setComponent();


    raycaster = new THREE.Raycaster();
    var count = 0;
    imageURLs.forEach(function(imageURL, index){
        loader.load(imageURL, function(texture){
            textures.push(texture);
            count++;
            if(imageURLs.length == count) createTexture();
        })
    });
}

function createTexture() {
    var scale = 1 / 10;
    var margin = 10;

    selectorScene = new THREE.Scene();
    textureScene = new THREE.Scene();

    textures.forEach(function (texture, index) {
        var wid = texture.image.width * scale;
        var hig = texture.image.height * scale;
        var plane = new THREE.PlaneGeometry(wid, hig);
        var originPlane = new THREE.PlaneGeometry(texture.image.width, texture.image.height);
        plane.size = {width: wid, height: hig};
        texture.minFilter = THREE.LinearFilter
        var mat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: texture});
        var mesh = new THREE.Mesh(plane, mat);
        var originMesh = new THREE.Mesh(originPlane, mat);

        mesh.objectId = index;


        textureMeshes.push(mesh);
        originMeshes.push(originMesh);

        selectorScene.add(mesh);
        // totalLength += wid + margin;
    })

    // var curPosition = -totalLength / 2;

    var curPosition = window.innerWidth/2 - 30;
    var yPos = -window.innerHeight/2 + 80;
    textureMeshes.forEach(function (mesh) {
        var meshSize = mesh.geometry.size;
        mesh.position.x = -meshSize.width/2 + curPosition;
        mesh.position.y = yPos;
        curPosition -= meshSize.width + 10;
    });


    var selctedMesh = originMeshes[parseInt(originMeshes.length * Math.random())];

    textureScene.add( selctedMesh );

    textureCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );
    // textureCamera.updateProjectionMatrix();
    textureCamera.position.z =  100;
    // textureScene.add( textureCamera );

    // swapRenderer.resetRand( 255 * Math.random());
    renderer.render(textureScene, textureCamera, swapRenderer.target, false);
    renderer.render(textureScene, textureCamera, swapRenderer.output, false);

    textureScene.remove(selectorScene);

    // raf(animate);
    animate();
}

function setComponent(){
    var title = 'Image texture in fluid';
    var caption = '';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/fluid/app00';

    wrapper = createCaption(title, caption, url);
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

    /** --------------------- **/

    renderScene = new THREE.Scene();
    renderCamera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, -10000, 10000 );
    renderCamera.updateProjectionMatrix();

    renderMaterial = new THREE.ShaderMaterial({
        depthTest : false,
        side : THREE.DoubleSide,
        uniforms : {
            // "tDiffuse" : {type: "t", value: swapRenderer.output }
            "tDiffuse" : {type: "t", value: swapRenderer.output }
        },
        vertexShader : glslify('./display/shader.vert'),
        fragmentShader : glslify('./display/shader.frag')
    });

    renderPlane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight),
        renderMaterial
    );

    renderScene.add(renderPlane);

    clock = new THREE.Clock();
    clock.start();

    id = raf(loop);
    //
}

function loop(){
    stats.begin();
    var dt = clock.getDelta();
    // renderer.clear();

    solver.step(mouse);

    // console.log(solver.velocity.output);
    swapRenderer.uniforms.velocity.value = solver.velocity.output;
    swapRenderer.update();
    renderer.render(renderScene, renderCamera);
    swapRenderer.swap();
    swapRenderer.uniforms.target.value = swapRenderer.target;

    swapRenderer.uniforms.dt.value = dt;
    renderMaterial.uniforms.tDiffuse.value = swapRenderer.output;

    renderer.render(selectorScene, renderCamera);

    raycaster.setFromCamera( mouse, renderCamera );
    var intersects = raycaster.intersectObjects( selectorScene.children );
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
    id=raf(loop);
}

function onClick(ev){


    var objectId = INTERSECTED.objectId;
    var selctedMesh = originMeshes[objectId];
    selctedMesh.position.set(window.innerWidth * (Math.random() - 0.5), window.innerHeight * (Math.random() - 0.5), 0);
    textureScene.add(selctedMesh);

    renderer.render(textureScene, textureCamera, swapRenderer.target, false);
    // renderer.render(textureScene, textureCamera, swapRenderer.output, false);

    textureScene.remove(selctedMesh);

    // renderer.render(scene, camera, swapRenderer.target);
};


window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);

        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

window.addEventListener('resize', function(ev){
    renderer.setSize( window.innerWidth, window.innerHeight );
});

window.addEventListener('mousemove', function(event){
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
});


window.addEventListener("resize", function(ev){
    camera.left = window.innerWidth/-2;
    camera.right = window.innerWidth/2;
    camera.top = window.innerHeight/2;
    camera.bottom = -window.innerHeight/2;
    camera.updateProjectionMatrix();


    renderer.setSize( window.innerWidth, window.innerHeight );
})

init();