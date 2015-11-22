
var raf     = require('raf');
var glslify = require('glslify');
var createCaption = require('../../../dom/caption');

var scene, camera, renderer;
var shaderMaterial;
var object, id;
var stats, wrapper;

var texture;
var loader = new THREE.TextureLoader();

var isAnimation = true;

function init(){
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2, -10000, 10000 );
    //camera.position.z = -10;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );
    shaderMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader   : glslify('./shader.vert'),
        fragmentShader : glslify('./shader.frag'),
        side : THREE.DoubleSide,
        transparent : true
    } );

    var mesh = new THREE.Mesh( geometry, shaderMaterial );
    scene.add(mesh);

    setComponent();

    raf(animate);
}



function setComponent(){
    var title = 'Noise: Sketch#00';
    var caption = 'Sketch with noise';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/noise/noise01';

    wrapper = createCaption(title, caption, url);
    wrapper.style.width = (window.innerWidth/2 - 50) + "px";
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
    stats.begin();

    shaderMaterial.uniforms.time.value += 1/60;

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

init();