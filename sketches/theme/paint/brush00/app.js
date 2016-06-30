var _ = require('lodash');

var scene, camera, renderer;


var raf = require('raf');
var material, light;
var plane;
var width = window.innerWidth;
var height = window.innerHeight;
var mouseX, mouseY;
var prevMouseX, prevMouseY;

var mouseArr = [];

var isMouseDown = false;
var isDebug = true;

var loader = new THREE.TextureLoader();
var texture;
var materialTex;
var counter = 0;
var intervalCount = 1;
// var width = innerWidth;
var lineWidth = 5;
var middlePoints = [];
var miterLimit = 100;
var brushMesh;
var isDebug = true;

var JOINT = {
    ROUND : 2,
    BEVEL : 0,
    MITER : 1
}

var posExampleArr = [
    [-216, 282],
    [-130, 258],
    [-75, 247],
    [3, 235.5],
    [75, 226.5],
    [115, 222.5],
    [148, 218.5],
    [153.5, 200],
    [127.5, 173.5],
    [91, 145.5],
    [54.5, 115.5],
    [26, 91],
    [-8, 59],
    [-39, 26],
    [-65, 1],
];

_.extend(THREE.Vector2.prototype, {
    perpendicular : function(){
        // console.log(this.x + ", " + this.y);
        var x = this.x;
        this.x = -this.y;
        this.y = x;

        return this;
    }
});


function init(){
    scene = new THREE.Scene();


    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 100;
    scene.add( camera );

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, devicePixelRatio: window.devicePixelRatio });
    renderer.setPixelRatio ( window.devicePixelRatio  )
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);


    loader.load('assets/brushes/brush.png', function(_texture){
        texture = _texture;
        texture.minFilter = THREE.LinearFilter
        materialTex = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: texture, transparent: true } );


        mouseArr.push([]);

        posExampleArr.forEach(function(pos){
            var mouse = new THREE.Vector2(pos[0],pos[1]);
            mouseArr[mouseArr.length-1].push(mouse);
        });

        /*var mouse = new THREE.Vector2(- 300, -100);
        mouseArr[mouseArr.length-1].push(mouse);
        // var mouse = new THREE.Vector2(- 250, -180);
        // mouseArr[mouseArr.length-1].push(mouse);
        // var mouse = new THREE.Vector2(- 200, -160);
        // mouseArr[mouseArr.length-1].push(mouse);
        //
        // var mouse = new THREE.Vector2(- 150, -120);
        // mouseArr[mouseArr.length-1].push(mouse);

        var mouse2 = new THREE.Vector2(0, -100);
        mouseArr[mouseArr.length-1].push(mouse2);
        var mouse3 = new THREE.Vector2(0, 200);
        mouseArr[mouseArr.length-1].push(mouse3);
        // var mouse3 = new THREE.Vector2(200, 200);
        // mouseArr[mouseArr.length-1].push(mouse3);
        var mouse3 = new THREE.Vector2(240, 180);
        mouseArr[mouseArr.length-1].push(mouse3);
        // var mouse3 = new THREE.Vector2(300, 200);
        // mouseArr[mouseArr.length-1].push(mouse3);
        // var mouse3 = new THREE.Vector2(320, 220);
        // mouseArr[mouseArr.length-1].push(mouse3);
        // //
        var mouse3 = new THREE.Vector2(400, 200);
        mouseArr[mouseArr.length-1].push(mouse3);*/

        createGeometry();

        // console.log('texture');
    });

    raf(animate);
}

function createGeometry(){
    var points = mouseArr[mouseArr.length - 1];
    var middlePointArr = [];
    var vertices = [];
    var uvs = [];

    if(points.length == 2){

        var uvRate = 1 / (2);
        var startUVValue = 0;
        createTriangles(points[0], new THREE.Vector2().addVectors(points[0], points[1]).multiplyScalar(0.5), points[1], vertices, uvs, lineWidth, JOINT.BEVEL, startUVValue, uvRate )

    }else{
        points.forEach(function(point, index){
            if(index >= points.length - 1) return;

            if(index == 0)                          middlePointArr.push(points[0]);
            else if(index === points.length - 2)    middlePointArr.push(points[points.length - 1]);
            else                                    middlePointArr.push(new THREE.Vector2().addVectors(points[index], points[index + 1]).multiplyScalar(0.5));


        });

        var uvRate = 1 / (middlePointArr.length - 1);
        // console.log(middlePointArr);
        var startUVValue = 0;
        for(var ii = 1; ii < middlePointArr.length; ii++){
            // console.log(startUVValue);
            createTriangles(middlePointArr[ii - 1], points[ii], middlePointArr[ii], vertices, uvs, lineWidth, JOINT.BEVEL, startUVValue, uvRate )
            startUVValue += uvRate;
        }
    }

    makeGeometry(vertices, uvs);
}

