
var raf = require('raf');
var createCaption = require('vendors/caption');
var glslify = require('glslify');

var windowSize = new THREE.Vector2(window.innerWidth, window.innerHeight);

var SwapRenderer = require('vendors/swapRenderer'), swapRenderer;
var velocityRenderer, pressureRenderer;

var Solver = require('./fluid/solver');
var solver;

var scene, camera, renderer;
var object, id;
var stats, wrapper;
var mouse = new THREE.Vector2(-9999, -9999);

var isAnimation = true;
var orthShaderMaterial;
var orthScene, orthCamera, orthPlane;

var renderPlane, renderMaterial;    
var renderScene, renderCamera;
var clock;

var grid = {
    size : new THREE.Vector2(window.innerWidth/4, window.innerHeight/4),
    scale : 1
};

var time = {
    step : 1
};

var outputRenderer;

function init(){

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    solver = Solver.make(grid, time, windowSize, renderer)

    outputRenderer = new SwapRenderer({
        width : grid.size.width, height : grid.size.height,
        renderer : renderer
    });


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

    /** --------------------- **/

    renderScene = new THREE.Scene();
    renderCamera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2, -10000, 10000 );
    console.log(solver.density.output);

    renderMaterial = new THREE.ShaderMaterial({
        depthTest : false,
        side : THREE.DoubleSide,
        uniforms : {
            "tDiffuse" : {type: "t", value: solver.velocity.output }
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

    solver.step(mouse);
    renderer.render(renderScene, renderCamera);


    stats.end();
    id=raf(loop);
}

window.addEventListener('click', function(ev){


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
    // swapRenderer.uniforms.uMouse.value   = mouse;

});

init();