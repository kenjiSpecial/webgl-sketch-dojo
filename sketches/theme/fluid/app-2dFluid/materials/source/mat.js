var glslify = require('glslify');

export default class CustomShaderMaterial extends THREE.ShaderMaterial {
    constructor(){
        var uniforms = {
            samp : {
                type : "t",
                value : null
            },
            samp2 : {
                type  : "t",
                value : null
            }
        }

        super({ uniforms : uniforms, vertexShader : glslify("../pass.vert"), fragmentShader: glslify("./shader.frag")});
    }
}