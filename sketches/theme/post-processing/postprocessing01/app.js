require('../postprocessing00/ShaderExtras');
require('../postprocessing00/sources/Utils');
require('./Shaders');
require('gsap');

var createCaption = require('../../../dom/caption');

var raf = require('raf');

var scene, camera, renderer;
var material, light;
var cubes = [];
var oclCubes = [];
var posArr = [];

var oclscene;
var oclcamera;

var pointLight, cameraLight;
var composer, oComposer, finalcomposer;
var renderTargetOcl;
var oclcomposer;
var renderTarget;
var finalPass;
var minX;

var COLOR1 = 0xfffff0;

var fontSize = 120;

var title = 'PostProcessing#01';
var caption = '';
var wrapper = createCaption(title, caption, 'https://github.com/kenjiSpecial/webgl-sketch-dojo/blob/master/sketches/theme/post-processing/postprocessing01/app.js');
wrapper.style.width = (window.innerWidth/2 - 50) + "px";
wrapper.style.position = "absolute";
wrapper.style.top = '30px';
wrapper.style.left = '30px';
wrapper.style.zIndex = 9999;

function init(){
    var textCanvas = document.createElement('canvas');

    var textCanvasWidth  = 800;
    var textCanvasHeight = 120;

    textCanvas.width  = textCanvasWidth;
    textCanvas.height = textCanvasHeight;

    var textCtx = textCanvas.getContext('2d');
    textCtx.fillStyle = '#fff';
    textCtx.fillRect(0, 0, textCanvasWidth, textCanvasHeight);
    textCtx.font = "900 120px Arial";
    textCtx.fillStyle = '#000';
    textCtx.fillText('Codevember', 0, 105);


    oclscene = new THREE.Scene();
    oclscene.add( new THREE.AmbientLight( 0xffffff ) );
    oclcamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    oclcamera.position.z = 800;


    var imageData = textCtx.getImageData( 0, 0, textCanvasWidth, textCanvasHeight ).data;

    for(var xx = 0; xx < textCanvasWidth; xx++){
        for(var yy = 0; yy < textCanvasHeight; yy++){
            var dataPos = (yy * textCanvasWidth +  xx) * 4;
            var data = imageData[dataPos];
            if(data == 0){
                var pos = { x: xx -textCanvasWidth/2, y: -yy+textCanvasHeight/2 };
                posArr.push(pos);
            }
        }
    }


    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 800;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    scene.add( new THREE.AmbientLight( 0xffffff ) );
    cameraLight = new THREE.PointLight( 0x666666 );
    camera.add(cameraLight);

    setEffect();

    add();
    raf(animate);
}

var composer, grPass, finalPass

function setEffect(){

    var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };
    renderTargetOcl  = new THREE.WebGLRenderTarget( window.innerWidth/2, window.innerHeight/2, renderTargetParameters );

    var hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
    var vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );

    var bluriness = 4;

    hblur.uniforms[ 'h' ].value = bluriness / (window.innerWidth)*2;
    vblur.uniforms[ 'v' ].value = bluriness / (window.innerHeight)*2;

    var effectFXAA = new THREE.ShaderPass(THREE.ShaderExtras[ "fxaa" ]);
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / (window.innerWidth), 1 / (window.innerHeight) );
    //effectFXAA.renderToScreen = true;

    grPass = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
    grPass.needsSwap = true;
    grPass.renderToScreen = false;

    finalPass = new THREE.ShaderPass( THREE.Extras.Shaders.Additive );
    finalPass.needsSwap = true;
    finalPass.renderToScreen = true;

    var renderModel = new THREE.RenderPass( scene, camera );
    var renderModelOcl = new THREE.RenderPass( oclscene, oclcamera );

    oclcomposer = new THREE.EffectComposer( renderer, renderTargetOcl );
    oclcomposer.addPass( renderModelOcl );
    oclcomposer.addPass( hblur );
    oclcomposer.addPass( vblur );
    oclcomposer.addPass( hblur );
    oclcomposer.addPass( vblur );
    oclcomposer.addPass( grPass );
    //oclcomposer.addPass( effectFXAA );

    renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

    finalcomposer = new THREE.EffectComposer( renderer, renderTarget );

    finalcomposer.addPass( renderModel );
    finalcomposer.addPass( effectFXAA );
    finalcomposer.addPass( finalPass );

    finalPass.uniforms[ 'tAdd' ].value = renderTargetOcl ;


}

var minX = 0;

function add(){
    if(cubes.length < 500){
        for(var ii = 0; ii < 10; ii++){
            var c = addCube();
            cubes.push(c);
            scene.add(c);
        }
    }else{

        return;
    }



    setTimeout(add, 50);
}

