/**
 * Created by kenjisaito on 8/28/16.
 */

var _ = require('lodash');
import ThreeKiso from "three-kiso";
import ModelBufferGeometry from "./modelBufferGeometry";


var threeKiso = new ThreeKiso();
threeKiso.addHelper(100, 0, 0);
var light, material;

threeKiso.camera.position.set(20, 20, 20);
threeKiso.camera.lookAt(new THREE.Vector3());


light = new THREE.PointLight(0x333333, 0.5);
light.position.set(100, 100, 100);
light.lookAt(new THREE.Vector3())

threeKiso.add(light, 'light');

var light2 = new THREE.PointLight(0x333333, 0.5);
light2.position.set(-100, 100, 100);
light2.lookAt(new THREE.Vector3())
threeKiso.add(light2, 'light2');

light2.lookAt(new THREE.Vector3())

var ambientLight = new THREE.AmbientLight(0x404040); // soft white light
threeKiso.add(ambientLight, 'ambientLight');

material = new THREE.MeshPhongMaterial({color: 0xc5c548, side: THREE.DoubleSide});

var jsonLoader = new THREE.JSONLoader();

var loader = new THREE.TextureLoader();
var coinTexture;
loader.load(
    // resource URL
    "./assets/normal/coin_normal.png",
    // Function when resource is loaded
    function (texture) {
        coinTexture = texture;
        // material.normalMap = texture;

        jsonLoader.load("./assets/models/json/coin.json", function (geometry, _material) {
            var coin = new THREE.Mesh(geometry, material);

            coin.scale.x = 10;
            coin.scale.y = 10;
            coin.scale.z = 10;

            threeKiso.add(coin, 'coin');
        })
    }
);



