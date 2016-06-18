import CustomGeometry from "./geometry";
var glslify = require('glslify');

export default class Mesh extends THREE.Mesh {
    constructor(){
        var unitWidth = 120;
        var unitHeight = 90;
        var material = new THREE.ShaderMaterial({
            uniforms : {
                uTime : {value : 0},
                uSize : {value : new THREE.Vector2(unitWidth, unitHeight)},
                shaderValue : {value: 5}
            },
            vertexShader : glslify('./shader/shader.vert'),
            fragmentShader : glslify('./shader/shader4.frag'),
            transparent : true,
            side: THREE.DoubleSide

        })
        material.extensions.derivatives = true;
        super( new CustomGeometry({width: unitWidth, height: unitHeight, widthSegment : 5, heightSegment: 4 }), material );
        this.rotation.x = Math.PI/2;

        this.unitWidth = unitWidth;
        this.unitHeight = unitHeight;
    }
    updateLoop(dt){
        this.material.uniforms.uTime.value += dt;
        // this.geometry.updateLoop(dt);
    }
    updateShader(data){
        this.material.uniforms.shaderValue.value = data.shaderValue;
    }

}