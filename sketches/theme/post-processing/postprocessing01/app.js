
var raf = require('raf');

var scene, camera, renderer;
var material, light;
var cubes = [];
var posArr = [];

var fontSize = 120;

function init(){
    var textCanvas = document.createElement('canvas');

    var textCanvasWidth  = 740;
    var textCanvasHeight = 120;

    textCanvas.width  = textCanvasWidth;
    textCanvas.height = textCanvasHeight;

    var textCtx = textCanvas.getContext('2d');
    textCtx.fillStyle = '#fff';
    textCtx.fillRect(0, 0, textCanvasWidth, textCanvasHeight);
    textCtx.font = "900 120px Arial";
    textCtx.fillStyle = '#000';
    textCtx.fillText('Codevember', 0, 105);

    document.body.appendChild(textCanvas);


    var imageData = textCtx.getImageData( 0, 0, textCanvasWidth, textCanvasHeight ).data;

    for(var xx = 0; xx < textCanvasWidth; xx++){
        for(var yy = 0; yy < textCanvasHeight; yy++){
            var dataPos = (yy * textCanvasWidth +  xx) * 4;
            var data = imageData[dataPos];
            if(data == 0){
                var pos = { x: xx -textCanvasWidth/2, y: yy-textCanvasHeight/2 };
                posArr.push(pos);
            }
        }
    }


    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x323232);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    material = new THREE.MeshPhongMaterial({ color: 0x3a9ceb });

    var c;
    for(var i = 0; i < 500; i++) {
        c = addCube();
        cubes.push(c);
        scene.add(c);
    }
    c.position.set(0, 0, 50);

    raf(animate);
}

function animate() {

    for(var i = 0; i < cubes.length; i++) {
        cubes[i].rotation.y += 0.01 + ((i - cubes.length) * 0.00001);
        cubes[i].rotation.x += 0.01 + ((i - cubes.length) * 0.00001);
    }

    renderer.render(scene, camera);

    raf(animate);
}

function addCube() {
    var randomNumber = parseInt( posArr.length * Math.random() );
    var randomPos = posArr[randomNumber];

    var rad = parseInt(5 + 25 * Math.random());
    var boxGeometry = new THREE.BoxGeometry( rad, rad, rad );
    var gmat = new THREE.MeshBasicMaterial({ color : 0x000000, map: null });
    var geometryMesh =  



    /**
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
     */
}

init()