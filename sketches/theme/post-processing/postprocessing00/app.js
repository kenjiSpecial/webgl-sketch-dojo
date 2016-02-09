var raf = require('raf');
require('./ShaderExtras');
require('./sources/Utils');
require('./sources/Shaders');

var createCaption = require('../../../dom/caption');

var scene, camera, renderer;
var oclcamera, oclscene;
var material, light;
var cubes = [];
var gmeshArr = [];

var COLOR1 = 0xfffff0;
var COLOR3 = 0x97a8ba;
var t = 0;

var pointLight, cameraLight;
var composer, oComposer, finalcomposer;
var renderTargetOcl;
var oclcomposer;
var renderTarget;
var finalPass;

var rendererRawOcl, rendererRawNormal;
var oclVlight;
var oclRawScene;
var renderer2, effectComposer2;

var vlight;
var grPass;

var title = 'PostProcessing#00';
var caption = '<p>I studied  how god ray works. the codes are based on this site: <a href="http://bkcore.com/blog/3d/webgl-three-js-volumetric-light-godrays.html">http://bkcore.com/blog/3d/webgl-three-js-volumetric-light-godrays.html</a></p>';
var wrapper = createCaption(title, caption, 'https://github.com/kenjiSpecial/webgl-sketch-dojo/blob/master/sketches/theme/post-processing/postprocessing00/app.js');
wrapper.style.width = (window.innerWidth/2 - 50) + "px";
wrapper.style.position = "absolute";
wrapper.style.top = '30px';
wrapper.style.left = '30px';


function init(){
    oclRawScene = new THREE.Scene();
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth/2, window.innerHeight/2);

    document.body.appendChild(renderer.domElement);

    setDom(renderer.domElement, window.innerWidth/2, window.innerHeight/2);

    renderer2 = new THREE.WebGLRenderer({alpha: true});
    renderer2.setSize(window.innerWidth/2, window.innerHeight/2);

    document.body.appendChild(renderer2.domElement);
    setDom(renderer2.domElement, window.innerWidth/2, 0);

    rendererRawOcl = new THREE.WebGLRenderer({alpha: true});
    rendererRawOcl.setSize(window.innerWidth/2, window.innerHeight/2);
    rendererRawOcl.setClearColor(0x000000);
    document.body.appendChild(rendererRawOcl.domElement);
    setDom(rendererRawOcl.domElement, 0, window.innerHeight/2);

    oclscene = new THREE.Scene();
    oclscene.add( new THREE.AmbientLight( 0xffffff ) );
    oclcamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);

    oclcamera.position.set(camera.position.x, camera.position.y, camera.position.z);

    // Vol light
    vlight = new THREE.Mesh(
        new THREE.IcosahedronGeometry(20, 3),
        new THREE.MeshBasicMaterial({
            color: COLOR1
        })
    );
    vlight.position.y = 0;
    oclscene.add( vlight );

    oclVlight = vlight.clone();
    oclVlight.position.y = 0;
    oclRawScene.add(oclVlight);


    scene.add( new THREE.AmbientLight( 0xffffff ) );
    pointLight = new THREE.PointLight( COLOR3 );
    //pointLight.position.set( 0, 100, 0 );
    scene.add( pointLight );
    cameraLight = new THREE.PointLight( 0x666666 );
    camera.add(cameraLight);


    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    material = new THREE.MeshPhongMaterial({color: 0x3a9ceb});

    var c;
    for(var i = 0; i < 300; i++) {
        c = addCube();
        cubes.push(c);
        scene.add(c);
    }
    //c.position.set(0, 0, 50);

    setEffect();

    raf(animate);
}

