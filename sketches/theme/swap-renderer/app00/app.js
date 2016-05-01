
var raf = require('raf');
var createCaption = require('vendors/caption');
var glslify = require('glslify');
var SwapRenderer = require('vendors/swapRenderer'), swapRenderer;

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


function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    swapRenderer = new SwapRenderer({
        shader : glslify('./blur/shader.frag'),

        width : window.innerWidth,
        height: window.innerHeight,
        uniforms: {
            "uTexture" : { type: "t", value: null },
            "uWindow"  : { type: "v2", value: null },
            "uMouse"  : { type: "v2", value: null }
        },
        renderer : renderer
    });

    swapRenderer.uniforms.uTexture.value =  swapRenderer.target;
    swapRenderer.uniforms.uWindow.value  = new THREE.Vector2( window.innerWidth, window.innerHeight );
    swapRenderer.uniforms.uMouse.value   = mouse;



    /**
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
    c.position.set(0, 0, 50);
    */

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

    id = raf(loop);
    //
}

function loop(){
    stats.begin();

    swapRenderer.update()
    renderer.render( renderScene, renderCamera );
    swapRenderer.swap();

    swapRenderer.uniforms.uTexture.value = swapRenderer.target;
    renderMaterial.uniforms.tDiffuse.value = swapRenderer.output;

    stats.end();

    raf(loop);
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