import CustomGeometry from "./geometry";

export default class Mesh extends THREE.Mesh {
    constructor(){
        super( new CustomGeometry(), new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, side: THREE.DoubleSide }));
        this.position.set( - this.geometry.xSize/2, - this.geometry.ySize/2, - this.geometry.zSize/2)
    }
    updateLoop(dt){
        this.geometry.updateLoop(dt);
    }

}