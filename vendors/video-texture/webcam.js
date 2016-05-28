/**
 * codes are based on threex.videotexture
 * https://github.com/jeromeetienne/threex.videotexture
 */

export default class CamTexture extends THREE.Texture{
	constructor(opts){
		var available = navigator.webkitGetUserMedia || navigator.mozGetUserMedia ? true : false;
		console.assert(available === true)
		var videoWidth = opts.width || 320;
		var videoHeight = opts.height || 240;
		var video	= document.createElement('video');
		video.width = videoWidth;
		video.height = videoHeight;
		video.autoplay = true;
		video.loop = true;

		super(video);
		this.availabe = true;

		this.eventDispatcher = new THREE.EventDispatcher;

		if( navigator.webkitGetUserMedia ){
			navigator.webkitGetUserMedia({video:true}, function(stream){
				video.src	= URL.createObjectURL(stream);
				this.eventDispatcher.dispatchEvent({type: "textuer:ready"})
			}.bind(this), function(error){
				alert('you got no WebRTC webcam');
			});
		}else if(navigator.mozGetUserMedia){
			navigator.mozGetUserMedia({video:true}, function(stream){
				video.src	= URL.createObjectURL(stream);
				this.eventDispatcher.dispatchEvent({type: "textuer:ready"})
			}.bind(this), function(error){
				alert('you got no WebRTC webcam');
			});
		}else	console.assert(false)

		this.video = video;
		this.videoWidth = videoWidth;
		this.videoHeight = videoHeight;
		

		this.minFilter =  THREE.NearestFilter,
        this.magFilter = THREE.NearestFilter;

	}
	updateTexture(){
		if( this.video.readyState !== this.video.HAVE_ENOUGH_DATA )	return;
		this.needsUpdate	= true;
	}
	destroy(){
		video.pause();
	}
}
