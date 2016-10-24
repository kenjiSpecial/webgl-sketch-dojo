"use strict";

import {fitImage} from "./utils"

var glslify = require('glslify');
var assets = [
    'assets/texture03.jpg',
    'assets/noise/pnoise.png',
    'assets/noise/pnoise2.png',
    'assets/noise/pnoise3.jpg'
];
var assetCnt = 0;
var textures = {};


var camera, scene, renderer, mouse, stats, geometry, shaderMaterial, mesh, clock;
var shaderMat, gui;
var isLoop;

(()=>{

    assets.forEach((imgSrc) => {
        var image = new Image();
        image.onload = () => {
            textures[imgSrc] = new THREE.Texture(image)
            textures[imgSrc].minFilter = THREE.LinearFilter;
            textures[imgSrc].magFilter = THREE.LinearFilter;
            textures[imgSrc].needsUpdate = true;
            assetCnt++;
            if(assetCnt == assets.length) onLoaded();
        }

        image.src = imgSrc;
    })
})();

function onLoaded(){
    init();
}

function init() {
    camera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 0, 1);
    scene = new THREE.Scene();

    var mainTexture = textures['assets/texture03.jpg'];
    var noise1 = textures['assets/noise/pnoise.png'];
    var noise2 = textures['assets/noise/pnoise2.png'];
    var noise3 = textures['assets/noise/pnoise3.jpg'];
    var sizes = fitImage(window.innerWidth, window.innerHeight, mainTexture.image.width, mainTexture.image.height);

    shaderMat = new THREE.ShaderMaterial({
        uniforms : {
            noise1 : {value : noise1},
            noise2 : {value : noise2},
            noise3 : {value : noise3},
            bgTexture : {value : mainTexture},
            uTime : {value: 0.01},
            uScroll : {value : 0.5},
            uRandom : {value : 0.5},
            uColorDiffuse : {value: 0.4},
            // uFade   : {value : 0.1}
        },
        vertexShader : glslify('./shader.vert'),
        fragmentShader : glslify('./shader.frag'),
        transparent : true

    })

    mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(mainTexture.image.width, mainTexture.image.height), shaderMat);
    var scale = sizes.w / mainTexture.image.width;
    mesh.scale.set(scale, scale, scale);
    scene.add(mesh);

    gui = new GUI();
    gui.add(shaderMat.uniforms.uTime, 'value', 0, 1).name("uTime").step(0.01);
    gui.add(shaderMat.uniforms.uColorDiffuse, 'value', 0, 1.5).name('uColorDiffuse').step(0.1);
    gui.add(shaderMat.uniforms.uScroll, 'value', 0, 1.5).name('uScroll').step(0.1);
    gui.add(shaderMat.uniforms.uRandom, 'value', 0, 3.0).name('uRandom').step(0.1);
    // gui.add(shaderMat.uniforms.uFade, 'value', 0, 1.0).name('uFade').step(0.01);

    renderer = new THREE.WebGLRenderer({transparent : true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    clock = new THREE.Clock();
    document.body.appendChild( stats.domElement );

    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    TweenMax.ticker.addEventListener("tick", loop);
}

function loop() {
    var delta = clock.getDelta();


    renderer.render(scene, camera);
    stats.update()
}


function onDocumentMouseMove(event){
    event.preventDefault();
    if(!mouse) mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener("resize", function(ev){
    camera.updateProjectionMatrix();

    var sizes = fitImage(window.innerWidth, window.innerHeight, mainTexture.image.width, mainTexture.image.height);
    var scale = sizes.w / mainTexture.image.width;
    mesh.scale.set(scale, scale, scale);

    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', function(ev){
    switch(ev.which){
        case 27:
            isLoop = !isLoop;
            if(isLoop) {
                clock.stop();
                TweenMax.ticker.addEventListener("tick", loop);
            }else{
                clock.start();
                TweenMax.ticker.removeEventListener("tick", loop);
            }
            break;
    }
});