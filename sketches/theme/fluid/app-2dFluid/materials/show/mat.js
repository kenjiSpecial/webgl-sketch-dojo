var glslify = require('glslify');

export default class CustomGeometry extends THREE.ShaderMaterial {
    constructor(){
        var uniforms = {
            samp : {type : "t", value : null    }
        }

        super({ uniforms : uniforms, vertexShader : glslify("../pass.vert"), fragmentShader: glslify("./shader.frag")});
    }
}