function createTriangles( p0, p1, p2, verts, uvs, width, join, startUvValue, uvRate ){
    if(p0.equals(p1)){
        p1.x = p0.x + (p2.x - p0.x) / 2;
        p1.y = p0.y + (p2.y - p0.y) / 2;
    }else if(p1.equals(p2)){
        p2 = p1.clone();
        p1.x = p0.x + (p2.x - p0.x) / 2;
        p1.y = p0.y + (p2.y - p0.y) / 2;
    }

    if(p0.equals(p1) && p1.equals(p2)) return;

    var t0 = new THREE.Vector2().subVectors(p1, p0);
    var t2 = new THREE.Vector2().subVectors(p2, p1);
    // console.log(t0.perpendicular());
    t0.perpendicular().normalize().multiplyScalar(width);

    t2.perpendicular().normalize().multiplyScalar(width);


    // if(signedArea(p0, p1, p2) > 0){
    //     t0.negate(); t2.negate();
    // }

    var pintersect = lineIntersection(
        new THREE.Vector2().addVectors(p0, t0),
        new THREE.Vector2().addVectors(p1, t0),
        new THREE.Vector2().addVectors(p2, t2),
        new THREE.Vector2().addVectors(p1, t2)
    );

    // console.log(pintersect);

    var anchor = null;
    var anchorLength = Number.MAX_VALUE;
    if(pintersect){
        anchor = pintersect.clone().sub(p1);
        anchorLength = anchor.length();
    }

    var dd = (anchorLength/width) | 0;
    var p0p1 = new THREE.Vector2().subVectors(p0, p1);
    var p0p1Length = p0p1.length();
    var p1p2 = new THREE.Vector2().subVectors(p1, p2);
    var p1p2Length = p1p2.length();

    if(anchorLength > p0p1Length || anchorLength > p1p2Length){
        __pushVert(verts, uvs, p0.x + t0.x, p0.y + t0.y, 2 * 0 + 0, startUvValue, uvRate); // p0+t0
        __pushVert(verts, uvs, p0.x - t0.x, p0.y - t0.y, 2 * 0 + 1, startUvValue, uvRate); // p0-t0
        __pushVert(verts, uvs, p1.x + t0.x, p1.y + t0.y, 2 * 1 + 0, startUvValue, uvRate); // p1+t0
        __pushVert(verts, uvs, p0.x - t0.x, p0.y - t0.y, 2 * 0 + 1, startUvValue, uvRate); // p0-t0
        __pushVert(verts, uvs, p1.x + t0.x, p1.y + t0.y, 2 * 1 + 0, startUvValue, uvRate); // p1+t0
        __pushVert(verts, uvs, p1.x - t0.x, p1.y - t0.y, 2 * 1 + 1, startUvValue, uvRate); // p1-t0

        // if (join === 2 /* ROUND */) {
        //     createRoundCap(p1, cc.math.Vector.add(p1, t0), cc.math.Vector.add(p1, t2), p2, verts);
        // }
        // else if (join === 0 /* BEVEL */ || (join === 1 /* MITER */ && dd >= miterLimit)) {
        //     __pushVert(verts, uvs, p1.x, p1.y); // p1
        //     __pushVert(verts, uvs, p1.x + t0.x, p1.y + t0.y); // p1+t0
        //     __pushVert(verts, uvs, p1.x + t2.x, p1.y + t2.y); // p1+t2
        // }
        // else if (join === 1 /* MITER */ && dd < miterLimit && pintersect) {
        //     __pushVert(verts, uvs, p1.x + t0.x, p1.y + t0.y  , 2 * 1 + 0, startUvValue, uvRate); // p1+t0
        //     __pushVert(verts, uvs, p1.x, p1.y                , 2 * 1 + 0, startUvValue, uvRate); // p1
        //     __pushVert(verts, uvs, pintersect.x, pintersect.y, 2 * 1 + 0, startUvValue, uvRate); // pintersect
        //     __pushVert(verts, uvs, p1.x + t2.x, p1.y + t2.y  , 2 * 1 + 0, startUvValue, uvRate); // p1+t2
        //     __pushVert(verts, uvs, p1.x, p1.y                , 2 * 1 + 0, startUvValue, uvRate); // p1
        //     __pushVert(verts, uvs, pintersect.x, pintersect.y, 2 * 1 + 0, startUvValue, uvRate); // pintersect
        // }

        __pushVert(verts, uvs, p2.x + t2.x, p2.y + t2.y, 2 * 2 + 0, startUvValue, uvRate); // p2+t2
        __pushVert(verts, uvs, p1.x - t2.x, p1.y - t2.y, 2 * 1 + 1, startUvValue, uvRate); // p1-t2
        __pushVert(verts, uvs, p1.x + t2.x, p1.y + t2.y, 2 * 1 + 0, startUvValue, uvRate); // p1+t2
        __pushVert(verts, uvs, p2.x + t2.x, p2.y + t2.y, 2 * 2 + 0, startUvValue, uvRate); // p2+t2
        __pushVert(verts, uvs, p1.x - t2.x, p1.y - t2.y, 2 * 1 + 1, startUvValue, uvRate); // p1-t2
        __pushVert(verts, uvs, p2.x - t2.x, p2.y - t2.y, 2 * 2 + 1, startUvValue, uvRate); // p2-t2
    }else{
        __pushVert(verts, uvs, p0.x + t0.x, p0.y + t0.y        , 2 * 0 + 0, startUvValue, uvRate); // p0+t0
        __pushVert(verts, uvs, p0.x - t0.x, p0.y - t0.y        , 2 * 0 + 1, startUvValue, uvRate); // p0-t0
        __pushVert(verts, uvs, p1.x - anchor.x, p1.y - anchor.y, 2 * 1 + 1, startUvValue, uvRate); // p1-anchor

        __pushVert(verts, uvs, p0.x + t0.x, p0.y + t0.y        , 2 * 0 + 0, startUvValue, uvRate); // p0+t0
        __pushVert(verts, uvs, p1.x - anchor.x, p1.y - anchor.y, 2 * 1 + 1, startUvValue, uvRate); // p1-anchor
        __pushVert(verts, uvs, p1.x + t0.x, p1.y + t0.y        , 2 * 1 + 0, startUvValue, uvRate);


        // if (join === 2 /* ROUND */) {
        //     var _p0 = cc.math.Vector.add(p1, t0);
        //     var _p1 = cc.math.Vector.add(p1, t2);
        //     var _p2 = cc.math.Vector.sub(p1, anchor);
        //     var center = p1;
        //     __pushVert(verts, _p0.x, _p0.y); // _p0
        //     __pushVert(verts, center.x, center.y); // center
        //     __pushVert(verts, _p2.x, _p2.y); // _p2
        //     createRoundCap(center, _p0, _p1, _p2, verts);
        //     __pushVert(verts, center.x, center.y); // center
        //     __pushVert(verts, _p1.x, _p1.y); // _p1
        //     __pushVert(verts, _p2.x, _p2.y); // _p2
        // }
        // else {
        //     if (join === 0 /* BEVEL */ || (join === 1 /* MITER */ && dd >= miterLimit)) {
        //         __pushVert(verts, p1.x + t0.x, p1.y + t0.y); // p1+t0
        //         __pushVert(verts, p1.x + t2.x, p1.y + t2.y); // p1+t2
        //         __pushVert(verts, p1.x - anchor.x, p1.y - anchor.y); // p1-anchor
        //     }
        //     if (join === 1 /* MITER */ && dd < miterLimit) {
        //         __pushVert(verts, uvs, pintersect.x, pintersect.y      , 2 * 1 + 0, startUvValue, uvRate);// pintersect
        //         __pushVert(verts, uvs, p1.x + t0.x, p1.y + t0.y        , 2 * 1 + 0, startUvValue, uvRate);// p1+t0
        //         __pushVert(verts, uvs, p1.x + t2.x, p1.y + t2.y        , 2 * 1 + 0, startUvValue, uvRate);// p1+t2
        //         __pushVert(verts, uvs, p1.x - anchor.x, p1.y - anchor.y, 2 * 1 + 1, startUvValue, uvRate);// p1-anchor
        //         __pushVert(verts, uvs, p1.x + t0.x, p1.y + t0.y        , 2 * 1 + 0, startUvValue, uvRate);// p1+t0
        //         __pushVert(verts, uvs, p1.x + t2.x, p1.y + t2.y        , 2 * 1 + 0, startUvValue, uvRate);// p1+t2
        //     }
        // }

        __pushVert(verts, uvs, p2.x + t2.x, p2.y + t2.y        , 2 * 2 + 0, startUvValue, uvRate);  // p2+t2
        __pushVert(verts, uvs, p1.x - anchor.x, p1.y - anchor.y, 2 * 1 + 1, startUvValue, uvRate);  // p1-anchor
        __pushVert(verts, uvs, p1.x + t2.x, p1.y + t2.y        , 2 * 1 + 0, startUvValue, uvRate);  // p1+t2
        __pushVert(verts, uvs, p2.x + t2.x, p2.y + t2.y        , 2 * 2 + 0, startUvValue, uvRate);  // p2+t2
        __pushVert(verts, uvs, p1.x - anchor.x, p1.y - anchor.y, 2 * 1 + 1, startUvValue, uvRate);  // p1-anchor
        __pushVert(verts, uvs, p2.x - t2.x, p2.y - t2.y        , 2 * 2 + 1, startUvValue, uvRate);  // p2-t2
    }


}

