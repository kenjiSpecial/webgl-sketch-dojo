var glslify = require('glslify');

export default class CustomGeometry extends THREE.ShaderMaterial {
    constructor(){
        var uniforms = {
            uWindow : { type : "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            uC      : { type : "f", value: 0.001 },
            uTexture: { type: "t", value : null }
        }

        super({ uniforms : uniforms, vertexShader : glslify("../pass.vert"), fragmentShader: glslify("./shader.frag")});
    }
}