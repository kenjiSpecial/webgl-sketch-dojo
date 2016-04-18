/**
 * Created by kenjisaito on 2/18/16.
 */

var glslify = require('glslify');

export default class PointShaderMaterial extends THREE.ShaderMaterial{
    constructor(){

        var uniforms = {
            tMap : {
                type : "t",
                value : null
            },
            uWindow : {
                type : "v2",
                value : new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
        };

        super({ uniforms : uniforms,  vertexShader : glslify("./shader/shader.vert"), fragmentShader: glslify("./shader/shader.frag") });
        this.uniforms = uniforms;
        this.transparent = true;
    }
}