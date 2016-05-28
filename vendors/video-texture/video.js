/**
 * codes are based on threex.videotexture
 * https://github.com/jeromeetienne/threex.videotexture
 */

export default class VideoTexture extends THREE.Texture{
	construtor(opts){
		this.available = navigator.webkitGetUserMedia || navigator.mozGetUserMedia ? true : false;
		console.assert(this.available === true)
		var videoWidth = opts.width || 320;
		var videoHeight = opts.height || 240;
		var video	= document.createElement('video');
		video.width = videoWidth;
		video.height = videoHeight;
		video.autoplay = true;
		video.loop = true;
		video.src	= opts.src;

		super(video);

		this.videoWidth = videoWidth;
		this.videoHeight = videoHeight;

	}
	updateTexture(){
		if( video.readyState !== video.HAVE_ENOUGH_DATA )	return;
		this.needsUpdate	= true;
	}
	destroy(){
		video.pause();
	}
}
