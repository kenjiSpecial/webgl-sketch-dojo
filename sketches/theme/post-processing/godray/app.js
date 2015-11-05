require('./ShaderExtras');
require('./sources/Shaders');

// http://bkcore.com/blog/3d/webgl-three-js-volumetric-light-godrays.html

var renderer = new THREE.WebGLRenderer({ alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

// MAIN SCENE
var camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
var scene = new THREE.Scene();
scene.add( new THREE.AmbientLight( 0xffffff ) );
var pointLight = new THREE.PointLight( 0xffffff );
pointLight.position.set( 0, 100, 0 );
scene.add( pointLight );


// OCCLUSION SCENE
var oclscene = new THREE.Scene();
oclscene.add( new THREE.AmbientLight( 0xffffff ) );
var oclcamera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
oclcamera.position = camera.position;

// Volumetric light
var vlight = new THREE.Mesh(
    new THREE.IcosahedronGeometry(50, 3),
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    })
);
vlight.position.y = 0;
oclscene.add( vlight );

var geometry = new THREE.BoxGeometry( 12, 12, 12 );
createScene(geometry, 0, 0, 0, 1);

// create scene

function createScene( geometry, x, y, z, b ) {

    // Base object
    var zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
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
}



// Prepare the occlusion composer's render target
var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };
var renderTargetOcl = new THREE.WebGLRenderTarget( SCREEN_WIDTH/2, SCREEN_HEIGHT/2, renderTargetParameters );

// Prepare the simple blur shader passes
var hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
var vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );

var bluriness = 3;

hblur.uniforms[ "h" ].value = bluriness / SCREEN_WIDTH;
vblur.uniforms[ "v" ].value = bluriness / SCREEN_HEIGHT;

// Prepare the occlusion scene render pass
var renderModelOcl = new THREE.RenderPass( oclscene, oclcamera );

//console.log(THREE.Extras.Shaders.Godrays);
// Prepare the godray shader pass
//console.log(THREE.ShaderExtras.Godrays);
//ShaderExtras
var grPass = new THREE.ShaderPass( THREE.Extras.Shaders.Godrays );
grPass.needsSwap = true;

// Prepare the composer
var oclcomposer = new THREE.EffectComposer( renderer, renderTargetOcl );
oclcomposer.addPass( renderModelOcl );
oclcomposer.addPass( hblur );
oclcomposer.addPass( vblur );
oclcomposer.addPass( hblur );
oclcomposer.addPass( vblur );
oclcomposer.addPass( grPass );
