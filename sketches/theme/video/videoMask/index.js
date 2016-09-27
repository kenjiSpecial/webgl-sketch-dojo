"use strict";

var _ = require('underscore');
var TweenMax = require('gsap');
var size = require('size');



var VideoMask = function(opts){
    _.bindAll(this, 'onResize');
    
    opts = opts ? opts : {};
    
    this.camera = new THREE.OrthographicCamera( size.width / - 2, size.width / 2, size.height / 2, size.height / - 2, 1, 10000 );
    this.camera.position.z = 10;
    
    this.renderer = new THREE.WebGLRenderer({alpha: true, devicePixelRatio: window.devicePixelRatio || 1});
    
    if(opts.parent) opts.parent.appendChild(this.renderer.domElement);
    else            document.body.appendChild(this.renderer.domElement);
    
    videoTexture  = new VideoTexture({files : videoFiles})
    videoTexture.eventDispatcher.addEventListener("textuer:ready", onVideoReady);
    videoScene = new THREE.Scene();
    
}

_.extend(VideoMask.prototype, {
    start : function(){
        size.addListener(this.onResize);
        this.isPlay = true;
        TweenMax.ticker.addEventListener('tick', this.update, this);
    },
    update : function(){
        
    },
    resume : function(){
        this.isPlay = !this.isPlay;
        if(this.isPlay) TweenMax.ticker.addEventListener('tick', this.update, this);
        else            TweenMax.ticker.removeEventListener('tick', this.update, this);
    },
    destroy : function(){
        if(this.isPlay) TweenMax.ticker.removeEventListener('tick', this.update, this);
        
    },
    onResize : function(){
        this.camera.left   = size.width / - 2;
        this.camera.right  = size.width / 2;
        this.camera.top    = size.height / 2;
        this.camera.bottom = size.height / - 2;
        this.camera.updateProjectionMatrix();
    }
})

module.exports = VideoMask;