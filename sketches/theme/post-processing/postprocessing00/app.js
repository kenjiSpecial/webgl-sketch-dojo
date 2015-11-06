var raf = require('raf');
require('./ShaderExtras');
require('./sources/Utils');
require('./sources/Shaders');

var scene, camera, renderer;
var oclcamera, oclscene;
var material, light;
var cubes = [];
var gmeshArr = [];

var COLOR1 = 0xffffe0;
var COLOR3 = 0x97a8ba;
var t = 0;

var pointLight, cameraLight;
var composer, oComposer, finalcomposer;
var renderTargetOcl;
var oclcomposer;
var renderTarget;

var vlight;
var grPass

function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(0x000);
    document.body.appendChild(renderer.domElement);

    oclscene = new THREE.Scene();
    oclscene.add( new THREE.AmbientLight( 0xffffff ) );
    oclcamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );

    oclcamera.position.set(camera.position.x, camera.position.y, camera.position.z);

    // Vol light
    //console.log(new THREE.IcosahedronGeometry(50, 3));
    vlight = new THREE.Mesh(
        new THREE.IcosahedronGeometry(20, 3),
        new THREE.MeshBasicMaterial({
            color: COLOR1
        })
    );
    vlight.position.y = 0;
    oclscene.add( vlight );

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
    renderTargetOcl = new THREE.WebGLRenderTarget( window.innerWidth/2, window.innerHeight/2, renderTargetParameters );

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass( scene, camera ));

    var hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
    var vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );

    var bluriness = 2;

    hblur.uniforms[ 'h' ].value = bluriness / window.innerWidth*2;
    vblur.uniforms[ 'v' ].value = bluriness / window.innerHeight*2;

    var effectFXAA = new THREE.ShaderPass(THREE.ShaderExtras[ "fxaa" ]);
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    //effectFXAA.renderToScreen = true;



    grPass = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
    grPass.needsSwap = true;
    grPass.renderToScreen = false;

    var finalPass = new THREE.ShaderPass( THREE.Extras.Shaders.Additive );
    finalPass.needsSwap = true;
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
    //oclcomposer.addPass( effectFXAA );

    finalPass.uniforms[ 'tAdd' ].texture = renderTargetOcl ;

    renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

    finalcomposer = new THREE.EffectComposer( renderer, renderTarget );

    //finalcomposer.addPass( renderModel );
    //finalcomposer.addPass( effectFXAA );
    finalcomposer.addPass( finalPass );

    //composer.addPass(effectFXAA);


}

function animate() {
    t += 0.01;
    //console.log(t);

    ///**
    for(var i = 0; i < cubes.length; i++) {
        cubes[i].rotation.y += 0.01 + ((i - cubes.length) * 0.00001);
        cubes[i].rotation.x += 0.01 + ((i - cubes.length) * 0.00001);

        gmeshArr[i].rotation.copy(cubes[i].rotation)
    }


    oclcamera.lookAt( scene.position );
    camera.lookAt( scene.position );



    pointLight.position.set( 0, Math.sin(t)*80, 0 );
    vlight.position.set(pointLight.position.x, pointLight.position.y, pointLight.position.z);
    vlight.updateMatrixWorld();

    var lPos = THREE.Extras.Utils.projectOnScreen(vlight, camera);
    //console.log(lPos);
    //console.log(lPos.y);
    grPass.uniforms["fX"].value = 0.5;
    grPass.uniforms["fY"].value = 0.5;


    oclcomposer.render(.1);
    //finalPass.uniforms[ 'tAdd' ].texture = composer.renderTarget1;
    finalcomposer.render(.1);
    //

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
    gmesh.rotation.copy(cube.rotation)
    oclscene.add(gmesh);

    gmeshArr.push(gmesh);

    return cube;
}

init();