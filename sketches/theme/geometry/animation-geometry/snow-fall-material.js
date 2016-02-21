/**
 * Created by kenjisaito on 2/18/16.
 */

var glslify = require('glslify');

export default class SnowFallMaterial extends THREE.ShaderMaterial{
    constructor(){

        var uniforms = {
            size : {
                type : "f",
                value : 15
            },
            tMap : {
                type : "t",
                value : null
            },
            tColor : {
                type: "t",
                value : null
            }
        };

        super({ uniforms : uniforms,  vertexShader : glslify("./shader/flake.vert"), fragmentShader: glslify("./shader/flake.frag") });

        this.uniforms = uniforms;

        this.textureLoader = new THREE.TextureLoader();
        this.textureLoader.load( "./assets/snow/particle.png", function( texture ){
            this.snowTexture = texture;
            this.snowTexture.wrapS = this.snowTexture.wrapT = THREE.RepeatWrapping;
            this.uniforms.tMap.value = this.snowTexture;
        }.bind(this));

        this.transparent = true;
        this.depthWrite = false;
        this.blending = THREE.AdditiveBlending;
    }
}