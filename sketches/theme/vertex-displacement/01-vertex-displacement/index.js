/**
 * Created by kenjisaito on 8/28/16.
 */

var _ = require('lodash');
var glslify = require('glslify');

import ThreeKiso from "three-kiso";
// import ModelBufferGeometry from "./modelBufferGeometry";


var threeKiso = new ThreeKiso();
threeKiso.addHelper(100, 0, 0);
var light, material;

threeKiso.camera.position.set(20, 20, 20);
// threeKiso.camera.position.set(400, 0, 0);
threeKiso.camera.lookAt(new THREE.Vector3());
var light1, light2;

light = new THREE.PointLight(0x999999, 0.5);
light.position.set(100, 100, 100);
light.lookAt(new THREE.Vector3())

threeKiso.add(light, 'light');

var light2 = new THREE.PointLight(0x999999, 0.5);
light2.position.set(-100, 100, 100);
light2.lookAt(new THREE.Vector3())
threeKiso.add(light2, 'light2');

light2.lookAt(new THREE.Vector3())

var ambientLight = new THREE.AmbientLight(0xf2cb01); // soft white light
threeKiso.add(ambientLight, 'ambientLight');

var light3 = new THREE.DirectionalLight(0xff0000);
light3.position.set(0, 0, 1);
threeKiso.add(light3, 'light3');

var gui = new GUI();


threeKiso.addUpdateCallback(function(){
    uniforms.uTime.value += 1/60;
})

var uniforms = THREE.UniformsUtils.merge( [
    THREE.UniformsLib[ "lights" ],
    {
        diffuse: {type: 'c', value: new THREE.Color(0xf2cb01)},
        uTime : {value: 0}
    }


] );


material = new THREE.ShaderMaterial({
    uniforms : uniforms,
    vertexShader   : glslify('./shaders/shader.vert'),
    fragmentShader : glslify('./shaders/shader.frag'),
    side : THREE.DoubleSide,
    lights: true
});



var jsonLoader = new THREE.JSONLoader();

var loader = new THREE.TextureLoader();
var coinTexture;
var coin;

loader.load(
    // resource URL
    "./assets/normal/coin_normal.png",
    // Function when resource is loaded
    function (texture) {
        coinTexture = texture;
        // material.normalMap = texture;

        jsonLoader.load("./assets/models/json/coin.json", function (geometry, _material) {
            geometry.computeVertexNormals();
            geometry.computeBoundingBox();


            var geometry = new THREE.SphereGeometry(1, 40, 40);

            coin = new THREE.Mesh(geometry, material);

            coin.scale.x = 10;
            coin.scale.y = 10;
            coin.scale.z = 10;

            threeKiso.add(coin, 'coin');

            addGUI();
        })
    }
);

function addGUI(){
    var coinF = gui.addFolder('Coin Folder');
    coinF.add(coin.position, 'y', -15, 15);

    coinF.open();
}

