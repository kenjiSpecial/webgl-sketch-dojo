
var raf     = require('raf');
var glslify = require('glslify');
var createCaption = require('vendors/caption');

var scene, camera, renderer;
var object, id;
var stats, wrapper;

var isAnimation = true;

function init(){
    scene = new THREE.Scene();

    // camera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2, -10000, 10000 );
    //camera.position.z = -10;
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var shaderMat = new THREE.RawShaderMaterial({
        side: THREE.DoubleSide,
        // depthTest:      false,
        // transparent:    true,
        vertexShader: glslify('./shader.vert'),
        fragmentShader: glslify('./shader.frag'),

    })
    var mesh = new THREE.Mesh( createGeometry(), shaderMat );
    scene.add(mesh);

    setComponent();

    raf(animate);
}

function createGeometry (){
    let particleNum = 1000;//    00;
    let geometry = new THREE.BufferGeometry();
    let positions = new Float32Array( particleNum * 3 * 4);
    let indexArray = [];
    let uvs = new Float32Array(particleNum * 2 * 4);

    var c = 0;
    for(var ii = 0; ii < particleNum; ii++){
        let xx = THREE.Math.randFloat(-1000, 1000);
        let yy = THREE.Math.randFloat(-1000, 1000);
        let zz = THREE.Math.randFloat(-1000, 1000);

        var w = THREE.Math.randFloat(15, 30)/10;
        var h = THREE.Math.randFloat(15, 30)/10;

        for(var jj = 0; jj < 4; jj++){


            positions[4 * 3 * ii +3 * jj] = xx;
            positions[4 * 3 * ii +3 * jj+ 1] = yy;
            positions[4 * 3 * ii +3 * jj+ 2] = zz;

            uvs[4 * 2 * ii + 2 * jj] = parseInt(jj /2);
            uvs[4 * 2 * ii + 2 * jj + 1] = jj % 2;;
        }

        indexArray[c++] = 4 * ii + 0;
        indexArray[c++] = 4 * ii + 1;
        indexArray[c++] = 4 * ii + 2;
        indexArray[c++] = 4 * ii + 2;
        indexArray[c++] = 4 * ii + 1;
        indexArray[c++] = 4 * ii + 3;

    }

    console.log(c);

    indexArray = new Uint16Array(indexArray);

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
    geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));


    return geometry;
}

function setComponent(){
    var title = 'Basic Particles with BufferGeometry';
    var caption = 'minimum codes for Rendering particle with buffergeometry.';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/particles/buffergeometry-particle';

    wrapper = createCaption(title, caption, url);

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