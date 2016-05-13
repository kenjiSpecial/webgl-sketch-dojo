import CustomGeometry from "./geometry";
var glslify = require('glslify');

export default class Mesh extends THREE.Mesh {
    constructor(textures) {

        var material = new THREE.ShaderMaterial({
            uniforms: {
                playState : {type: "f", value: 1},
                hoverState : {type: "f", value: 1},
                outlineTexture : {type: "t", value : textures["outline"]},
                normalTexture : {type: "t", value : textures["normal"]},
                playTexture : {type: "t", value : textures["play"]},
                pauseTexture : {type: "t", value : textures["pause"]},
                color00 : {type: "v3", value : new THREE.Vector3()},
                color01 : {type: "v3", value : new THREE.Vector3()},
                color02 : {type: "v3", value : new THREE.Vector3()},
                color03 : {type: "v3", value : new THREE.Vector3()},
                color04 : {type: "v3", value : new THREE.Vector3()},
                color10 : {type: "v3", value : new THREE.Vector3()},
                color11 : {type: "v3", value : new THREE.Vector3()},
                color12 : {type: "v3", value : new THREE.Vector3()},
                color13 : {type: "v3", value : new THREE.Vector3()},
                color14 : {type: "v3", value : new THREE.Vector3()},
            },
            vertexShader: glslify('./shader.vert'),
            fragmentShader: glslify('./shader.frag'),
            side: THREE.DoubleSide,
            transparent : true
        });
        super(new CustomGeometry({width: 200, height: 200, widthSegment: 4, heightSegment: 1}), material);

        this.target = [
            [225, 220, 128],
            [252, 175, 69],
            [247, 119, 55],
            [245, 96, 64],
            [236, 72, 76],

            [225, 48, 108],
            [193, 53, 132],
            [131, 58, 180],
            [88, 81, 216],
            [5, 10, 230],
        ];
        
        this.isPlay = true;


        this.targetUniforms = [];
        this.targetUniforms.push(this.material.uniforms.color00);
        this.targetUniforms.push(this.material.uniforms.color01);
        this.targetUniforms.push(this.material.uniforms.color02);
        this.targetUniforms.push(this.material.uniforms.color03);
        this.targetUniforms.push(this.material.uniforms.color04);
        this.targetUniforms.push(this.material.uniforms.color10);
        this.targetUniforms.push(this.material.uniforms.color11);
        this.targetUniforms.push(this.material.uniforms.color12);
        this.targetUniforms.push(this.material.uniforms.color13);
        this.targetUniforms.push(this.material.uniforms.color14);

        this.increments = [];
        this.targetUniforms.forEach(function(targetUnifrom, index){
            // index = 0;
            targetUnifrom.value.x = this.target[index][0];
            targetUnifrom.value.y = this.target[index][1];
            targetUnifrom.value.z = this.target[index][2];
            this.increments[index] = [1, 1, 1];
        }.bind(this));
    }

    updateLoop(dt) {

        this.targetUniforms.forEach(function(targetUnifrom, index){
            // index = 0;
            if(!this.isPlay) return;
            
            this.target[index][0] = (this.target[index][0] + this.increments[index][0]) ;
            this.target[index][1] = (this.target[index][1] + this.increments[index][1]);
            this.target[index][2] = (this.target[index][2] + this.increments[index][2]);

            targetUnifrom.value.x = this.target[index][0];
            targetUnifrom.value.y = this.target[index][1];
            targetUnifrom.value.z = this.target[index][2];

            if(this.target[index][0] > 255 || this.target[index][0] < 0) this.increments[index][0] *= -1;
            if(this.target[index][1] > 255 || this.target[index][1] < 0) this.increments[index][1] *= -1;
            if(this.target[index][2] > 255 || this.target[index][2] < 0) this.increments[index][2] *= -1;
        }.bind(this));
        
    }

    onClick(){
        this.isPlay = !this.isPlay;

        var value;
        if(this.isPlay) value = 1;
        else            value = 0;

        TweenLite.killTweensOf(this.material.uniforms.playState);
        TweenLite.to(this.material.uniforms.playState, 0.8, {value: value, ease: Quint.easeInOut});
    }

    onOut(){
        TweenLite.killTweensOf(this.material.uniforms.hoverState);
        console.log("??");
        TweenLite.to(this.material.uniforms.hoverState, 1.2, {value: 0, ease: Quint.easeInOut});
    }

    onOver(){
        TweenLite.killTweensOf(this.material.uniforms.hoverState);
        TweenLite.to(this.material.uniforms.hoverState, 0.6, {value: 1, ease: Quint.easeOut});
    }

}