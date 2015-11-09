
var raf = require('raf');
var createCaption = require('../../dom/caption');
var glslify = require('glslify');

var sceneRTT, cameraRTT, renderer;
var camera, scene, sceneScreen;
var rtTexture;
var materialRTT;
var material, light;
var cubes = [];
var textureArr = [];
var texture;
var quads = [];
var object, id;
var stats, wrapper;
var count = 0;

var isAnimation = true;

for(var ii = 0; ii < 100; ii++) {

    rtTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    });

    textureArr.push(rtTexture)
}

texture =  new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat
});

function init(){
    sceneRTT = new THREE.Scene();
    scene    = new THREE.Scene();

    cameraRTT = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    cameraRTT.position.z = 200;

    //camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    //camera.position.z = 100;



    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x323232);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(cameraRTT.position);
    sceneRTT.add(light);

    materialRTT = new THREE.MeshPhongMaterial({color: 0x3a9ceb});


    var c;
    for(var i = 0; i < 100; i++) {
        c = addCube();
        cubes.push(c);
        sceneRTT.add(c);
    }
    c.position.set(0, 0, 100);

    setComponent();

    var plane = new THREE.PlaneBufferGeometry( window.innerWidth/3 , window.innerHeight/3  );
    var material = new THREE.ShaderMaterial({
        uniforms     : {
            tDiffuse : { type: "t", value: texture  },
            opacity  : { type : 'f', value: 1.0 }
        },
        vertexShader : glslify('./shader.vert'),
        fragmentShader : glslify('./shader.frag')
    });

    var quad = new THREE.Mesh( plane, material );
    scene.add(quad);

    for(var ii = 0; ii < textureArr.length; ii++){
        var scale = 0.018; // 0.1 + 0.05 * Math.random();
        var plane = new THREE.PlaneBufferGeometry( window.innerWidth * scale, window.innerHeight * scale );
        var material = new THREE.ShaderMaterial({
            uniforms     : {
                tDiffuse : { type: "t", value: textureArr[ii]  },
                opacity  : { type : 'f', value: 0.0 }
            },
            vertexShader : glslify('./shader.vert'),
            fragmentShader : glslify('./shader.frag')
        });

        var quad = new THREE.Mesh( plane, material );
        var yNum = parseInt(ii / 10) / 9;
        var xNum = parseInt(ii % 10) / 9;
        quad.position.set( window.innerWidth /5* (xNum - .5 ), window.innerHeight /5 * (-yNum + .5 - scale/2), 0) //window.innerHeight * (Math.random() - 0.5), 0.0 );
        scene.add(quad);

        quads.push(quad);

    }

    raf(animate);
}

function setComponent(){
    var title = 'Basic WebGLRendererTarget';
    var caption = '';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/basic/webglrenderer-target';

    wrapper = createCaption(title, caption, url);
    wrapper.style.position = "absolute";
    wrapper.style.top = '50px';
    wrapper.style.left = '30px';

    stats = new Stats();
    stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom  = '0px';
    stats.domElement.style.left = '0px';
    stats.domElement.style.zIndex= 9999;

    document.body.appendChild( stats.domElement );
}

function animate() {
    stats.begin();

    for(var i = 0; i < cubes.length; i++) {
        cubes[i].rotation.y += 0.01 + ((i - cubes.length) * 0.00001);
        cubes[i].rotation.x += 0.01 + ((i - cubes.length) * 0.00001);
    }

    renderer.render(sceneRTT, cameraRTT, textureArr[count], true);
    renderer.render(sceneRTT, cameraRTT, texture, true);

    quads[count].material.uniforms.opacity.value = 1.0;
    TweenLite.to(quads[count].material.uniforms.opacity, 1.2, {value: 0.0});

    count = (count + 1) % textureArr.length;


    renderer.render(scene, cameraRTT);
    //renderer.render(sceneRTT, cameraRTT);


    stats.end();

    id = raf(animate);
}

function addCube() {
    var cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), materialRTT);
    cube.position.set(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * -500
    );
    cube.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );
    return cube;
}


window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

init()