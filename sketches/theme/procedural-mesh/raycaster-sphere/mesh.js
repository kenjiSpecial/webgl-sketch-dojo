import CustomGeometry from "./geometry";

export default class Mesh extends THREE.Mesh {
    constructor(tex){
        super( new CustomGeometry(), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: tex }));
        this.radius = this.geometry.radius;
        var self = this;
        //this.position.set( - this.geometry.grid/2, - this.geometry.grid/2, - this.geometry.grid/2);
    }
    updateLoop(obj, dt){
        if(obj && obj.object == this){
            //console.log(obj);
            var point = obj.point;
            point.x -= this.position.x;
            point.y -= this.position.y;

            this.geometry.updateInteractive(point, dt);
        }

        this.geometry.updateLoop(dt);
    }
    click(){
        this.geometry.customClick();
    }
}