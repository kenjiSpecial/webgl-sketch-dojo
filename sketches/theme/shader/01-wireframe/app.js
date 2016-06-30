var raf = require('raf');
require('vendors/controls/TrackballControls');
var createCaption = require('../../../dom/caption');
import CustomMesh from "./mesh";
import  CustomMesh2 from  "./mesh2";
import CustomMesh3 from "./mesh3";
import CustomMesh4 from "./mesh4"
import CustomMesh5 from "./mesh5";
import CustomMesh6 from "./mesh6";
import CustomMesh7 from "./mesh7";
import CustomMesh8 from "./mesh8";
import CustomMesh9 from "./mesh9";

var scene, camera, renderer;
var MeshArr = [CustomMesh, CustomMesh2, CustomMesh3, CustomMesh4, CustomMesh9, CustomMesh5, CustomMesh6, CustomMesh8, CustomMesh7];
var meshArr = [];
var customMesh;
var id;
var stats, wrapper;
var time, controls;

var isAnimation = true;

scene = new THREE.Scene();
// var gui = new GUI();
// var data = {
//     shaderValue : 10
// };

(function(){


    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 600;
    camera.position.y = 400;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    var isDerivatives = renderer.extensions.get( 'OES_standard_derivatives' );

    renderer.setSize(window.innerWidth, window.innerHeight); 
    document.body.appendChild(renderer.domElement);

    setComponent();

    time = new THREE.Clock();
    time.start();

    var MeshSize = Math.ceil(Math.sqrt(MeshArr.length));
    MeshArr.forEach(function(Mesh, index){
        customMesh = new Mesh();
        scene.add(customMesh);

        customMesh.position.x = (customMesh.unitWidth + 30) * (index  % MeshSize - (MeshSize- 1)/2);
        customMesh.position.z = (customMesh.unitWidth + 30) * (parseInt(index  / MeshSize) - (MeshSize- 1)/2);
    
        meshArr.push(customMesh);
    })



    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 2.2;
    controls.panSpeed = 1;
    controls.dynamicDampingFactor = 0.3;

    // gui.add(data, 'shaderValue', -5, 5).onChange(onChangeData);

    raf(animate);
})();

function setComponent(){
    var title = 'Experiments with single-pass wireframe';
    var caption = '';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/shader/01-wireframe';

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

    controls.update();

    var dt = time.getDelta ();

    meshArr.forEach(function(mesh){
        mesh.updateLoop(dt)
    });

    renderer.render(scene, camera);

    stats.end();

    id = raf(animate);
}

function onChangeData(){
    customMesh.updateShader(data);
}

window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
});
