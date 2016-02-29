import Triangle from "./triangle"

export default class CustomGeometry extends THREE.BufferGeometry {
    constructor( parentIndex, width, height){
        super();

        this.xSize = width/50 ;
        this.ySize = height/50;

        this.halfX = this.xSize/2;
        this.halfY = this.ySize/2;
        this.bufferSize = (this.xSize +1)* (this.ySize + 1);

        var vertices = new Float32Array(this.bufferSize * 3 * 6);
        this.triangles = [];

        var uvs = new Float32Array(this.bufferSize * 2 * 6);
        //var indices = new Uint32Array(this.xSize * this.ySize * 2 * 3);

        var uvNum = 0;
        var index = 0;
        for(var yy = 0; yy < this.ySize; yy++){
            for(var xx = 0; xx < this.xSize; xx++){
                this.triangles.push(new Triangle( parentIndex, index++, xx - this.halfX, yy - this.halfY, xx - this.halfX, yy + 1 - this.halfY, xx + 1 - this.halfX, yy - this.halfY));
                this.triangles.push(new Triangle( parentIndex, index++, xx + 1 - this.halfX, yy + 1-this.halfY, xx + 1- this.halfX, yy-this.halfY, xx- this.halfX, yy + 1-this.halfY));

                uvs[uvNum++] = xx/this.xSize;
                uvs[uvNum++] = yy/this.ySize;

                uvs[uvNum++] = xx/this.xSize;
                uvs[uvNum++] = (yy+1)/this.ySize;

                uvs[uvNum++] = (xx + 1)/this.xSize;
                uvs[uvNum++] = yy/this.ySize;

                uvs[uvNum++] = (xx + 1)/this.xSize;
                uvs[uvNum++] = (yy + 1)/this.ySize;

                uvs[uvNum++] = (xx + 1)/this.xSize;
                uvs[uvNum++] = yy/this.ySize;

                uvs[uvNum++] = (xx)/this.xSize;
                uvs[uvNum++] = (yy + 1)/this.ySize;
            }
        }

        this.verticesAttribute = new THREE.BufferAttribute(vertices, 3);
        this.addAttribute('position', this.verticesAttribute);

        this.uvAttribute = new THREE.BufferAttribute(uvs, 2);
        this.addAttribute('uv', this.uvAttribute);
    }

    updateLoop(dt){
        this.triangles.forEach(function(triangle){
            triangle.updateLoop(dt, this.verticesAttribute);
        }.bind(this));
        this.verticesAttribute.needsUpdate = true;
    }

    backToInitState(){
        this.triangles.forEach(function(triangle){
            //triangle.updateLoop(dt, this.verticesAttribute);
            triangle.backToInitState();
        }.bind(this));
    }

    backToWall(){
        this.triangles.forEach(function(triangle){
            //triangle.updateLoop(dt, this.verticesAttribute);
            triangle.backToWall();
        }.bind(this));
    }
}