function animate() {
    //minX += 0.1;
    if(cubes.length >= 400){
        minX+= 80;
        if(minX >  posArr.length){
            updateReset();
        }else{
            update();
        }

    }

    for(var i = 0; i < cubes.length; i++) {
        cubes[i].position.y += 0.25 - 0.5 * Math.random(); //0.01 + ((i - cubes.length) * 0.00001);
        cubes[i].position.x += 0.25 - 0.5 * Math.random();// + ((i - cubes.length) * 0.00001);
    }


    grPass.uniforms["fX"].value = 0.5;
    grPass.uniforms["fY"].value = 0.5;

    oclcomposer.render(.1);
    finalcomposer.render(.1);



    raf(animate);
}

var isTimerStart = false;
var minXPos, maxXPos, count = 0;

function updateReset(){
    if(!isTimerStart){
        isTimerStart = true;

        minXPos = 0; maxXPos = parseInt(posArr.length/3);

        setTimeout(startTimer, 1500);
    }

    cubes.forEach(function(cube, index){
        if(!cube.isTween){
            cube.randomNumber = parseInt(minXPos + (maxXPos - minXPos) * Math.random());//cube.randomNumber + 1 + parseInt( (posArr.length - cube.randomNumber) * Math.random() );
            //if(cube.randomNumber < posArr.length -10){
                var pos = posArr[cube.randomNumber];
                cube.isTween = true;

                var col = (pos.x + 370) / 740 * 100;
                var color = new THREE.Color("hsl(" + col + ", 100%, 50%)");
                oclCubes[index].material.color = color;

                TweenLite.to(cube.position,.8, {x: pos.x, y: pos.y, onComplete: onComplete.bind(this, cube) });
                TweenLite.to(oclCubes[index].position,.8, {x: pos.x, y: pos.y });

            //}
        }
    });
}

function startTimer(){
    count++;
    //count %= 3;
    if(count == 3){
        count = -1;
        all();
        return;
    }

    minXPos = parseInt(posArr.length/3) * count; maxXPos = parseInt(posArr.length/3) * (count + 1);

    setTimeout(startTimer, 1500);
}

function all(){
    minXPos = 0;
    maxXPos = posArr.length;

    setTimeout(startTimer, 3500)
}

function onComplete(cube){
    setTimeout(function(){
        cube.isTween = false;
    }, 300);

}

function update(){
    //console.log(minX);

    cubes.forEach(function(cube, index){
        if(cube.randomNumber < minX){
            cube.randomNumber = cube.randomNumber + 1 + parseInt( (posArr.length - cube.randomNumber) * Math.random() );
            if(cube.randomNumber < posArr.length -10){
                var pos = posArr[cube.randomNumber];

                var col = (pos.x + 370) / 740 * 100;
                var color = new THREE.Color("hsl(" + col + ", 100%, 50%)");
                oclCubes[index].material.color = color;

                TweenLite.to(cube.position, 1, {x: pos.x, y: pos.y });
                TweenLite.to(oclCubes[index].position, 1, {x: pos.x, y: pos.y });

            }
        }
    });

}

function addCube() {
    var randomNumber = parseInt( posArr.length * cubes.length/500  * Math.random() );
    var randomPos = posArr[randomNumber];

    var rad = parseInt(6 + 4 * Math.random());

    var boxGeometry = new THREE.BoxGeometry( rad, rad, rad );
    var cube = new THREE.Mesh( boxGeometry, material);
    //cube.scale.set(0.01, 0.01, 0.01);
    cube.randomNumber = randomNumber;

    //TweenLite.from(cube.position, 0.1, {x: -100,  ease: Power4.easeInOut});


    var col = (randomPos.x + 370) / 740 * 100;
    var color = new THREE.Color("hsl(" + col + ", 100%, 50%)");

    var gmat = new THREE.MeshBasicMaterial({ color : color, map: null });
    var geometryMesh =  new THREE.Mesh( boxGeometry, gmat);

    cube.position.set(
        randomPos.x,
        randomPos.y,
        24
    );

    cube.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );

    geometryMesh.position.copy(cube.position);
    TweenLite.from(geometryMesh.scale, 0.6, {x: 0.01, y:0.01,  ease: Power4.easeInOut });
    TweenLite.from(cube.scale, 0.6, {x: 0.01, y:0.01,  ease: Power4.easeInOut });
    geometryMesh.rotation.copy(cube.rotation);
    oclscene.add(geometryMesh)
    oclCubes.push(geometryMesh);

    return cube;

}

init();