"use strict";

var _ = require('underscore');
var TweenMax = require('gsap');
var size = require('size');
var VideoTexture = require('./video-texture');
var utils = require('./utils');
require('./HorizontalBlurShader');
require('./VerticalBlurShader');
require('./OutputAddShader')

var VideoMask = function(opts){
    _.bindAll(this, 'onResize', 'onVideoReady');
    
    opts = opts ? opts : {};
    console.log(opts.image);

    this.camera = new THREE.OrthographicCamera( size.width / - 2, size.width / 2, size.height / 2, size.height / - 2, 1, 10000 );
    this.camera.position.z = 10;
    
    this.renderer = new THREE.WebGLRenderer({alpha: true, devicePixelRatio: window.devicePixelRatio || 1});
    this.renderer.setSize( size.width, size.height );
    
    if(opts.parent) opts.parent.appendChild(this.renderer.domElement);
    else            document.body.appendChild(this.renderer.domElement);

    var videoFiles = opts.videoFiles ? opts.videoFiles : {
        "mp4" : "assets/video/video.mp4",
        "ogv" : "assets/video/video.ogv"
    };

    this.videoTexture  = new VideoTexture({files : videoFiles, muted : true})
    this.videoTexture.eventDispatcher.addEventListener("textuer:ready", this.onVideoReady);
    this.videoScene = new THREE.Scene();

    this.textTexture = new THREE.Texture(opts.image);
    this.textTexture.needsUpdate = true;
    this.textTexture.minFilter = THREE.LinearFilter

    this.baseRenderer = new THREE.WebGLRenderTarget( size.width, size.height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
    this.blurTexture1 = new THREE.WebGLRenderTarget( size.width, size.height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
    this.blurTexture2 = new THREE.WebGLRenderTarget( size.width, size.height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
    this.textRenderer = new THREE.WebGLRenderTarget( size.width, size.height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );

    this.effectPlane = new THREE.PlaneGeometry(2, 2);
    this.verticalBlurMat = new THREE.ShaderMaterial(
        THREE.VerticalBlurShader
    )
    this.horizontalBlurMat = new THREE.ShaderMaterial(
        THREE.HorizontalBlurShader
    )
    this.effectCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10000);
    this.effectCamera.position.z = 10;
    this.effectScene = new THREE.Scene();
    this.effectMesh = new THREE.Mesh(this.effectPlane);
    this.effectScene.add(this.effectMesh);

    this.textScene = new THREE.Scene();
    this.textPlane = new THREE.PlaneBufferGeometry(opts.image.width, opts.image.height);

    this.textMesh = new THREE.Mesh(this.textPlane, new THREE.MeshBasicMaterial({map : this.textTexture, transparent : true}));
    this.textScene.add(this.textMesh);
    this.renderer.render(this.textScene, this.camera, this.textRenderer);

    this.outputMat = new THREE.ShaderMaterial(
        THREE.OutputAddBlur
    )


    if(opts.isDebug) this.isDebug = true;
    else             this.isDebug = false;

    if(this.isDebug) this.createDebug()

    this.clock = new THREE.Clock();

}

_.extend(VideoMask.prototype, {
    createDebug : function(){
        this.stats = new Stats();

        document.body.appendChild(this.stats.domElement);
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0";
        this.stats.domElement.style.left = "0";

        var gui = new GUI();
        gui.add(this.verticalBlurMat.uniforms.v, "value", 0, 1/128);
        gui.add(this.horizontalBlurMat.uniforms.h, "value", 0, 1/128);
    },
    start : function(){
        size.addListener(this.onResize);
        this.isPlay = true;
        this.clock.start();
        TweenMax.ticker.addEventListener('tick', this.update, this);
    },
    onVideoReady : function(){
        this.videoTexture.eventDispatcher.removeEventListener("textuer:ready", this.onVideoReady);
        var mat = new THREE.MeshBasicMaterial({map : this.videoTexture, side : THREE.DoubleSide });

        var videoPlane = new THREE.PlaneGeometry( this.videoTexture.video.width, this.videoTexture.video.height);
        this.videoMesh = new THREE.Mesh(videoPlane, mat);
        var sizes = utils.fitImage(size.width, size.height, this.videoTexture.video.width, this.videoTexture.video.height);
        var scale = sizes.w / this.videoTexture.video.width;
        this.videoMesh.scale.set(scale, scale, scale);

        this.videoScene.add(this.videoMesh);
        this.videoTexture.start();
    },
    update : function(){
        this.stats.update();
        var delta = this.clock.getElapsedTime();

        this.videoTexture.updateTexture();
        this.renderer.render(this.videoScene, this.camera, this.baseRenderer);
        this.horizontalBlurMat.uniforms.tDiffuse.value = this.baseRenderer.texture;
        this.effectMesh.material = this.horizontalBlurMat;
        this.renderer.render(this.effectScene, this.effectCamera, this.blurTexture1);
        this.verticalBlurMat.uniforms.tDiffuse.value = this.blurTexture1.texture;;
        this.effectMesh.material = this.verticalBlurMat;
        this.renderer.render(this.effectScene, this.effectCamera, this.blurTexture2);

        this.outputMat.uniforms.tDiffuse.value = this.baseRenderer.texture;
        this.outputMat.uniforms.tBlur.value = this.blurTexture2.texture;
        this.outputMat.uniforms.tText.value = this.textRenderer.texture;
        this.outputMat.uniforms.uTime.value += delta;
        this.effectMesh.material = this.outputMat;
        this.renderer.render(this.effectScene, this.effectCamera);
    },
    resume : function(){
        this.isPlay = !this.isPlay;
        if(this.isPlay) TweenMax.ticker.addEventListener('tick', this.update, this);
        else            TweenMax.ticker.removeEventListener('tick', this.update, this);
    },
    destroy : function(){
        if(this.isPlay) TweenMax.ticker.removeEventListener('tick', this.update, this);
        this.videoTexture.destroy();

        this.textPlane.dispose();
        this.effectPlane.dispose();
        this.videoMesh.geometry.dispose();

        this.horizontalBlurMat.dispose();
        this.verticalBlurMat.dispose();
        this.outputMat.dispose();

        this.baseRenderer.dispose();
        this.blurTexture1.dispose();
        this.blurTexture2.dispose();
        this.textRenderer.dispose();

        this.renderer.dispose();
    },
    onResize : function(){
        this.renderer.setSize( size.width, size.height );

        this.camera.left   = size.width / - 2;
        this.camera.right  = size.width / 2;
        this.camera.top    = size.height / 2;
        this.camera.bottom = size.height / - 2;
        this.camera.updateProjectionMatrix();

        this.baseRenderer.setSize(size.width, size.height);
        this.blurTexture1.setSize(size.width, size.height);
        this.blurTexture2.setSize(size.width, size.height);
        this.textRenderer.setSize(size.width, size.height);

        this.renderer.render(this.textScene, this.camera, this.textRenderer);

        if(this.videoMesh){
            var sizes = utils.fitImage(size.width, size.height, this.videoTexture.video.width, this.videoTexture.video.height);
            var scale = sizes.w / this.videoTexture.video.width;
            this.videoMesh.scale.set(scale, scale, scale);
        }
    }
})

module.exports = VideoMask;