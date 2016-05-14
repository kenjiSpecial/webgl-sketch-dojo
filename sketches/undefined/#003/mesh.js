import CustomGeometry from "./geometry";
var glslify = require('glslify');

export default class Mesh extends THREE.Mesh {
    constructor(textures, xx, yy, length ) {

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
        var size, margin;
        if(window.isTablet){
            size = 32;
            margin = 3;
        }else{
            size = 54;
            margin = 6;
        }
        super(new THREE.PlaneGeometry(size, size), material);
        this.position.set( (size + margin) * xx, (size + margin) * yy, 0 );
        var scaleX = xx/length*2; //(xx )/length*2 + 0.1;
        var scaleY = yy/length*2; //(yy)/length*2 + 0.1;
        
        this.xId = scaleX;
        this.yId = scaleY;

        this.initTarget = [
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
        var speed = (Math.sqrt(scaleX * scaleX + scaleY * scaleY)) * 8
        this.initSpeed = speed;
        this.targetUniforms.forEach(function(targetUnifrom, index){
            // index = 0;
            targetUnifrom.value.x = this.target[index][0];
            targetUnifrom.value.y = this.target[index][1];
            targetUnifrom.value.z = this.target[index][2];
            this.increments[index] = [ speed, speed, speed ];
        }.bind(this));

        TweenLite.to(this.material.uniforms.hoverState, 1.2, {value: 0, ease: Quint.easeInOut});
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
    
    onPlay(item){
        this.isPlay = true;
        var dX = item.xId - this.xId;
        var dY = item.yId - this.yId;
        var dis = Math.sqrt(dX * dX + dY * dY);

        var speed = (dis)* 8.0;
        for(var ii = 0; ii < this.target.length; ii++){
            this.increments[ii] = [ speed, speed, speed ];
        }

        TweenLite.killTweensOf(this.material.uniforms.playState);
        // TweenLite.killTweensOf(this);
        TweenLite.to(this.material.uniforms.playState, 0.8, {value: 1, ease: Quint.easeOut});
    }
    
    onPause(item){
        this.isPlay = false;
        var dX = item.xId - this.xId;
        var dY = item.yId - this.yId;
        var dis = Math.sqrt(dX * dX + dY * dY);

        this.tempTarget = [];


        for(var ii = 0; ii < this.target.length; ii++){
            this.tempTarget[ii] = [];
            for(var jj = 0; jj < 3; jj++ ){
                this.tempTarget[ii][jj] = this.target[ii][jj];
            }
            // this.increments[ii] = [ this.initSpeed, this.initSpeed, this.initSpeed ];
        }
        this.tweenRate = 0;
        TweenLite.to(this, 0.6 + dis, {tweenRate: 1, onUpdate: this.onUpdateTweenRate, onUpdateScope: this})

        TweenLite.killTweensOf(this.material.uniforms.playState);
        TweenLite.to(this.material.uniforms.playState, 0.8, {value: 0, ease: Quint.easeOut});
    }

    onClick(){
        this.isPlay = !this.isPlay;

        var value;
        if(this.isPlay) {
            // value = 1;
            this.dispatchEvent({type: "play", item: this})
        }
        else            {
            // value = 0;


            this.dispatchEvent({type: "pause", item: this})
        }

        // TweenLite.killTweensOf(this.material.uniforms.playState);
        // TweenLite.to(this.material.uniforms.playState, 0.8, {value: value, ease: Quint.easeOut});
    }

    onUpdateTweenRate(){
        this.targetUniforms.forEach(function(targetUnifrom, index){
            this.target[index][0] = this.initTarget[index][0] * this.tweenRate + this.tempTarget[index][0] * (1 - this.tweenRate);
            this.target[index][1] = this.initTarget[index][1] * this.tweenRate + this.tempTarget[index][1] * (1 - this.tweenRate)
            this.target[index][2] = this.initTarget[index][2] * this.tweenRate + this.tempTarget[index][2] * (1 - this.tweenRate)

            targetUnifrom.value.x = this.target[index][0];
            targetUnifrom.value.y = this.target[index][1];
            targetUnifrom.value.z = this.target[index][2];
        }.bind(this));
    }

    onOut(){
        
        TweenLite.killTweensOf(this.material.uniforms.hoverState);
        TweenLite.to(this.material.uniforms.hoverState, 1.2, {value: 0, ease: Quint.easeInOut});
    }

    onOver(){
        TweenLite.killTweensOf(this.material.uniforms.hoverState);
        TweenLite.to(this.material.uniforms.hoverState, 0.6, {value: 1, ease: Quint.easeOut});
    }

}