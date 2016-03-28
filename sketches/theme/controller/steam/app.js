
var raf = require('raf');
var createCaption = require('../../../dom/caption');
var controller = require('../../../vendors/controller');

var scene, camera, renderer;
var material, light;
var cube;
var cubes = [];
var object, id;
var stats, wrapper;

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

    material = new THREE.MeshBasicMaterial({color: 0x3a9ceb});

    var c;

    for(var ii = 0; ii < 50; ii++){
        var c = addCube(ii);
        cubes.push(c);
        scene.add(c);
    }

    cube = cubes[cubes.length-1];

    setComponent();
    controller.connect();
    controller.addEventListener("keyDown", onKeyDown);
    controller.addEventListener("keyUp",   onKeyUp);


    raf(animate);
}

function setComponent(){
    var title = '';
    var caption = '';
    var url = 'https://github.com/kenjiSpecial/webgl-sketch-dojo/tree/master/sketches/theme/controller/steam';

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

    if(controller.direction)
        moveCube(controller.direction);

    if(velX > 25) velX = 25;
    else if(velX < -25) velX = -25

    if(velY > 25) velY = 25;
    else if(velY < -25) velY = -25

    velX *= 0.92;
    velY *= 0.92;

    cube.position.x += velX;
    cube.position.y += velY;

    camera.position.x += (cube.position.x - camera.position.x)/3;
    camera.position.y += (cube.position.y - camera.position.y)/3;

    for(var ii = 0; ii < cubes.length -1; ii++){
        cubes[ii].position.x += (cubes[ii+1].position.x - cubes[ii].position.x)/6;
        cubes[ii].position.y += (cubes[ii+1].position.y - cubes[ii].position.y)/6
        // cubes[ii].position.y += (cubes[9].position.y - cubes[ii].position.y)/10;
    }

    renderer.render(scene, camera);


    stats.end();

    id = raf(animate);
}

var velX = 0;
var velY = 0;
function moveCube(dir){
    if(dir == "up") {
        // cube.position.y += 10;
        velY += 0.6;
    }else if(dir == "down"){
        velY -= 0.6;
        // cube.position.y -= 10;
    }else if(dir == "right"){
        velX += 0.6;
    }else if(dir == "left"){
        velX -= 0.6;
    }else  if( dir == "upRight"){
        velX += 0.6;
        velY += 0.6;
    }else if(dir == "upLeft"){
        velX -= 0.6;
        velY += 0.6;
    }else if(dir == "downLeft"){
        velX -= 0.6;
        velY -= 0.6;
    }else if(dir == "downRight"){
        velX += 0.6;
        velY -= 0.6;
    }
}

function addCube(zPos) {
    var cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    cube.position.z = zPos;

    return cube;
}


window.addEventListener('keydown', function(ev){
    if(ev.keyCode == 27){
        if(isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

function onKeyDown(event){
    var command = event.command;
}

function onKeyUp(event){
    var command = event.command;

}

init();
