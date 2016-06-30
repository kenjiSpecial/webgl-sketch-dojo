export default class CustomGeometry extends THREE.BufferGeometry {
    constructor(opts) {
        super();

        this.width  = opts.width || 128;
        this.height = opts.height || 128;

        this.widthSegment = opts.widthSegment || 2;
        this.heightSegment = opts.heightSegment || 2;
        this.halfwidthSegment = this.widthSegment/2;
        this.halfheightSegment = this.heightSegment/2;
        // console.log(this.width);
        // console.log(this.height);
        // console.log(this.widthSegment);
        // console.log(this.heightSegment);

        this.bufferSize = (this.widthSegment +1)* (this.heightSegment + 1);

        var verticeNum = 0;
        var uvNum = 0;
        var vertices = new Float32Array(this.bufferSize * 3 )
        var barycentric = new Float32Array(this.bufferSize * 3 );
        var uvs      = new Float32Array(this.bufferSize * 2 )

        var count = 0;
        var countJudge = 0;

        for(var yy = 0; yy < this.heightSegment + 1; yy++){
            if(yy%3 == 0){
                countJudge = 0;
            }else if(yy%3 == 1){
                countJudge = 2;
            }else{
                countJudge = 1;
            }

            for(var xx = 0; xx < this.widthSegment + 1; xx++){
                vertices[verticeNum++] = this.width/this.widthSegment * xx - this.width/2;
                vertices[verticeNum++] = this.height/this.heightSegment * yy - this.height/2;
                vertices[verticeNum++] = 0; //this.height/this.heightSegment * yy;

                uvs[uvNum++] = xx/this.widthSegment;
                uvs[uvNum++] = yy/this.heightSegment;


                if(countJudge % 3 == 0){
                    barycentric[count * 3] = 1;
                    barycentric[count * 3 + 1] = 0;
                    barycentric[count * 3 + 2] = 0;
                }else if(countJudge % 3 == 1){
                    barycentric[count * 3] = 0;
                    barycentric[count * 3 + 1] = 1;
                    barycentric[count * 3 + 2] = 0;
                }else if(countJudge % 3 == 2){
                    barycentric[count * 3] = 0;
                    barycentric[count * 3 + 1] = 0;
                    barycentric[count * 3 + 2] = 1;
                }

                count++;
                countJudge++;
            }
        }



        var indices = [];
        var indexNum = 0;
        var indexNum2 = 0;
        var ind = 0;

        for(var yy = 0; yy < this.heightSegment; yy++){
            for(var xx = 0; xx < this.widthSegment ; xx++){
                indexNum = CustomGeometry.setQuad(indices, indexNum, ind, ind + 1, ind + this.widthSegment + 1, ind + this.widthSegment + 2);
                ind++;
            }
        ind++
        }

        indices = new Uint32Array(indices);
        this.setIndex(new THREE.BufferAttribute(indices, 1));
        this.vertexAttribute = new THREE.BufferAttribute(vertices, 3);
        this.addAttribute('position', this.vertexAttribute);

        this.uvAttribute = new THREE.BufferAttribute(uvs, 2);
        this.addAttribute('uv', this.uvAttribute);

        this.barycentricAttribute = new THREE.BufferAttribute(barycentric, 3);
        this.addAttribute('barycentric', this.barycentricAttribute);

    }

    static setQuad( indices, ii, v00, v10, v01, v11) {
        indices[ii] = v00;
        indices[ii + 1] = indices[ii + 4] = v01;
        indices[ii + 2] = indices[ii + 3] = v10;
        indices[ii + 5] = v11;
        return ii + 6;
    }
    
    static setBarycentric( indices, ii, v00, v10, v01, v11 ){
        
        return ii + 6;
    }


}