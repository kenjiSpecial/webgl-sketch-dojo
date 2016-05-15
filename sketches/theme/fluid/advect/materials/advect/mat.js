var glslify = require('glslify');

export default class CustomGeometry extends THREE.ShaderMaterial {
    constructor(){
        var uniforms = {
            uTime : { type : "f", value: 0},
            uDis  : { type : "f", value: 0},
            uWindow : {type : "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            uMouse   : {type : "v2", value: new THREE.Vector2(9999, 9999)},
            uTexture : {type : "t", value : null},
            uVelocity: {type : "t", value: null},
            uOriginTexture : {type : "t", value: null},
        }

        super({ uniforms : uniforms, vertexShader : glslify("../pass.vert"), fragmentShader: glslify("./shader.frag")});
    }
    
    updateMat(dt, texture, velocityTexture, originTexture, mouse, dis ){
        this.uniforms.uTexture.value = texture;
        this.uniforms.uVelocity.value = velocityTexture;
        this.uniforms.uOriginTexture.value = originTexture;
        if(mouse)this.uniforms.uMouse.value = mouse;
        if(dis) this.uniforms.uDis.value = dis|| 0;
        this.uniforms.uTime.value += 1/60;
    }
}