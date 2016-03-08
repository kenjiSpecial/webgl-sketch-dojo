export default class CustomGeometry extends THREE.BufferGeometry {
    constructor() {
        super();

        this.gridSize = 10;
        this.radius = 7;
        this.ring = (this.gridSize + this.gridSize) * 2;

        var cornerVertices = 8;
        var edgeVertices = (this.gridSize + this.gridSize + this.gridSize - 3) * 4;
        var faceVertices = 2 * ( (this.gridSize - 1) * (this.gridSize - 1) + (this.gridSize - 1) * (this.gridSize - 1) + (this.gridSize - 1) * (this.gridSize - 1) );
        var verticesLength = cornerVertices + edgeVertices + faceVertices;

        var vertices = []; //new Float32Array( verticesLength * 3 );
        var uvArr = [];
        //this.vertexArray = [];
        //this.nomalizeArray = [];

        var vv = 0;
        var xx, zz, yy;

        for (yy = 0; yy <= this.gridSize; yy++) {
            for (xx = 0; xx <= this.gridSize; xx++) vv = this.setVertex( vv, vertices, xx, yy, 0, uvArr);

            // -------------

            for (zz = 1; zz <= this.gridSize; zz++) vv = this.setVertex(vv, vertices, this.gridSize, yy, zz, uvArr);

            // -------------

            for (xx = this.gridSize - 1; xx >= 0; xx--) vv = this.setVertex(vv, vertices, xx, yy, this.gridSize, uvArr);

            // -------------

            for (zz = this.gridSize - 1; zz > 0; zz--) vv = this.setVertex(vv, vertices, 0, yy, zz, uvArr);
        }

        for(zz = 1; zz < this.gridSize; zz++)
            for( xx = 1; xx < this.gridSize; xx++)
                vv = this.setVertex(vv, vertices, xx, this.gridSize, zz, uvArr);

        for(zz = 1; zz < this.gridSize; zz++)
            for( xx = 1; xx < this.gridSize; xx++)
                vv = this.setVertex(vv, vertices, xx, 0, zz, uvArr);

        vertices = new Float32Array(vertices);
        uvArr = new Float32Array(uvArr);
        this.vertices = vertices;

        var indices = [];
        var indexNum = 0;

        var ind = 0;

        for(var yy = 0; yy < this.gridSize; yy++) {
            for (var ii = 0; ii < this.ring - 1; ii++) {
                indexNum = CustomGeometry.setQuad(indices, indexNum, ind, ind + 1, ind + this.ring, ind + this.ring + 1);
                ind++;
            }

            indexNum = CustomGeometry.setQuad(indices, indexNum,  ind, ind - this.ring + 1, ind + this.ring, ind +  1 );
            ind++;
        }

        indexNum = this.createTopRings( indices, indexNum, this.ring );
        indexNum = this.createBottomFace( indices, indexNum, this.ring );

        indices = new Uint32Array(indices);
        this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
        this.vertexAttribute = new THREE.BufferAttribute(vertices, 3);
        this.uvAttribute = new THREE.BufferAttribute(uvArr, 2);
        this.addAttribute('position', this.vertexAttribute);
        this.addAttribute('uv', this.uvAttribute);

        this.computeFaceNormals();
        this.computeVertexNormals();    // requires correct face normals
    }

    setVertex( vv, vertices, xx, yy, zz, uvArr ){
        var v = new THREE.Vector3(
            xx * 2 / this.gridSize - 1,
            yy * 2 / this.gridSize - 1,
            zz * 2 / this.gridSize - 1
        );

        var x2 = v.x * v.x;
        var y2 = v.y * v.y;
        var z2 = v.z * v.z;
        var s = new THREE.Vector3();
        s.x = v.x * Math.sqrt(1 - y2 / 2 - z2 / 2 + y2 * z2 / 3);
        s.y = v.y * Math.sqrt(1 - x2 / 2 - z2 / 2 + x2 * z2 / 3);
        s.z = v.z * Math.sqrt(1 - x2 / 2 - y2 / 2 + x2 * y2 / 3);

        var uvU = 0.5 - Math.atan2(s.x, s.z)/(Math.PI )
        var uvV = 0.5 + Math.asin(s.y)/(Math.PI);

        uvArr.push(uvU);
        uvArr.push(uvV);

        var normal = s;

        vertices[vv]   = s.x * this.radius;
        vertices[vv+1] = s.y * this.radius;
        vertices[vv+2] = s.z * this.radius;


        if(!this.velocityArray) this.velocityArray = [];
        if(!this.vertexArray) this.vertexArray = [];
        if(!this.originalVertexArray) this.originalVertexArray = [];

        this.vertexArray.push(new THREE.Vector3(vertices[vv], vertices[vv+1], vertices[vv+2]));
        this.originalVertexArray.push(new THREE.Vector3(vertices[vv], vertices[vv+1], vertices[vv+2]));
        this.velocityArray.push(new THREE.Vector3());



        return vv + 3
    }

    createTopRings( indices, indexNum, ring ){
        var v = this.ring * this.gridSize;
        for(var xx = 0; xx < this.gridSize - 1; xx++, v++){
            indexNum  = CustomGeometry.setQuad(indices, indexNum, v, v + 1, v + ring - 1, v + ring);
        }

        indexNum  = CustomGeometry.setQuad(indices, indexNum, v, v + 1, v + ring - 1, v + 2);

        var vMin = ring * (this.gridSize + 1) - 1;
        var vMid = vMin + 1;
        var vMax = v + 2;


        for (var z = 1; z < this.gridSize - 1; z++, vMin--, vMid++, vMax++){
            indexNum = CustomGeometry.setQuad(indices, indexNum, vMin, vMid, vMin - 1, vMid + this.gridSize - 1);
            for (var x = 1; x < this.gridSize - 1; x++, vMid++) {
                indexNum = CustomGeometry.setQuad(indices, indexNum, vMid, vMid + 1, vMid + this.gridSize - 1, vMid + this.gridSize);
            }
            indexNum = CustomGeometry.setQuad(indices, indexNum, vMid, vMax, vMid + this.gridSize - 1, vMax + 1);
        }

        var vTop = vMin - 2;
        indexNum = CustomGeometry.setQuad(indices, indexNum, vMin, vMid, vMin - 1, vMin - 2);

        for (var x = 1; x < this.gridSize - 1; x++, vTop--, vMid++) {
            indexNum = CustomGeometry.setQuad(indices, indexNum, vMid, vMid + 1, vTop, vTop - 1);
        }

        indexNum = CustomGeometry.setQuad( indices, indexNum, vMid, vTop - 2, vTop, vTop - 1);

        return indexNum;
    }

    createBottomFace( indices, indexNum, ring ){
        var v = 1;
        var vMid = this.vertices.length /3- (this.gridSize - 1) * (this.gridSize - 1);

        indexNum = CustomGeometry.setQuad(indices, indexNum, ring - 1, vMid, 0, 1);
        for (var x = 1; x < this.gridSize - 1; x++, v++, vMid++) {
            indexNum = CustomGeometry.setQuad(indices, indexNum, vMid, vMid + 1, v, v + 1);
        }
        indexNum = CustomGeometry.setQuad(indices, indexNum, vMid, v + 2, v, v + 1);


        var vMin = ring - 2;
        vMid -= this.gridSize - 2;
        var vMax = v + 2;

        for (var z = 1; z < this.gridSize - 1; z++, vMin--, vMid++, vMax++) {
            indexNum = CustomGeometry.setQuad(indices, indexNum, vMin, vMid + this.gridSize - 1, vMin + 1, vMid);
            for (var x = 1; x < this.gridSize - 1; x++, vMid++) {
                indexNum = CustomGeometry.setQuad( indices, indexNum, vMid + this.gridSize - 1, vMid + this.gridSize, vMid, vMid + 1);
            }
            indexNum = CustomGeometry.setQuad(indices, indexNum, vMid + this.gridSize - 1, vMax + 1, vMid, vMax);
        }


        var vTop = vMin - 1;
        indexNum = CustomGeometry.setQuad(indices, indexNum, vTop + 1, vTop, vTop + 2, vMid);
        for (var x = 1; x < this.gridSize - 1; x++, vTop--, vMid++) {
            indexNum = CustomGeometry.setQuad(indices, indexNum, vTop, vTop - 1, vMid, vMid + 1);
        }
        indexNum = CustomGeometry.setQuad(indices, indexNum, vTop, vTop - 1, vMid, vTop - 2);

        return indexNum;
    }

    static setQuad( indices, ii, v00, v10, v01, v11) {
        indices[ii] = v00;
        indices[ii + 1] = indices[ii + 4] = v01;
        indices[ii + 2] = indices[ii + 3] = v10;
        indices[ii + 5] = v11;
        return ii + 6;
    }

    updateLoop(dt) {
        /**
         this.triangles.forEach(function(triangle){
            triangle.updateLoop(dt, this.verticesAttribute);
        }.bind(this));
         this.verticesAttribute.needsUpdate = true;
         */
        var damping = 8;
        var springForce = -1.2;

        this.vertexArray.forEach(function(vertex, index){

            var velocity = this.velocityArray[index]

            var dispalcement =  new THREE.Vector3( vertex.x - this.originalVertexArray[index].x,
                                                   vertex.y - this.originalVertexArray[index].y,
                                                   vertex.z - this.originalVertexArray[index].z);
            velocity.addScaledVector(dispalcement, springForce);
            velocity.multiplyScalar(1 - damping * dt);

            vertex.x += velocity.x * dt;
            vertex.y += velocity.y * dt;
            vertex.z += velocity.z * dt;

            //Vector3 displacement = displacedVertices[i] - originalVertices[i];
            //velocity -= displacement * springForce * Time.deltaTime;
            //vertexVelocities[i] = velocity;

            this.vertexAttribute.setXYZ(index, vertex.x, vertex.y, vertex.z);
        }.bind(this));

        this.vertexAttribute.needsUpdate = true;

    }
    updateInteractive(point, dt){
        var force = 200;


        //console.log(point);
        this.vertexArray.forEach(function(vertex, index){
            //if(index == 0)console.log(vertex);

            var pointToVertex = new THREE.Vector3(vertex.x - point.x, vertex.y - point.y, vertex.z - point.z);
            var pointLength = pointToVertex.length();
            var attenuatedForce = force / (1 + pointLength);
            var velocity = attenuatedForce * dt;
            //if(index == 0) console.log(velocity);


            this.velocityArray[index].x += velocity * pointToVertex.x;
            this.velocityArray[index].y += velocity * pointToVertex.y;
            this.velocityArray[index].z += velocity * pointToVertex.z;

        }.bind(this));

    }
    customClick(){
        this.vertexArray.forEach(function(vertex, index){
            var randomForce = 50 + 50 * Math.random();
            var tekito = new THREE.Vector3(Math.random()-0.5,Math.random()-0.5, Math.random()-0.5 ).normalize().multiplyScalar(randomForce );

            this.velocityArray[index].x += tekito.x;
            this.velocityArray[index].y += tekito.y;
            this.velocityArray[index].z += tekito.z;


        }.bind(this));
    }

}