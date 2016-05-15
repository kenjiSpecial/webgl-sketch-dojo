var glslify = require('glslify');

export default class CustomGeometry extends THREE.ShaderMaterial {
    constructor(){
        var uniforms = {
            uTime : { type : "f", value: 0},
            uScale : {type : "f", value: 30},
            uWindow : {type : "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)}
        }

        super({ uniforms : uniforms, vertexShader : glslify("../pass.vert"), fragmentShader: glslify("./shader.frag")});
    }
    update(dt){
        dt = dt || 0;
        this.uniforms.uTime.value += dt;
        // console.log(this.uniforms.uTime.value   );
        
    }
}