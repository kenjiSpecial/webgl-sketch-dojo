var raf = require('raf');

var loopId, scene, camera;
var width = window.innerWidth, height = window.innerHeight;
var renderer;
var lineSize = 40;
var texture;
var materialTex;
var brushMesh;
var loader = new THREE.TextureLoader();
var isMouseDown;
var mouseArr = [];

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

init();

function init(){
    scene = new THREE.Scene();


    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, devicePixelRatio: window.devicePixelRatio });
    renderer.setPixelRatio ( window.devicePixelRatio  )
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xaaaaaa);
    document.body.appendChild(renderer.domElement);

    loader.load('assets/brushes/brush.png', function(_texture){
        texture = _texture;
        texture.minFilter = THREE.LinearFilter;

        materialTex = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: texture, transparent: true } );

        actionQuads(posExampleArr);

    })

    // actionQuads(posExampleArr);

    loopId = raf(animate);
}

function actionQuads(pathArr){
    var merged = new THREE.Geometry();

    var previousVertex = new THREE.Vector3(pathArr[0][0], pathArr[0][1], 0);

    var quadVerts = [];
    var quadUVs = [];
    var vertIndex = 0;
    var quadCount = 0;

    var facing = new THREE.Vector3();
    pathArr.forEach(function(vert, index){
        var curVertex = new THREE.Vector3(vert[0], vert[1], 0);
        facing.set(0, 0, 0).subVectors(curVertex, previousVertex);
        var moveLength = facing.length();
        facing.divideScalar(moveLength);

        if(moveLength < 1.0) return;

        var rightTan = new THREE.Vector3( -facing.y, facing.x, 0).multiplyScalar(lineSize * 0.5);
        var quadCenter = curVertex.clone().add(previousVertex).multiplyScalar(0.5);
        var quadForward = facing.clone().multiplyScalar( moveLength * 0.5 );

        var verts = generateQuadVerts( quadCenter, quadForward, rightTan);
        var uvs = [ new THREE.Vector2( 0,0 ), new THREE.Vector2( 0,0 ), new THREE.Vector2( 0,0 ), new THREE.Vector2( 0,0 ), new THREE.Vector2( 0,0 ), new THREE.Vector2( 0,0 ) ];

        quadVerts.push(verts);
        quadUVs.push(uvs);

        merged.vertices.push(...verts);

        var faceA = new THREE.Face3( vertIndex    , vertIndex+1, vertIndex+2);
        var faceB = new THREE.Face3( vertIndex + 3, vertIndex+4, vertIndex+5);
        merged.faces.push(faceA);
        merged.faces.push(faceB);

        vertIndex += 6;


        if( quadCount > 1 ){

            const lastQuad = quadVerts[ quadCount - 2 ];
            const currQuad = quadVerts[ quadCount - 1 ];
            const nextQuad = verts;

            for( let i=0; i<6; i++ ){
                currQuad[ i ].copy( lastQuad[ i ].clone().add( nextQuad[ i ] ) ).multiplyScalar( 0.5 );
            }

            fuseQuads( lastQuad, currQuad );
            fuseQuads( currQuad, nextQuad );
        }

        previousVertex = curVertex.clone();

        quadCount++;
    })


    updateUVs( quadVerts, quadUVs);

    const collectedUvs = [];
    quadUVs.forEach( function( uvset ){
        collectedUvs.push( uvset.slice( 0, 3 ) );
        collectedUvs.push( uvset.slice( 3, 6 ) );
    });
    merged.faceVertexUvs = [ collectedUvs ];

    var mat = new THREE.MeshBasicMaterial({color : 0xffff00, side : THREE.DoubleSide, wireframe : true })

    merged.computeBoundingSphere();
    
    if(brushMesh){
        brushMesh.geometry = merged;
    }else{
        var mesh = new THREE.Mesh(merged, materialTex);
        scene.add(mesh);
        brushMesh = mesh;
    }
    

}

function updateUVsForSegment(quadVerts, quadUVs, quadLengths){
    let fYStart = 0.0;
    let fYEnd   = 1.0;

    const totalLength = quadLengths.reduce(function(total, length){
        return total + length;
    }, 0);

    let currentLength = 0.0;
    quadUVs.forEach(function(uvs, index){
        const segmentLength = quadLengths[index];
        const fXStart = currentLength / totalLength;
        const fXEnd   =  (currentLength + segmentLength)/ totalLength;
        currentLength += segmentLength;

        uvs[ 0 ].set( fXStart, fYStart );
        uvs[ 1 ].set( fXEnd  , fYStart );
        uvs[ 2 ].set( fXStart, fYEnd );
        uvs[ 3 ].set( fXStart, fYEnd );
        uvs[ 4 ].set( fXEnd  , fYStart );
        uvs[ 5 ].set( fXEnd  , fYEnd );
    });

}

function quadLength(quadVerts){
    var fTopLength    = quadVerts[0].distanceTo(quadVerts[1]);
    var fBottomLength =  quadVerts[0].distanceTo(quadVerts[1]);
    return (fTopLength + fBottomLength) * 0.5;
}

function updateUVs( quadVerts, quadUVs ){
    var quadLengths = quadVerts.map(quadLength);
    updateUVsForSegment(quadVerts, quadUVs, quadLengths)
}

function fuseQuads( lastVerts, nextVerts) {
    const vTopPos = lastVerts[1].clone().add( nextVerts[0] ).multiplyScalar( 0.5 );
    const vBottomPos = lastVerts[5].clone().add( nextVerts[2] ).multiplyScalar( 0.5 );

    lastVerts[1].copy( vTopPos );
    lastVerts[4].copy( vTopPos );
    lastVerts[5].copy( vBottomPos );
    nextVerts[0].copy( vTopPos );
    nextVerts[2].copy( vBottomPos );
    nextVerts[3].copy( vBottomPos );
}

function generateQuadVerts( center, forward, right ){
    var verts = [];
    verts.push(center.clone().sub(forward).sub(right));
    verts.push(center.clone().add(forward).sub(right));
    verts.push(center.clone().sub(forward).add(right));

    verts.push(center.clone().sub(forward).add(right));
    verts.push(center.clone().add(forward).sub(right));
    verts.push(center.clone().add(forward).add(right))

    return verts;

}

function onMouseDown(ev){
    isMouseDown = true;
    mouseArr.push([]);
}

var mouse = new THREE.Vector2(-9999, -9999);

function onMouseMove(ev){
    if (isMouseDown) {
        var dis = mouse.distanceTo(new THREE.Vector2(ev.clientX - window.innerWidth / 2, -ev.clientY + window.innerHeight / 2));
        
        if(dis > 5){
            mouse = new THREE.Vector2(ev.clientX - window.innerWidth / 2, -ev.clientY + window.innerHeight / 2);
            // var mouse = new THREE.Vector2(ev.clientX - window.innerWidth / 2, 0);
            mouseArr[mouseArr.length-1].push([mouse.x, mouse.y]);

            // createGeometry();
            actionQuads(mouseArr[mouseArr.length-1]);
        }
    }
}

function onMouseUp(ev){
    isMouseDown = false;
}

document.body.addEventListener('mousedown', onMouseDown);
document.body.addEventListener('mouseup', onMouseUp);
document.body.addEventListener('mousemove', onMouseMove);



function animate(){
    renderer.render(scene, camera);

    loopId = raf(animate);
}