function makeGeometry(verts, uvs){
    // console.log(verts);
    var geometry = new THREE.BufferGeometry();
    var indices = [];

    for(var ii = 0; ii < verts.length; ii += 3){
        indices.push(parseInt(ii/3));
    }

    verts = new Float32Array(verts);
    geometry.addAttribute("position", new THREE.BufferAttribute(verts, 3));
    uvs = new Float32Array(uvs);
    geometry.addAttribute("uv", new THREE.BufferAttribute(uvs, 2));


    if(brushMesh){
        brushMesh.geometry = geometry;
    }else{
        var mat2;

        if(isDebug) mat2 = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true,transparent : true, side : THREE.DoubleSide });
        else mat2 = new THREE.MeshBasicMaterial({ map : texture ,transparent : true, side : THREE.DoubleSide });

        var mesh2 = new THREE.Mesh(geometry, mat2);

        scene.add(mesh2);

        brushMesh = mesh2;
    }


    // var mat = new THREE.MeshBasicMaterial({ wireframe : true, map : texture});
    // var mat = new THREE.MeshBasicMaterial({ wireframe: true, color : 0xff0000 });
    // var mesh = new THREE.Mesh(geometry, mat);

    // scene.add(mesh)

    // var testMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), mat2);
    // testMesh.position.set(-300, 200, 0);
    // scene.add(testMesh);

}

