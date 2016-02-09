require('../vendor/MarchingCubes');

var raf = require('raf');
var createCaption = require('../../../dom/caption');

var scene, camera, renderer;
var light;
var id;
var stats, wrapper;
var effect;
var resolution, numBlobs;
var mat;

var isAnimation = true;

function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    resolution = 24;
    numBlobs = 10;
    var scale = 60;
    mat = new THREE.MeshPhongMaterial( { color: 0xeeeeee, specular: 0x111111, shininess: 1, shading: THREE.FlatShading } );
    effect = new THREE.MarchingCubes( resolution, mat, true, true );
    effect.position.set( 0, 0, 0 );
    effect.scale.set( scale, scale, scale );
    scene.add(effect);

    updateCubes( effect, 0, numBlobs );

    setComponent();

    raf(animate);
}

function updateCubes( object, time, numblobs ) {

    object.reset();

    // fill the field with some metaballs

    var i, ballx, bally, ballz, subtract, strength;

    subtract = 12;
    strength = 1.2 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 )/2;

    for ( i = 0; i < numblobs; i ++ ) {

        /**
         ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.27 + 0.5;
         bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.77; // dip into the floor
         ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;
         */
        ballx = bally = ballz = 0.5;
        bally = 0.5 - 0.02 * 5 + 0.02 * i;

        object.addBall(ballx, bally, ballz, strength, subtract);

    }

}

function setComponent(){
    var title = '';
    var caption = '';
    var url = '';

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
    //stats.begin();


    renderer.render(scene, camera);

    stats.update();
}

window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

init();