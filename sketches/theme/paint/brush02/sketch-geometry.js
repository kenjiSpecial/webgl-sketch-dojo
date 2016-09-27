export default class SketchGeometry extends THREE.Geometry {
    constructor() {
        super();
        
        this.quadVerts = [];
        this.quadUVs = [];
        this.vertIndex = 0;
        this.quadCount = 0;
        
        
    }
    updateGeometry( xx, yy ){
        
    }
}