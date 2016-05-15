var createCaption = require('vendors/utils').createCaption;
var title = 'Fluid based on Perlin noise.';
var caption = '';
var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/swap-renderer/app00';
createCaption({title : title, caption: caption, url : url})

var raf     = require('raf');
var glslify = require('glslify');

var id;
var scene, camera, renderer;
var stats;
var SwapRenderer = require('vendors/swapRenderer');
var swapRenderer, swapRenderer2;

import PerlinMat from './materials/perlin/mat';
import AdvectMat from './materials/advect/mat';
import ShowMat   from './materials/show/mat';

var perlinMat, advectMat, showMat;
var mouse = new THREE.Vector2(-9999, -9999);
var prevMouse;
var dis = 0;


var imageURLs = [
    "assets/texture00.jpg",
    "assets/texture01.jpg",
    "assets/texture03.jpg",
    "assets/texture04.jpg",
];
var textures = [];
var loader = new THREE.TextureLoader();
var originBuffer = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, {minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type:THREE.FloatType, stencilBuffer: false});
var mouse;

function init(){

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    swapRenderer = new SwapRenderer({width : window.innerWidth, height : window.innerHeight, renderer : renderer });
    swapRenderer2 = new SwapRenderer({width : window.innerWidth, height : window.innerHeight, renderer : renderer });

    perlinMat = new PerlinMat();
    swapRenderer.swapUpdate(perlinMat);
    swapRenderer.swapUpdate(perlinMat);

    showMat = new ShowMat();
    advectMat = new AdvectMat();

    document.body.appendChild(renderer.domElement);

    var count = 0;
    imageURLs.forEach(function(imageURL, index){
        loader.load(imageURL, function(texture){
            textures.push(texture);
            count++;
            if(imageURLs.length == count) createTexture(texture);
        })
    });
    
}

var basicMat;

function createTexture(texture){


    basicMat = new THREE.MeshBasicMaterial({map : texture });
    swapRenderer2.pass(basicMat, swapRenderer2.front);
    swapRenderer2.pass(basicMat, swapRenderer2.back);
    swapRenderer2.pass(basicMat, originBuffer);

    raf(animate);
};


function animate(){
    dis *= 0.95;

    if(!isMouseDown){
        perlinMat.update(1/60);
        swapRenderer.swapUpdate(perlinMat);

        advectMat.updateMat(1/60, swapRenderer2.target, swapRenderer.target, originBuffer, mouse, dis );
        swapRenderer2.swapUpdate(advectMat);
    }

    showMat.update(swapRenderer2.target);
    swapRenderer2.out(showMat);

    id = raf(animate);
}

init();


window.addEventListener('mousemove', function(event){
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth );
    mouse.y = 1 - ( event.clientY / window.innerHeight );
    if(prevMouse){
        var dx = (mouse.x - prevMouse.x) * window.innerWidth;
        var dy = (mouse.y - prevMouse.y) * window.innerHeight;
        dis += Math.sqrt(dx * dx + dy * dy)/3;
    }

    prevMouse = mouse.clone();
});

var isMouseDown = false;
window.addEventListener("mousedown", function(){
    isMouseDown = true;
    basicMat.map = textures[parseInt(textures.length * Math.random())]

    swapRenderer2.pass(basicMat, swapRenderer2.front);
    swapRenderer2.pass(basicMat, swapRenderer2.back);
    swapRenderer2.pass(basicMat, originBuffer);

});
window.addEventListener("mouseup", function(){
    isMouseDown = false;

});

