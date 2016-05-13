import CustomGeometry from "./geometry";

export default class Mesh extends THREE.Mesh {
    constructor(){


        super( new CustomGeometry({width: 200, height: 200, widthSegment : 4, heightSegment: 1 }), new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, side: THREE.DoubleSide }));
        
    }
    updateLoop(dt){
        // this.geometry.updateLoop(dt);
    }

}