var glslify = require('glslify');

export default class ForceMat extends THREE.ShaderMaterial {
    constructor() {
        var uniforms = {
            uMouse: {
                value: new THREE.Vector2()
            },
            uPrevMouse: {
                value: new THREE.Vector2
            },
            uMouseDown: {
                value: false
            },
            uTexture: {
                value: null
            },
            uWindow : {
                value : new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
        }
        super({
            uniforms: uniforms, vertexShader: glslify("./pass.vert"), fragmentShader: glslify("./shader.frag"),
            depthTest : false,
            side : THREE.DoubleSide
        });
    }
}