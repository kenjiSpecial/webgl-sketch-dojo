/**
 * codes are based on threex.videotexture
 * https://github.com/jeromeetienne/threex.videotexture
 */
var _ = require('lodash');

export default class VideoTexture extends THREE.Texture{
	constructor(opts){
		super();
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

		this.minFilter =  THREE.NearestFilter,
        this.magFilter = THREE.NearestFilter;
	}
	onVideoLoaded(){
		this.video.width = this.video.videoWidth;
		this.video.height = this.video.videoHeight;
		this.video.loop = true;

		this.image = this.video;
		this.needsUpdate;

		this.eventDispatcher.dispatchEvent({type: "textuer:ready"})
	}
	start(){
		this.video.play();
	}
	updateTexture(){
		if( this.video.readyState !== this.video.HAVE_ENOUGH_DATA )	return;
		//if( video.readyState !== video.HAVE_ENOUGH_DATA )	return;
		this.needsUpdate	= true;
	}
	destroy(){
		this.video.pause();
	}
}