function __pushVert(verts, uvs, px, py, uvId, uvStartValue, uvRate ){
    // debugDraw(px, py);
    verts.push(px);
    verts.push(py);
    verts.push(0);

    var uvX = parseInt(uvId/2)/2 * uvRate + uvStartValue;
    var uvY = (uvId % 2);

    uvs.push(uvX);
    uvs.push(uvY);

    // debug
    if(!isDebug){
        var div = document.createElement('div');
        div.style.position = "absolute";
        div.style.top  = (window.innerHeight/2 - py) + "px";
        div.style.left = (window.innerWidth/2 + px) + 'px';
        div.style.color = "#0000ff";
        div.innerHTML = "(" + parseInt(uvX * 100)/100 + ", " + parseInt(uvY * 100)/100 + " )";
        document.body.appendChild(div);
    }

}

function debugDraw( xx, yy ){
    var geo = new THREE.PlaneBufferGeometry(2, 2);
    var mat = new THREE.MeshBasicMaterial({color: 0x000000});
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set( xx, yy, 0);
    scene.add(mesh);
}


function lineIntersection( p0, p1, p2, p3 ){
    var a0 = p1.y - p0.y;
    var a0 = p1.y - p0.y;
    var b0 = p0.x - p1.x;
    var a1 = p3.y - p2.y;
    var b1 = p2.x - p3.x;

    var det = a0 * b1 - a1 * b0;
    var EPSILON = 0.0001;

    if (det > -EPSILON && det < EPSILON) {
        return null;
    }else {
        var c0 = a0 * p0.x + b0 * p0.y;
        var c1 = a1 * p2.x + b1 * p2.y;
        var x = (b1 * c0 - b0 * c1) / det;
        var y = (a0 * c1 - a1 * c0) / det;
        return new THREE.Vector2(x, y);
    }
}

