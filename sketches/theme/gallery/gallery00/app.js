
var raf = require('raf');
var createCaption = require('../../../dom/caption');


//require('../../../src/js/vendors/shaders/CopyShader')

var scene, camera, renderer;
var material, light;
var plane;

var loader = new THREE.TextureLoader();
var imageShader = require('./imageShader/app');
var object, id;

var isAnimation = true;

var title = 'Image Gallery with Three.js.';
var caption = '';
var wrapper = createCaption(title, caption, 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/post-processing/ofx-water');
wrapper.style.position = "absolute";
wrapper.style.top = '30px';
wrapper.style.left = '30px';

var stats = new Stats();
stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '20px';
stats.domElement.style.left = '30px';
stats.domElement.style.zIndex= 9999;
document.body.appendChild( stats.domElement );

var canvasWidth = 40;
var canvasHeight = 60;
var canvasNextArrow = document.createElement('canvas');
var canvasPrevArrow = document.createElement('canvas');

var nextTexture;

var totalTime     = 0;
var startTime;

var count = 0;
var nextCount;
var textures = [];

var sWidth = 512;
var sHeight = 512;
var material;
var isAnimation = false;

var assets = [
    'assets/sq0.jpg',
    'assets/sq1.jpg',
    'assets/sq2.jpg',
    'assets/sq3.jpg'
];

function init(){
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( sWidth / - 2, sWidth / 2, sHeight / 2, sHeight / - 2, 1, 1000 );
    camera.position.z = 10;

    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(sWidth , sHeight);
    renderer.setClearColor( 0x000000 );
    renderer.autoClear = false;

    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.left = (window.innerWidth - sWidth)/2 + 'px';
    renderer.domElement.style.top = (window.innerHeight - sWidth)/2 + 'px';


    assets.forEach(function(asset){
        loader.load(asset, function(texture){
            textures.push(texture);
            if(textures.length == assets.length) loaded();
        });
    });



}

function loaded(){
    var imgWidth = 512; //texture.image.width/2;
    var imgHeight = 512; //texture.image.height/2;

    var geometry = new THREE.PlaneGeometry( imgWidth, imgHeight );
    material = new THREE.ShaderMaterial( imageShader );
    material.uniforms.tMain.value = textures[count];
    material.uniforms.tNext.value = textures[count + 1];
    plane = new THREE.Mesh( geometry, material );
    scene.add( plane );
    setArrow();

    startTime = +new Date;

    id = raf(animate);
    //translateLoop()
}

function setArrow(){
    document.body.appendChild(canvasNextArrow);
    canvasNextArrow.width = canvasWidth;// + "px";
    canvasNextArrow.height = canvasHeight;// + "px";
    var ctxNextArrow = canvasNextArrow.getContext('2d');
    ctxNextArrow.fillStyle = "#000";
    ctxNextArrow.strokeStyle = "#999";
    ctxNextArrow.lineWidth = 5;
    ctxNextArrow.moveTo(8, 8);
    ctxNextArrow.lineTo(canvasWidth - 8, canvasHeight/2);
    ctxNextArrow.lineTo(8, canvasHeight - 8);
    ctxNextArrow.stroke();
    canvasNextArrow.style.position = "absolute";
    canvasNextArrow.style.cursor = "pointer";
    canvasNextArrow.addEventListener('click', onClickNext);

    document.body.appendChild(canvasPrevArrow);
    canvasPrevArrow.width = canvasWidth;// + "px";
    canvasPrevArrow.height = canvasHeight;// + "px";
    var ctxPrevArrow = canvasPrevArrow.getContext('2d');
    ctxPrevArrow.fillStyle = "#000";
    ctxPrevArrow.strokeStyle = "#999";
    ctxPrevArrow.lineWidth = 5;
    ctxPrevArrow.moveTo( canvasWidth - 8, 8);
    ctxPrevArrow.lineTo( 8, canvasHeight/2);
    ctxPrevArrow.lineTo( canvasWidth - 8, canvasHeight - 8);
    ctxPrevArrow.stroke();
    canvasPrevArrow.style.position = "absolute";
    canvasPrevArrow.style.cursor = "pointer";
    canvasPrevArrow.addEventListener('click', onClickPrev);


    resizeArrow();

}

function onClickNext(){
    if(isAnimation) return;
    isAnimation = true;


    nextCount = (count + 1) % textures.length;

    material.uniforms.tNext.value = textures[nextCount];
    TweenLite.fromTo(material.uniforms.uRate, 1.2, {value: 0.0}, {value: 1.0, onComplete: onClickPrevComplete})
    material.uniforms.uNext.value = 0.6;
}

function onClickPrev(){
    if(isAnimation) return;
    isAnimation = true;


    nextCount = (count - 1) % textures.length;
    if(nextCount < 0) nextCount = textures.length - 1;


    material.uniforms.tNext.value = textures[nextCount];

    TweenLite.fromTo(material.uniforms.uRate, 1.2, {value: 0.0}, {value: 1.0, onComplete: onClickPrevComplete})
    material.uniforms.uNext.value = 1.0;
}

function onClickPrevComplete(){
    isAnimation = false;
    count = nextCount;
    material.uniforms.tMain.value = textures[count];
    material.uniforms.uNext.value = 0.0;
}


function resizeArrow(){
    canvasNextArrow.style.top = (window.innerHeight/2 - canvasHeight/2) + "px";
    canvasNextArrow.style.left = (window.innerWidth/2 + 280) + "px";

    canvasPrevArrow.style.top = (window.innerHeight/2 - canvasHeight/2) + "px";
    canvasPrevArrow.style.left = (window.innerWidth/2 - 280 - canvasPrevArrow.width) + "px";
}

function animate() {
    stats.begin();

    totalTime = (+new Date - startTime)/1000;

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

function onScroll(){
    material.uniforms.uNext.value = 1.0;

    nextCount = (count + 1) % textures.length;
    material.uniforms.tMain.value = textures[count];
    material.uniforms.tNext.value = textures[nextCount];

    TweenLite.fromTo(material.uniforms.uRate, 1.2, {value: 0.0}, {value: 1.0, onComplete: onScrollComplete})
}

function onScrollComplete(){

    count = nextCount;
    material.uniforms.tMain.value = textures[count];
    material.uniforms.uNext.value = 0.0;
}

var mouseWheelStartTime = 0;
window.addEventListener("mousewheel", function(ev){
    var curTime = +new Date;
    if(curTime - mouseWheelStartTime > 2000){
        onScroll();
        mouseWheelStartTime = +new Date;
    }


});

init();