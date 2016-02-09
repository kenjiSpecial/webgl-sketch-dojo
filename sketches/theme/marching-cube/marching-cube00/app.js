require('./marching-cubes-data');

var raf = require('raf');
var createCaption = require('../../../dom/caption');

var scene, camera, renderer;
var light;
var id;
var stats, wrapper;
var effect;
var resolution, numBlobs;
var mat;
var size;

var points = [];
var values = [];

var isAnimation = true;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.copy(camera.position);
    scene.add(light);

    /**
     resolution = 24;
     numBlobs = 10;
     var scale = 60;
     mat = new THREE.MeshPhongMaterial({color: 0xeeeeee, specular: 0x111111, shininess: 1, shading: THREE.FlatShading});
     effect = new THREE.MarchingCubes(resolution, mat, true, true);
     effect.position.set(0, 0, 0);
     effect.scale.set(scale, scale, scale);
     scene.add(effect); */

    addMesh();
    setComponent();


    raf(animate);
}

function addMesh() {
    var axisMin = -10;
    var axisMax = 10;
    var axisRange = axisMax - axisMin;

    // Generate a list of 3D points and values at those points
    for (var k = 0; k < size; k++) {
        for (var j = 0; j < size; j++) {
            for (var i = 0; i < size; i++) {
                // actual values
                var x = axisMin + axisRange * i / (size - 1);
                var y = axisMin + axisRange * j / (size - 1);
                var z = axisMin + axisRange * k / (size - 1);
                points.push(new THREE.Vector3(x, y, z));
                /**
                 var mat = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide });
                 var geo = new THREE.PlaneBufferGeometry(1, 1);
                 var mesh = new THREE.Mesh(geo, mat);
                 mesh.position.x = x * 10;
                 mesh.position.y = y * 10;
                 mesh.position.z = z * 10;
                 scene.add(mesh);
                 */
                var value = x * x + y * y - z * z - 25;
                values.push(value);
            }
        }
    }

    // marching cubes algorithm

    size = 20;
    var size2 = size * size;

    // Vertices may occur along edges of cube, when the values at the edge's endpoints
    //   straddle the isolevel value.
    // Actual position along edge weighted according to function values.

    var vlist = [];

    var geometry = new THREE.Geometry();
    var vertexIndex = 0;
    console.log('call');

    for (var k = 0; k < size; k++)
        for (var j = 0; j < size; j++)
            for (var i = 0; i < size; i++) {
                // actual values
                var x = axisMin + axisRange * i / (size - 1);
                var y = axisMin + axisRange * j / (size - 1);
                var z = axisMin + axisRange * k / (size - 1);
                points.push(new THREE.Vector3(x, y, z));
                var value = x * x + y * y - z * z - 25;
                values.push(value);
            }

    // Marching Cubes Algorithm

    var size2 = size * size;

    // Vertices may occur along edges of cube, when the values at the edge's endpoints
    //   straddle the isolevel value.
    // Actual position along edge weighted according to function values.
    var vlist = new Array(12);

    var geometry = new THREE.Geometry();
    var vertexIndex = 0;

    for (var z = 0; z < size - 1; z++)
        for (var y = 0; y < size - 1; y++)
            for (var x = 0; x < size - 1; x++) {
                // index of base point, and also adjacent points on cube
                var p = x + size * y + size2 * z,
                    px = p + 1,
                    py = p + size,
                    pxy = py + 1,
                    pz = p + size2,
                    pxz = px + size2,
                    pyz = py + size2,
                    pxyz = pxy + size2;

                // store scalar values corresponding to vertices
                var value0 = values[p],
                    value1 = values[px],
                    value2 = values[py],
                    value3 = values[pxy],
                    value4 = values[pz],
                    value5 = values[pxz],
                    value6 = values[pyz],
                    value7 = values[pxyz];

                // place a "1" in bit positions corresponding to vertices whose
                //   isovalue is less than given constant.

                var isolevel = 0;

                var cubeindex = 0;
                if (value0 < isolevel) cubeindex |= 1;
                if (value1 < isolevel) cubeindex |= 2;
                if (value2 < isolevel) cubeindex |= 8;
                if (value3 < isolevel) cubeindex |= 4;
                if (value4 < isolevel) cubeindex |= 16;
                if (value5 < isolevel) cubeindex |= 32;
                if (value6 < isolevel) cubeindex |= 128;
                if (value7 < isolevel) cubeindex |= 64;

                // bits = 12 bit number, indicates which edges are crossed by the isosurface
                var bits = THREE.edgeTable[cubeindex];

                // if none are crossed, proceed to next iteration
                if (bits === 0) continue;

                // check which edges are crossed, and estimate the point location
                //    using a weighted average of scalar values at edge endpoints.
                // store the vertex in an array for use later.
                var mu = 0.5;

                // bottom of the cube
                if (bits & 1) {
                    mu = ( isolevel - value0 ) / ( value1 - value0 );
                    vlist[0] = points[p].clone().lerp(points[px], mu);
                }
                if (bits & 2) {
                    mu = ( isolevel - value1 ) / ( value3 - value1 );
                    vlist[1] = points[px].clone().lerp(points[pxy], mu);
                }
                if (bits & 4) {
                    mu = ( isolevel - value2 ) / ( value3 - value2 );
                    vlist[2] = points[py].clone().lerp(points[pxy], mu);
                }
                if (bits & 8) {
                    mu = ( isolevel - value0 ) / ( value2 - value0 );
                    vlist[3] = points[p].clone().lerp(points[py], mu);
                }
                // top of the cube
                if (bits & 16) {
                    mu = ( isolevel - value4 ) / ( value5 - value4 );
                    vlist[4] = points[pz].clone().lerp(points[pxz], mu);
                }
                if (bits & 32) {
                    mu = ( isolevel - value5 ) / ( value7 - value5 );
                    vlist[5] = points[pxz].clone().lerp(points[pxyz], mu);
                }
                if (bits & 64) {
                    mu = ( isolevel - value6 ) / ( value7 - value6 );
                    vlist[6] = points[pyz].clone().lerp(points[pxyz], mu);
                }
                if (bits & 128) {
                    mu = ( isolevel - value4 ) / ( value6 - value4 );
                    vlist[7] = points[pz].clone().lerp(points[pyz], mu);
                }
                // vertical lines of the cube
                if (bits & 256) {
                    mu = ( isolevel - value0 ) / ( value4 - value0 );
                    vlist[8] = points[p].clone().lerp(points[pz], mu);
                }
                if (bits & 512) {
                    mu = ( isolevel - value1 ) / ( value5 - value1 );
                    vlist[9] = points[px].clone().lerp(points[pxz], mu);
                }
                if (bits & 1024) {
                    mu = ( isolevel - value3 ) / ( value7 - value3 );
                    vlist[10] = points[pxy].clone().lerp(points[pxyz], mu);
                }
                if (bits & 2048) {
                    mu = ( isolevel - value2 ) / ( value6 - value2 );
                    vlist[11] = points[py].clone().lerp(points[pyz], mu);
                }

                // construct triangles -- get correct vertices from triTable.
                var i = 0;
                cubeindex <<= 4;  // multiply by 16...
                // "Re-purpose cubeindex into an offset into triTable."
                //  since each row really isn't a row.

                // the while loop should run at most 5 times,
                //   since the 16th entry in each row is a -1.
                while (THREE.triTable[cubeindex + i] != -1) {
                    var index1 = THREE.triTable[cubeindex + i];
                    var index2 = THREE.triTable[cubeindex + i + 1];
                    var index3 = THREE.triTable[cubeindex + i + 2];

                    geometry.vertices.push(vlist[index1].clone());
                    geometry.vertices.push(vlist[index2].clone());
                    geometry.vertices.push(vlist[index3].clone());
                    var face = new THREE.Face3(vertexIndex, vertexIndex + 1, vertexIndex + 2);
                    geometry.faces.push(face);

                    geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]);

                    vertexIndex += 3;
                    i += 3;
                }
            }

    //geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var colorMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff, side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(geometry, colorMaterial);
    var scale = 3;
    mesh.scale.set(scale, scale, scale);
    scene.add(mesh);

}

function setComponent() {
    var title = '';
    var caption = '';
    var url = '';

    wrapper = createCaption(title, caption, url);
    wrapper.style.width = (window.innerWidth / 2 - 50) + "px";
    wrapper.style.position = "absolute";
    wrapper.style.top = '50px';
    wrapper.style.left = '30px';

    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '30px';
    stats.domElement.style.left = '30px';
    stats.domElement.style.zIndex = 9999;

    document.body.appendChild(stats.domElement);
}

function animate() {
    console.log('ani');
    //stats.begin();


    renderer.render(scene, camera);

    stats.update();
}

window.addEventListener('keydown', function (ev) {
    if (ev.keyCode == 27) {
        if (isAnimation) raf.cancel(id);
        else    id = raf(animate);

        isAnimation = !isAnimation;
    }
});

init();