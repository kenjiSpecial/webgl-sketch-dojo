
var raf = require('raf');
var createCaption = require('vendors/caption');
var glslify = require('glslify');

var SwapRenderer = require('vendors/swapRenderer'), swapRenderer;
var velocityRenderer, pressureRenderer;

var blurEffect;
var scene, camera, renderer;
var material, light;
var cubes = [];
var object, id;
var stats, wrapper;
var composer;
var mouse = new THREE.Vector2(-9999, -9999);

var isAnimation = true;
var orthShaderMaterial;
var orthScene, orthCamera, orthPlane;

var renderPlane, renderMaterial;    
var renderScene, renderCamera;
var clock;


function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    velocityRenderer = new SwapRenderer({
        width : window.innerWidth,
        height: window.innerHeight,
        renderer : renderer
    });
    velocityRenderer.resetRand( parseInt(255 * Math.random()) );

    swapRenderer = new SwapRenderer({
        shader : glslify('./shaders/advect.frag'),

        width : window.innerWidth,
        height: window.innerHeight,
        uniforms: {
            "uTexture" : { type: "t", value: null },
            "velocity" : { type: "t", value: velocityRenderer.target },
            "invresolution" : {type : "v2", value: new THREE.Vector2(1/window.innerWidth, 1/window.innerHeight)},
            "resolution" : {type : "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            "aspectRatio" : {type: "f", value:  window.innerWidth/window.innerHeight },
            "dt" : {type : "f", value: 0.0},
            "rdx" : {type: "f", value: 1.0},
            "uWindow"  : { type: "v2", value: null },
            "uMouse"   : { type: "v2", value: null }

        },
        renderer : renderer
    });



    swapRenderer.uniforms.uTexture.value =  swapRenderer.target;
    swapRenderer.uniforms.uWindow.value  = new THREE.Vector2( window.innerWidth, window.innerHeight );
    swapRenderer.uniforms.uMouse.value   = mouse;

    setComponent();

    raf(animate);
}

function setComponent(){
    var title = 'Swap Rendering with the texture of random color';
    var caption = 'Swap rendering with the texture of random color.';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/swap-renderer/app00';

    wrapper = createCaption(title, caption, url);
    wrapper.style.position = "absolute";
    wrapper.style.top = '50px';
    wrapper.style.left = '30px';

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

    swapRenderer.resetRand( 255 * Math.random());

    /** --------------------- **/

    renderScene = new THREE.Scene();
    renderCamera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2, -10000, 10000 );

    renderMaterial = new THREE.ShaderMaterial({
        depthTest : false,
        side : THREE.DoubleSide,
        uniforms : {
            "tDiffuse" : {type: "t", value: swapRenderer.output }
        },
        vertexShader : glslify('./display/shader.vert'),
        fragmentShader : glslify('./display/shader.frag')
    });

    renderPlane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight),
        renderMaterial
    );

    renderScene.add(renderPlane);

    clock = new THREE.Clock();
    clock.start();

    id = raf(loop);
    //
}

function loop(){
    stats.begin();
    var dt = clock.getDelta();

    swapRenderer.update();
    renderer.render( renderScene, renderCamera );
    swapRenderer.swap();

    // swapRenderer.uniforms.target.value =
    swapRenderer.uniforms.uTexture.value = swapRenderer.target;
    swapRenderer.uniforms.velocity.value = swapRenderer.target;
    swapRenderer.uniforms.dt.value = dt;
    renderMaterial.uniforms.tDiffuse.value = swapRenderer.output;
    // renderMaterial.uniforms.dt.value = dt;

    stats.end();
    id=raf(loop);
}

function addCube() {
    var cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), material);
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


window.addEventListener('click', function(ev){

    swapRenderer.resetRand( 255 * Math.random());

    // renderer.render(scene, camera, swapRenderer.target);
});


window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

window.addEventListener('mousemove', function(ev){
    mouse.x = ev.clientX;
    mouse.y = ev.clientY;
    swapRenderer.uniforms.uMouse.value   = mouse;

});

init();