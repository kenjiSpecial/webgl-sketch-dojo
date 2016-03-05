
export default class CustomGeometry extends THREE.BufferGeometry {
    constructor(){
        super();

        this.xSize = 10; //width/50 ;
        this.ySize = 10; //height/50;
        this.zSize = 10;

        var vertexPositions = [
            [-1.0, -1.0,  1.0],
            [ 1.0, -1.0,  1.0],
            [ 1.0,  1.0,  1.0],

            [ 1.0,  1.0,  1.0],
            [-1.0,  1.0,  1.0],
            [-1.0, -1.0,  1.0]
        ];

        var vertexPositions = [
            [-1.0, -1.0,  1.0],
            [ 1.0, -1.0,  1.0],
            [ 1.0,  1.0,  1.0],

            [ 1.0,  1.0,  1.0],
            [-1.0,  1.0,  1.0],
            [-1.0, -1.0,  1.0]
        ];
        var vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex

        // components of the position vector for each vertex are stored
        // contiguously in the buffer.
        for ( var i = 0; i < vertexPositions.length; i++ )
        {
            vertices[ i*3 + 0 ] = vertexPositions[i][0];
            vertices[ i*3 + 1 ] = vertexPositions[i][1];
            vertices[ i*3 + 2 ] = vertexPositions[i][2];
        }


        this.verticesAttribute = new THREE.BufferAttribute(vertices, 3);
        this.addAttribute('position', this.verticesAttribute);

        /**
        this.uvAttribute = new THREE.BufferAttribute(uvs, 2);
        this.addAttribute('uv', this.uvAttribute);
        */
    }

    updateLoop(dt){
        /**
        this.triangles.forEach(function(triangle){
            triangle.updateLoop(dt, this.verticesAttribute);
        }.bind(this));
        this.verticesAttribute.needsUpdate = true;
         */
    }

}