var glslify = require('glslify');

export default class Mat extends THREE.ShaderMaterial {
    constructor(tex) {

        var uniforms = {
            tMap: {
                type: "t",
                value: tex
            }
        };

        super({
            uniforms: uniforms,
            vertexShader: glslify("./shader/shader.vert"),
            fragmentShader: glslify("./shader/shader.frag")
        });

        this.side = THREE.DoubleSide;
        this.depthWrite = false

        this.uniforms = uniforms;
    }
}
