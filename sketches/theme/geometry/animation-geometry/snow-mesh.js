import SnowFallGeometry from "./snow-fall-geometry";
import SnowFallMaterial from "./snow-fall-material";

export default class SnowMesh  extends THREE.Points {
    constructor(){
        super(new SnowFallGeometry(), new SnowFallMaterial());

        this.material.transparent = true;
    }
    update(dt){
        this.geometry.update(dt);
    }
}