var glslify = require('glslify');

export default class OpticalFlowMaterial extends THREE.ShaderMaterial {
    constructor(opts) {
        var uniforms = {
            uTexture : {value: null},
            uPreviousTexture : {value: null},
            uResolution : {value : new THREE.Vector2(opts.width, opts.height)},
            uOffset : {value : 1.0},
            uLambda : {value : 0.0}
        };

        super({
            uniforms: uniforms, vertexShader: glslify("./shaders/shader.vert"), fragmentShader: glslify("./shaders/shader.frag"),
            depthTest : false,
            transparent : true,
            side : THREE.DoubleSide
        })
    }
    updateShader(texture){
        this.uniforms.uTexture.value = texture;
        // this.uniforms.uPreviousTexture.value = this.previousTexture;


        // this.previousTexture = texture;
    }
}