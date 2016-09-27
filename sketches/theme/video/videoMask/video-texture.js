var _ = require('underscore');
var THREE = require('three');

var VideoTexture = function(opts){
    THREE.Texture.call(this);
    
    _.bindAll(this, 'onVideoLoaded');
    
    this.eventDispatcher = new THREE.EventDispatcher;
    
    if(!opts.video){
        var video = document.createElement('video');
        for(var key in opts.files){
            var source = document.createElement("source");
            var path = opts.files[key];
            if(key == 'mp4'){
                source.type = "video/mp4";
                source.src = path;
                video.appendChild(source);
            }else if(key == "ogv" || key == "ogg"){
                source.type = "video/ogg";
                source.src = path;
                video.appendChild(source);
            }
        }
        this.video = video;
        video.addEventListener('loadeddata', this.onVideoLoaded);
        video.load();
    }else{
        this.video = video;
        this.onVideoLoaded();
    }

    if(opts.muted) this.video.muted = opts.muted;
    
    this.minFilter =  THREE.NearestFilter,
        this.magFilter = THREE.NearestFilter;
};

VideoTexture.prototype = Object.create(THREE.Texture.prototype);

VideoTexture.prototype.onVideoLoaded = function(){
    this.video.width = this.video.videoWidth;
    this.video.height = this.video.videoHeight;
    this.video.loop = true;
    
    this.image = this.video;
    this.needsUpdate = true;
    
    this.eventDispatcher.dispatchEvent({type: "textuer:ready"})
};

VideoTexture.prototype.start = function(){
    this.video.play();
}

VideoTexture.prototype.updateTexture = function(){
    if( this.video.readyState !== this.video.HAVE_ENOUGH_DATA )	return;
    //if( video.readyState !== video.HAVE_ENOUGH_DATA )	return;
    this.needsUpdate	= true;
}


VideoTexture.prototype.destroy = function(){
    this.video.pause();
    THREE.Texture.prototype.dispose.call(this);
}


module.exports = VideoTexture;