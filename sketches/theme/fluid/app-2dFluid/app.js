
var raf     = require('raf');
var glslify = require('glslify');
// var createCaption = require('../../dom/caption');

var scene, camera, renderer;
var object, id;
var stats, wrapper;
var makeCaption = require('vendors/caption');
var SwapRendererTarget = require('vendors/swapRendererTarget');
var swapRendererTarget;
var mesh;
var utils = require('vendors/three-js-utils/utils');
var textureColorMaterial = utils.createRedBlueMaterial(100, 100, window.innerWidth, window.innerHeight);

var isAnimation = true;

import SourceMat from "./materials/source/mat";
import ShowMat from "./materials/show/mat";
import ForceMat from "./materials/force/mat";
import AdvectMat from "./materials/advect/mat";
import PressureMat from "./materials/pressure/mat";
import DivMat from "./materials/div/mat";

var showMat, sourceMat, forceMat, advectMat, pressureMat, divMat;
var texture, texture2;
var plane, planeMesh, camera;

function getTexture( width, height, sizeW, sizeH, margin, value, type ){
    var size = width * height;
    var data = new Float32Array(size * 4);

    var num;
    var startX1, endX1, startY1, endY1;
    var startX2, endX2, startY2, endY2;

    if(type == "vertical"){
        startY1 = height/2 - margin - sizeH;
        endY1   = height/2 - margin;
        startY2 = height/2 + margin;
        endY2   = height/2 + margin + sizeH;
        startX1 = startX2 = width/2 - sizeW/2;
        endX1 = endX2 = width/2 + sizeW/2;
    }else{
        startX1 = width/2 - margin - sizeW;
        endX1   = width/2 - margin;
        startX2 =  width/2 + margin;
        endX2   = width/2 + margin + sizeW;
        startY1 = startY2 = height/2 - sizeH/2;
        endY1   = endY2 = height/2 + sizeH/2;
    }


    for(var yy = 0; yy < height; yy++){
        for(var xx = 0; xx < width; xx++){
            var T = 0;

            if( startX1 < xx && xx < endX1 && startY1 < yy && yy < endY1) T = value
            else if(startX2 < xx && xx < endX2 && startY2 < yy && yy < endY2) T = -value;

            var dataSize = (yy * width + xx) * 4;
            data[dataSize] = 0;
            data[dataSize + 1] = 0;
            data[dataSize + 2] = T;
            data[dataSize + 3] = 1;
        }
    }


    var randomTexture = new THREE.DataTexture(
        data,
        width,
        height,
        THREE.RGBAFormat,
        THREE.FloatType
    );

    randomTexture.minFilter =  THREE.NearestFilter,
        randomTexture.magFilter = THREE.NearestFilter,
        randomTexture.needsUpdate = true

    return randomTexture;
}

function init(){
    scene = new THREE.Scene();
    var size = 1;
    camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 );
    camera.updateProjectionMatrix();
    var plane = new THREE.PlaneGeometry(1, 1);
    mesh = new THREE.Mesh(plane);
    scene.add(mesh);

    texture = getTexture(window.innerWidth, window.innerHeight, 200, 100, 80, 0.01, "vertical");
    texture2 = getTexture(window.innerWidth, window.innerHeight, 100, 100, 60, 1, "ho");
    var mat = new THREE.MeshBasicMaterial({map : texture2});

    mesh.material = mat;
    
    swapRendererTarget = new SwapRendererTarget({ width: window.innerWidth, height: window.innerHeight });

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);


    renderer.render(scene, camera, swapRendererTarget.read, false);
    // renderer.render(scene, camera, swapRendererTarget.output, false);

    sourceMat = new SourceMat();
    showMat   = new ShowMat();
    forceMat  = new ForceMat();
    advectMat = new AdvectMat();
    pressureMat = new PressureMat();
    divMat = new DivMat();

    document.body.appendChild(renderer.domElement);

    setComponent();

    raf(animate);
}

function setComponent(){
    var title = 'Boilerplate: Shader';
    var caption = 'Boilerplate Three.js shader app';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/boilerplate/shader';

    makeCaption(title, caption, url);

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


    mesh.material = sourceMat;
    sourceMat.uniforms.samp.value = swapRendererTarget.read;
    sourceMat.uniforms.samp2.value = texture;

    renderer.render(scene, camera, swapRendererTarget.output, false);
    var output = swapRendererTarget.output;
    swapRendererTarget.swap();

    mesh.material = forceMat;
    forceMat.uniforms.uTexture.value = swapRendererTarget.read;
    renderer.render(scene, camera, swapRendererTarget.output, false);
    swapRendererTarget.swap();


    mesh.material = advectMat;
    advectMat.uniforms.uTexture.value = swapRendererTarget.read;
    renderer.render(scene, camera, swapRendererTarget.output, false);
    swapRendererTarget.swap();


    for(var ii = 0; ii < 10; ii++){
        mesh.material = pressureMat;
        pressureMat.uniforms.uTexture.value = swapRendererTarget.read;
        renderer.render(scene, camera, swapRendererTarget.output, false);
        swapRendererTarget.swap();
    }
    
    mesh.material = divMat;
    divMat.uniforms.uTexture.value = swapRendererTarget.read;
    renderer.render(scene, camera, swapRendererTarget.output, false);
    swapRendererTarget.swap();

    mesh.material = showMat;
    showMat.uniforms.samp.value = swapRendererTarget.read;

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

init();