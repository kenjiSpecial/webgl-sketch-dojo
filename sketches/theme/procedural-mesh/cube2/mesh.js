import CustomGeometry from "./geometry";
import CustomMaterial from "./material";

export default class Mesh extends THREE.Mesh {
    constructor(){
        super( new CustomGeometry(), new CustomMaterial() );
        this.position.set( - this.geometry.xSize/2,  0, - this.geometry.zSize/2)
    }
    updateLoop(dt){
        this.geometry.updateLoop(dt);
    }
    click(){
        this.geometry.click();
    }
}