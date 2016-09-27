require('./ShaderExtras');
require('./sources/Shaders');

//window.THREE = require('./three');

var raf = require('raf');

// http://bkcore.com/blog/3d/webgl-three-js-volumetric-light-godrays.html
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var COLOR1 = 0x77bbff;
var COLOR2 = 0x8ec5e5;
var COLOR3 = 0x97a8ba;

var container,stats;

var camera, target, scene, oclscene;
var renderer, renderTarget, renderTargetOcl;

var mesh, zmesh, geometry, pointLight, pmesh, vlight;

var finalcomposer, oclcomposer, hblur, vblur, oclcamera;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var render_canvas = 1, render_gl = 1;
var has_gl = 0;

var grPass;


function init(){
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // MAIN SCENE

    camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
    camera.position.z = 220;

    target = new THREE.Vector3(0, 40, 0);

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0xffffff ) );
    pointLight = new THREE.PointLight( COLOR3 );
    pointLight.position.set( 0, 100, 0 );
    scene.add( pointLight );
    cameraLight = new THREE.PointLight( 0x666666 )  ;
    camera.add(cameraLight);


    // OCL SCENE

    oclscene = new THREE.Scene();
    oclscene.add( new THREE.AmbientLight( 0xffffff ) );
    oclcamera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
    oclcamera.position = camera.position;

    // Vol light

    vlight = new THREE.Mesh(
        new THREE.IcosahedronGeometry(50, 3),
        new THREE.MeshBasicMaterial({
            color: COLOR1
        })
    );
    vlight.position.y = 0;
    oclscene.add( vlight );

    // RENDERER

    renderer = new THREE.WebGLRenderer({
        //antialias: true
    });

    renderer.autoClear = false;
    renderer.sortObjects = true;
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.domElement.style.position = "relative";

    container.appendChild( renderer.domElement );

    has_gl = 1;

    // STATS

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );

    // LOADER
    /**

    var loader = new THREE.JSONLoader(),
        callbackObj = function( geometry ) { createScene( geometry, 0, 0, 0, 0 ) };
    loader.load( "tron/trondisk.js", callbackObj ); */

    var geometry = new THREE.BoxGeometry( 12, 12, 12 );
    createScene(geometry, 0, 0, 0, 3);

    // COMPOSERS

    var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };
    renderTargetOcl = new THREE.WebGLRenderTarget( SCREEN_WIDTH/2, SCREEN_HEIGHT/2, renderTargetParameters );

    var effectFXAA = new THREE.ShaderPass( THREE.ShaderExtras[ "fxaa" ] );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / SCREEN_WIDTH, 1 / SCREEN_HEIGHT );
    
    hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
    vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );

    var bluriness = 2;

    hblur.uniforms[ 'h' ].value = bluriness / SCREEN_WIDTH*2;
    vblur.uniforms[ 'v' ].value = bluriness / SCREEN_HEIGHT*2;

    var renderModel = new THREE.RenderPass( scene, camera );
    var renderModelOcl = new THREE.RenderPass( oclscene, oclcamera );

    grPass = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
    grPass.needsSwap = true;
    grPass.renderToScreen = false;

    var finalPass = new THREE.ShaderPass( THREE.Extras.Shaders.Additive );
    finalPass.needsSwap = true;
    finalPass.renderToScreen = true;

    oclcomposer = new THREE.EffectComposer( renderer, renderTargetOcl );

    oclcomposer.addPass( renderModelOcl );
    oclcomposer.addPass( hblur );
    oclcomposer.addPass( vblur );
    oclcomposer.addPass( hblur );
    oclcomposer.addPass( vblur );
    oclcomposer.addPass( grPass );

    finalPass.uniforms[ 'tAdd' ].texture = oclcomposer.renderTarget1;

    renderTarget = new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters );

    finalcomposer = new THREE.EffectComposer( renderer, renderTarget );

    finalcomposer.addPass( renderModel );
    finalcomposer.addPass( effectFXAA );
    finalcomposer.addPass( finalPass );
}

// create scene

function createScene( geometry, x, y, z, b ) {

    var mats = [];
    mats.push(new THREE.MeshBasicMaterial({color: 0x009e60}));
    mats.push(new THREE.MeshBasicMaterial({color: 0x009e60}));

    mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
    mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xffd500}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xffd500}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xff5800}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xff5800}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xC41E3A}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xC41E3A}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xffffff}));
    mats.push(new THREE.MeshBasicMaterial({color: 0xffffff}));

    // Base object
    var zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(mats) );
    zmesh.position.set( x, y, z );
    zmesh.scale.set( b, b, b );
    scene.add( zmesh );

    // Occluding object
    var gmat = new THREE.MeshBasicMaterial( { color: 0x000000, map: null } );
    var geometryClone = geometry.clone();
    var gmesh = new THREE.Mesh(geometryClone, gmat);
    gmesh.position = zmesh.position;
    gmesh.rotation = zmesh.rotation;
    gmesh.scale = zmesh.scale;
    oclscene.add(gmesh);

    // extra fancy
    var m = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(mats));
    m.position.set(0, 100, 0);
    m.scale = zmesh.scale;
    m.rotation = zmesh.rotation;
    scene.add(m);

    m = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(mats));
    m.position.set(0, -100, 0);
    m.scale = zmesh.scale;
    m.rotation = zmesh.rotation;
    scene.add(m);

    m = new THREE.Mesh(geometryClone, gmat);
    m.position.set(0, 100, 0);
    m.scale = zmesh.scale;
    m.rotation = zmesh.rotation;
    oclscene.add(m);

    m = new THREE.Mesh(geometryClone, gmat);
    m.position.set(0, -100, 0);
    m.scale = zmesh.scale;
    m.rotation = zmesh.rotation;
    oclscene.add(m);
}



function animate(){
    raf(animate);

    render();
}

function render(){
    t += 0.1;
    oclcamera.lookAt( scene.position )
    camera.lookAt( scene.position );

    pointLight.position.set( 0, Math.cos(t)*200, 0 );
    vlight.position = pointLight.position;

    vlight.updateMatrixWorld();


    //var lPos = THREE.Extras.Utils.projectOnScreen(vlight, camera);
    //var lPos = {y: .0, x: 0};
    grPass.uniforms["fX"].value = 1.0;
    grPass.uniforms["fY"].value = 1.0;//    lPos.y;

    //console.log('loop');

    oclcomposer.render( 0.1 );
    finalcomposer.render( 0.1 );


}


var t = 0.0;
init();
animate();

