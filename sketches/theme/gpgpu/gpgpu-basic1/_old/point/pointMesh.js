import PointGeometry from "./particleGeometry";
import PointShaderMaterial from "./pointShaderMat";

export default class PointMesh  extends THREE.Points {
    constructor(gpgpuTex){
        super(new PointGeometry(gpgpuTex), new PointShaderMaterial());
    }
    update(tex){
       this.material.uniforms.tMap.value = tex;
    }
}