function signedArea(p0, p1, p2){
    var p0x = p0.x, p0y = p0.y, p1x = p1.x, p1y = p1.y, p2x = p2.x, p2y = p2.y;

    return (p1x - p0x) * (p2y - p0y) - (p2x - p0x) * (p1y - p0y);
}

function animate() {
    renderer.render(scene, camera);

    raf(animate);
}

function onMouseDown(ev){
    isMouseDown = true;
    mouseArr.push([]);
}

var mouse = new THREE.Vector2(-9999, -9999);

function onMouseMove(ev){
    if (isMouseDown) {
        counter++;

        var dis = mouse.distanceTo(new THREE.Vector2(ev.clientX - window.innerWidth / 2, -ev.clientY + window.innerHeight / 2));

        if ( dis > 30) {
            mouse = new THREE.Vector2(ev.clientX - window.innerWidth / 2, -ev.clientY + window.innerHeight / 2);
            // var mouse = new THREE.Vector2(ev.clientX - window.innerWidth / 2, 0);
            mouseArr[mouseArr.length-1].push(mouse);
            createGeometry();

            // drawLine();
        }
    }
}

function drawLine(){
    var curMouseNum = mouseArr.length - 1;
    var mousePositions = mouseArr[curMouseNum];
    // console.log(mousePositions);

    if(mousePositions.length > 1){

        console.log('??');
        var curMousePosition = mousePositions[mousePositions.length-1];
        var prevMousePosition = mousePositions[mousePositions.length-2];
        var theta = Math.atan2( (curMousePosition.y - prevMousePosition.y), curMousePosition.x - prevMousePosition.x );

        // console.log(theta);
        // theta = 0;

        var pos00 = prevMousePosition.clone().addScaledVector(new THREE.Vector2(Math.cos(theta + Math.PI/2), Math.sin(theta + Math.PI/2) ), lineWidth);
        var pos01 = prevMousePosition.clone().addScaledVector(new THREE.Vector2(Math.cos(theta - Math.PI/2), Math.sin(theta - Math.PI/2) ), lineWidth);
        var pos10 = curMousePosition.clone().addScaledVector(new THREE.Vector2(Math.cos(theta + Math.PI/2), Math.sin(theta + Math.PI/2) ), lineWidth);
        var pos11 = curMousePosition.clone().addScaledVector(new THREE.Vector2(Math.cos(theta - Math.PI/2), Math.sin(theta - Math.PI/2) ), lineWidth);




        var indices = [];

        var bufferSize = 4;
        var vertices = new Float32Array(bufferSize * 3);

        var verticeArr = [pos00, pos01, pos10, pos11];
        var verticeNum = 0;
        for(var ii = 0; ii < bufferSize; ii++){
            vertices[verticeNum++] = verticeArr[ii].x;
            vertices[verticeNum++] = verticeArr[ii].y;
            vertices[verticeNum++] = 0; //this.height/this.heightSegment * yy;

            var geo = new THREE.PlaneBufferGeometry(3, 3);
            var mat = new THREE.MeshBasicMaterial({color: 0x00ff00});
            var mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(verticeArr[ii].x, verticeArr[ii].y, 0);
            scene.add(mesh);

        }


        var indices = [0, 1, 2, 2, 1, 3];
        indices = new Uint32Array(indices);
        var bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

        var vertexAttribute = new THREE.BufferAttribute(vertices, 3);
        bufferGeometry.addAttribute('position', vertexAttribute);

        var mesh = new THREE.Mesh(bufferGeometry, new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}));
        scene.add(mesh);
    }

}

function onMouseUp(ev){
    isMouseDown = false;
}

document.body.addEventListener('mousedown', onMouseDown);
document.body.addEventListener('mouseup', onMouseUp);
document.body.addEventListener('mousemove', onMouseMove);

init();