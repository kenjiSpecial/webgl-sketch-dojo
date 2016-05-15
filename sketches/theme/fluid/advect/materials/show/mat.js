var glslify = require('glslify');

export default class CustomGeometry extends THREE.ShaderMaterial {
    constructor(){
        var uniforms = {
            tDiffuse : { type : "t"}
        }

        super({ uniforms : uniforms, vertexShader : glslify("../pass.vert"), fragmentShader: glslify("./shader.frag")});
    }
    update(texture){
        this.uniforms.tDiffuse.value = texture;
        
    }
}