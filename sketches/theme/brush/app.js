/**
 * Created by kenji on 11/16/15.
 */
require('gsap');

var raf = require('raf');
var glslify = require('glslify');

var scene, camera, renderer;
var material, light;
var plane;
var width = window.innerWidth;
var height = window.innerHeight;
var dynamicTexture;

//var loader = new THREE.TextureLoader();
var canvasPaint, ctxPaint;
var uniforms;

var paint = {
    rate : 0
};

function init(){
    scene = new THREE.Scene();


    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 10;
    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.context.getExtension('OES_standard_derivatives');
    renderer.setClearColor(0x999999);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.cullFace = THREE.CullFaceBack;

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);



    /**
    loader.load('assets/brash.png', function(texture){
        //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        createScene(texture);
    });
     */
    canvasPaint = document.createElement('canvas');
    canvasPaint.width = 256;
    canvasPaint.height = 64;
    ctxPaint = canvasPaint.getContext('2d');

    ctxPaint.strokeStyle = '#000000';

    ctxPaint.beginPath();
    ctxPaint.moveTo(10, 54);
    ctxPaint.lineTo(246, 10);
    ctxPaint.lineWidth = 20;
    ctxPaint.stroke();

    dynamicTexture = new THREE.Texture(canvasPaint);
    dynamicTexture.wrapS = dynamicTexture.wrapT = THREE.RepeatWrapping;
    dynamicTexture.magFilter = dynamicTexture.minFilter = THREE.LinearFilter;
    dynamicTexture.needsUpdate = true;
    dynamicTexture.format = THREE.RGBAFormat;

    document.body.appendChild(canvasPaint);
    canvasPaint.style.position = "absolute";
    canvasPaint.style.top  = 0;
    canvasPaint.style.left = 0;

    createScene();


}



function createScene(){
    var imgWidth = dynamicTexture.image.width;
    var imgHeight = dynamicTexture.image.height;

    var triangles = 2;
    var chunkSize = 21845;

    var bufferGeometry = new THREE.BufferGeometry();
    var indices = new Uint16Array( triangles * 3 );
    var vertices = new Float32Array( triangles * 3 * 3 );
    var uv = new Float32Array( triangles * 3 * 2 );

    var halfWidth  = imgWidth/2;
    var halfHeight = imgHeight/2;
    var ii, jj, vv;

    for( ii = 0; ii < indices.length; ii++ ){
        indices[ii] = ii %(3 * chunkSize);
    }

    for ( ii = 0; ii < 1; ii++){
        vv = 0;

        var a = new THREE.Vector3(-halfWidth, halfHeight, 0); // top-left
        var b = new THREE.Vector3(halfWidth, halfHeight, 0); // top-right
        var c = new THREE.Vector3(halfWidth, -halfHeight, 0); // bottom-right
        var d = new THREE.Vector3(-halfWidth, -halfHeight, 0); // bottom-left
        var unitVertices = [a, d, b, d, c, b];

        var uvA = [0, 1];
        var uvB = [1, 1];
        var uvC = [1, 0];
        var uvD = [0, 0];


        var uvVertices = [
            uvA, uvD, uvB, uvD, uvC, uvB
        ];

        for( jj = 0; jj < 6; jj++){
            var verticeNumber = jj * 3;

            vertices[ verticeNumber     ] = unitVertices[jj].x;
            vertices[ verticeNumber + 1 ] = unitVertices[jj].y;
            vertices[ verticeNumber + 2 ] = unitVertices[jj].z;

            var uvNumber = jj * 2;
            uv[ uvNumber     ] = uvVertices[jj][0];
            uv[ uvNumber + 1 ] = uvVertices[jj][1];
        }
    }

    var positionAttribute = new THREE.BufferAttribute( vertices, 3 );
    var uvAttributes     = new THREE.BufferAttribute( uv, 2 );

    bufferGeometry.addAttribute( 'position', positionAttribute );
    bufferGeometry.addAttribute( 'uv',       uvAttributes );

    uniforms = {
        tDiffuse : { type : "t", value: dynamicTexture }
    };

    uniforms.tDiffuse.needsUpdate = true;

    var mat = new THREE.ShaderMaterial({
        uniforms : uniforms,
        vertexShader : glslify('./shader.vert'),
        fragmentShader : glslify('./shader.frag'),
        transparent : true
    });


    plane = new THREE.Mesh( bufferGeometry, mat );
    scene.add( plane );

    raf(animate);
}

function animate() {
    uniforms.tDiffuse.needsUpdate = true;

    renderer.render(scene, camera);

    raf(animate);
}

init();