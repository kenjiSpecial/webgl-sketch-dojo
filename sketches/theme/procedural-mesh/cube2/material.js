/**
 * Created by kenjisaito on 2/18/16.
 */

var glslify = require('glslify');

export default class SnowFallMaterial extends THREE.ShaderMaterial{
    constructor(){

        var uniforms = {
            fresnelBias : {
                type : "f",
                value : 0.5
            },
            fresnelScale : {
                type : "f",
                value : 1.0
            },
            fresnelPower : {
                type : "f",
                value : 3.0
            },
            color1 : {
                type : "v3",
                value : new THREE.Vector3(0.5, 0.5, 0.5)
            },
            color2 : {
                type : "v3",
                value : new THREE.Vector3(0.0, 0.0, 1.0)
            }
        };

        super({ uniforms : uniforms,  vertexShader : glslify("./shader/shader.vert"), fragmentShader: glslify("./shader/shader.frag") });

        this.uniforms = uniforms;

        this.transparent = true;
    }
}