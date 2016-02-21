var SnowField = require('./snow-field');
import SnowMesh from "./snow-mesh";


export default class  snowWrapperObject extends THREE.Object3D {
    constructor(){
        super();

        this.time = 0;

        this.snowField = new SnowField();
        this.add(this.snowField);

        this.snowMesh = new SnowMesh();
        this.add(this.snowMesh);

    }
    update(dt){
        this.time += dt * 1.5;

        this.position.y = Math.cos(this.time) * 12;

        this.snowField.update(dt);
        this.snowMesh.update(dt);
    }
}