"use strict";

var _ = require('lodash');

import ThreeKiso from "three-kiso";
// import ModelBufferGeometry from "./modelBufferGeometry";


class TestGeo extends THREE.BufferGeometry {
    constructor() {
        super();

        this.width = 128;
        this.height = 128;
        this.count = 4;

        this.widthSegment = 2;
        this.heightSegment = 2;
        this.bufferSize = (this.widthSegment + 1) * (this.heightSegment + 1);

        var verticeNum = 0;
        var uvNum = 0;
        var vertices = new Float32Array(this.bufferSize * 3);
        var uvs = new Float32Array(this.bufferSize * 2);

        for (var yy = 0; yy < this.heightSegment + 1; yy++) {
            for (var xx = 0; xx < this.widthSegment + 1; xx++) {
                vertices[verticeNum++] = this.width / this.widthSegment * xx - this.width / 2;
                vertices[verticeNum++] = this.height / this.heightSegment * yy - this.height / 2;
                vertices[verticeNum++] = 0; //this.height/this.heightSegment * yy;

                uvs[uvNum++] = xx / this.widthSegment;
                uvs[uvNum++] = yy / this.heightSegment;
            }
        }

        var indices = [];
        this.prevIndices = [];
        var indexNum = 0;
        var ind = 0;

        for (var yy = 0; yy < this.heightSegment; yy++) {
            for (var xx = 0; xx < this.widthSegment; xx++) {
                indexNum = TestGeo.setQuad(indices, indexNum, ind, ind + 1, ind + this.widthSegment + 1, ind + this.widthSegment + 2);
                ind++;
            }
            ind++
        }
        indices.forEach((index)=> {
            this.prevIndices.push(index);
        });

        indices = new Uint32Array(indices);

        // this.setIndex(new THREE.BufferAttribute(indices, 1));
        // this.vertexAttribute = new THREE.BufferAttribute(vertices, 3);
        // this.addAttribute('position', this.vertexAttribute);
        //
        // this.uvAttribute = new THREE.BufferAttribute(uvs, 2);
        // this.addAttribute('uv', this.uvAttribute);

        this.addTriangle(vertices, uvs, indices)
    }

    addTriangle(_vertices, _uvs, _indices) {
        var vertices = [];
        var uvs = [];

        var prevVertices = [];//this.vertexAttribute.count;
        var prevUvs = [];

        // copy vertex, uvs
        _vertices.forEach((val) => {
            vertices.push(val);
        })
        _uvs.forEach((val) => {
            uvs.push(val);
        })


        // console.log(triangleNum);
        var triangleNum = _indices.length; //this.index.count;
        var index = 0;
        var vertexNum = vertices.length / 3;

        var indices = [];
        for (var ii = 0; ii < triangleNum / 3; ii++) {
            var pt0Num = _indices[ii * 3];
            var pt1Num = _indices[ii * 3 + 1];
            var pt2Num = _indices[ii * 3 + 2];

            var pt0X = vertices[pt0Num * 3];
            var pt0Y = vertices[pt0Num * 3 + 1];
            var pt0Z = vertices[pt0Num * 3 + 2];

            var pt1X = vertices[pt1Num * 3];
            var pt1Y = vertices[pt1Num * 3 + 1];
            var pt1Z = vertices[pt1Num * 3 + 2];

            var pt2X = vertices[pt2Num * 3];
            var pt2Y = vertices[pt2Num * 3 + 1];
            var pt2Z = vertices[pt2Num * 3 + 2];

            var centerX = (pt0X + pt1X + pt2X) / 3;
            var centerY = (pt0Y + pt1Y + pt2Y) / 3;
            var centerZ = (pt0Z + pt1Z + pt2Z) / 3;

            vertices.push(centerX);
            vertices.push(centerY);
            vertices.push(centerZ);

            uvs.push(centerX / this.width);
            uvs.push(centerY / this.height);

            var newIndexNum = vertexNum + ii;

            indices.push(pt0Num);
            indices.push(pt1Num);
            indices.push(newIndexNum);

            indices.push(pt1Num);
            indices.push(pt2Num);
            indices.push(newIndexNum);

            indices.push(pt2Num);
            indices.push(pt0Num);
            indices.push(newIndexNum);

        }

        this.count--;
        if (this.count == 0) {

            vertices = new Float32Array(vertices);
            uvs = new Float32Array(uvs);

            indices = new Uint32Array(indices);
            console.log(indices.length / 3);
            this.setIndex(new THREE.BufferAttribute(indices, 1));
            // this.index.needsUpdate = true;

            this.vertexAttribute = new THREE.BufferAttribute(vertices, 3);
            this.addAttribute('position', this.vertexAttribute);

            this.uvAttribute = new THREE.BufferAttribute(uvs, 2);
            this.addAttribute('uv', this.uvAttribute);
        } else {
            this.addTriangle(vertices, uvs, indices);
        }


        // console.log(this);

    }

    static setQuad(indices, ii, v00, v10, v01, v11) {
        indices[ii] = v00;
        indices[ii + 1] = indices[ii + 4] = v01;
        indices[ii + 2] = indices[ii + 3] = v10;
        indices[ii + 5] = v11;
        return ii + 6;
    }
}

var threeKiso = new ThreeKiso();

var testGeo = new TestGeo();
var mesh = new THREE.Mesh(testGeo, new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    wireframe: true
}));
threeKiso.add(mesh, 'mesh');

threeKiso.camera.position.set(0, 0, 200);
threeKiso.camera.lookAt(new THREE.Vector3());

setTimeout(()=> {
    // mesh.geometry.addTriangle();
    // mesh.geometry.verticesNeedUpdate = true;
    // mesh.geometry.elementsNeedUpdate = true;
    // mesh.geometry.morphTargetsNeedUpdate = true;
    // mesh.geometry.uvsNeedUpdate = true;
    // mesh.geometry.normalsNeedUpdate = true;
    // mesh.geometry.colorsNeedUpdate = true;
    // mesh.geometry.tangentsNeedUpdate = true;
    // mesh.geometry.verticesNeedUpdate = true;
    // mesh.geometry.dynamic = true;
    // mesh.geometry = testGeo;
}, 1000);