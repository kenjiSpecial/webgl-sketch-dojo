var glslify = require('glslify');

var raf = require('raf');
var createCaption = require('../../dom/caption');

var scene, camera, renderer;
var geo;
var material, light;
var mesh;
var object, id;
var stats, wrapper;

var isAnimation = true;

function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //light = new THREE.PointLight(0xFFFFFF, 1);
    //light.position.copy(camera.position);
    //scene.add(light);

    createBufferGeometry();
    //material = new THREE.MeshBasicMaterial({color: 0x3a9ceb, side: THREE.DoubleSide });
    material =  new THREE.ShaderMaterial( {
        uniforms: {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() }
        },
        vertexShader   : glslify('./shader.vert'),
        fragmentShader : glslify('./shader.frag'),
        side : THREE.DoubleSide
    } );


    mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    setComponent();

    raf(animate);
}

function createBufferGeometry(){
    geo = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right // vertices because each vertex needs to appear once per triangle. var vertexPositions = [ [-1.0, -1.0, 1.0], [ 1.0, -1.0, 1.0], [ 1.0, 1.0, 1.0], [ 1.0, 1.0, 1.0], [-1.0, 1.0, 1.0], [-1.0, -1.0, 1.0] ]; var vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex // components of the position vector for each vertex are stored // contiguously in the buffer. for ( var i = 0; i < vertexPositions.length; i++ ) { vertices[ i*3 + 0 ] = vertexPositions[i][0]; vertices[ i*3 + 1 ] = vertexPositions[i][1]; vertices[ i*3 + 2 ] = vertexPositions[i][2]; } // itemSize = 3 because there are 3 values (components) per vertex geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) ); var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); var mesh = new THREE.Mesh( geometry, material );
    var vertexPositions = [
        [ -1.0, -1.0, 1.0 ],
        [  1.0, -1.0, 1.0 ],
        [  1.0,  1.0, 1.0 ],
        [  1.0,  1.0, 1.0 ],
        [ -1.0,  1.0, 1.0 ],
        [ -1.0, -1.0, 1.0 ]
    ];

    var uv = [
        [0, 1],
        [1, 1],
        [1, 0],
        [1, 0],
        [0, 0],
        [0, 1]
    ];

    var vertices = new Float32Array(vertexPositions.length * 3);
    var uvs       = new Float32Array(uv.length * 3);

    var ii;
    for(ii = 0; ii < vertexPositions.length; ii++){
        vertices[ii * 3 + 0] = vertexPositions[ii][0];
        vertices[ii * 3 + 1] = vertexPositions[ii][1];
        vertices[ii * 3 + 2] = vertexPositions[ii][2];

        uvs[ii * 2 + 0] = uv[ii][0];
        uvs[ii * 2 + 1] = uv[ii][1];
    }


    geo.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));


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

init()