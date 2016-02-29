import CustomGeometry from "./geometry";
import CustomMat from "./mat"

export default class Mesh extends THREE.Mesh {
    constructor(index, texture){
        super( new CustomGeometry(index, texture.image.width, texture.image.height ), new CustomMat(texture));
        this.isNormal = true;
    }
    updateLoop(dt){
        this.geometry.updateLoop(dt);
    }
    backToInitState(){
        this.geometry.backToInitState();
    }
    backToWall(){
        this.geometry.backToWall();
    }
    animate(){
        this.isNormal = !this.isNormal;
        if(this.isNormal){
            this.backToInitState();
        }else{
            this.backToWall();
        }
    }
}