function setEffect(){

    var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };
    renderTargetOcl = new THREE.WebGLRenderTarget( window.innerWidth/4, window.innerHeight/4, renderTargetParameters );

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass( scene, camera ));

    var hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
    var vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );

    var bluriness = 2;

    hblur.uniforms[ 'h' ].value = bluriness / (window.innerWidth/2)*2;
    vblur.uniforms[ 'v' ].value = bluriness / (window.innerHeight/2)*2;

    var effectFXAA = new THREE.ShaderPass(THREE.ShaderExtras[ "fxaa" ]);
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / (window.innerWidth/2), 1 / (window.innerHeight/2) );
    //effectFXAA.renderToScreen = true;


    grPass = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
    //grPass.needsSwap = true;
    grPass.renderToScreen = false;

    finalPass = new THREE.ShaderPass( THREE.Extras.Shaders.Additive );
    //finalPass.needsSwap = true;
    finalPass.renderToScreen = true;


    composer.addPass(hblur);
    composer.addPass(vblur);
    composer.addPass(hblur);
    composer.addPass(vblur);
    //composer.addPass( effectFXAA );
    //composer.addPass(grPass);

    //console.log(finalPass.uniforms[ 'tAdd' ]);
    //finalPass.uniforms[ 'tAdd' ].texture = composer.renderTarget1;

    var renderModel = new THREE.RenderPass( scene, camera );
    var renderModelOcl = new THREE.RenderPass( oclscene, oclcamera );

    oclcomposer = new THREE.EffectComposer( renderer, renderTargetOcl );
    oclcomposer.addPass( renderModelOcl );
    oclcomposer.addPass( hblur );
    oclcomposer.addPass( vblur );
    oclcomposer.addPass( hblur );
    oclcomposer.addPass( vblur );
    oclcomposer.addPass( grPass );



    //renderTarget = new THREE.WebGLRenderTarget( window.innerWidth/2, window.innerHeight/2, renderTargetParameters );

    finalcomposer = new THREE.EffectComposer( renderer );

    finalcomposer.addPass( renderModel );
    finalcomposer.addPass( effectFXAA );
    finalcomposer.addPass( finalPass );

    finalPass.uniforms[ 'tAdd' ].value = renderTargetOcl ;

    //


    var outputFXAA = new THREE.ShaderPass(THREE.ShaderExtras[ "fxaa" ]);
    outputFXAA.uniforms[ 'resolution' ].value.set( 1 / (window.innerWidth/2), 1 / (window.innerHeight/2) );
    outputFXAA.renderToScreen = true;

    effectComposer2 = new THREE.EffectComposer(renderer2);
    effectComposer2.addPass( renderModelOcl );
    effectComposer2.addPass( hblur );
    effectComposer2.addPass( vblur );
    effectComposer2.addPass( hblur );
    effectComposer2.addPass( vblur );
    effectComposer2.addPass( grPass );
    effectComposer2.addPass( outputFXAA );

    createDescription();
}

function createDescription(){

};

function animate() {
    t += 0.01;
    //console.log(t);

    ///**
    //for(var i = 0; i < cubes.length; i++) {
        //cubes[i].rotation.y += 0.01 + ((i - cubes.length) * 0.00001);
        //cubes[i].rotation.x += 0.01 + ((i - cubes.length) * 0.00001);

        //gmeshArr[i].rotation.copy(cubes[i].rot    ation)
    //}


    oclcamera.lookAt( scene.position );
    camera.lookAt( scene.position );



    pointLight.position.set( 0, Math.sin(t)*80, 0 );
    //pointLight.position.set( 0, Math.sin(t)*80, 0 );
    vlight.position.set(pointLight.position.x, pointLight.position.y, pointLight.position.z);
    vlight.updateMatrixWorld();

    oclVlight.position.copy(vlight.position);

    var lPos = THREE.Extras.Utils.projectOnScreen(vlight, camera);
    //console.log(lPos);
    //console.log(lPos.y);
    grPass.uniforms["fX"].value = lPos.x;
    grPass.uniforms["fY"].value = lPos.y;


    oclcomposer.render(.1);
    finalcomposer.render(.1);

    effectComposer2.render(.1);

    rendererRawOcl.render(oclRawScene, camera);

    raf(animate);
}

function addCube() {

    var boxGeometry = new THREE.BoxGeometry(10, 10, 10);

    var cube = new THREE.Mesh( boxGeometry, material );
    cube.position.set(
        Math.random() * 200 - 100,
        Math.random() * 200 - 100,
        40 + 20 * Math.random()
    );
    cube.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );

    var gmat = new THREE.MeshBasicMaterial( { color: 0x000000, map: null } );
    var geometryClone = boxGeometry.clone();
    var gmesh = new THREE.Mesh(geometryClone, gmat);
    gmesh.position.copy(cube.position);
    gmesh.rotation.copy(cube.rotation);
    oclscene.add(gmesh);

    var oclRawMat = new THREE.MeshBasicMaterial( { color: 0x00ff00, map: null, wireframe: true } );
    var oclRwGeometryClone = boxGeometry.clone();
    var oclRawMesh = new THREE.Mesh( oclRwGeometryClone, oclRawMat );
    oclRawMesh.position.copy(cube.position);
    oclRawMesh.rotation.copy(cube.rotation);
    oclRawScene.add(oclRawMesh);

    gmeshArr.push(gmesh);

    return cube;
}

function setDom( dom, left, top ){
    dom.style.position = "absolute";
    dom.style.top = top + 'px';
    dom.style.left = left + 'px';
    return dom;
}

init();