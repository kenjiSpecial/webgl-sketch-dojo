/**
 * codes are based on threex.videotexture and samdutton/simpl/getusermedia
 * https://github.com/jeromeetienne/threex.videotexture
 * https://github.com/samdutton/simpl/tree/master/getusermedia/sources
 */

var _ = require('lodash');

export default class CamTexture extends THREE.Texture{
	constructor(opts){

		navigator.getUserMedia = navigator.getUserMedia ||
			navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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
		_.bindAll(this, "gotSources", "onChangeVideo", "onPlayCahnge");
		this.availabe = true;
		// this.isFirst = true;
		this.isPlay = true;

		this.eventDispatcher = new THREE.EventDispatcher;
		this.videoList = [];

		/**
		if (typeof MediaStreamTrack === 'undefined' || typeof MediaStreamTrack.getSources === 'undefined') 	alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
		else																								MediaStreamTrack.getSources(this.gotSources);
		 */
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			console.log("enumerateDevices() not supported.\n\nTry Chrome");
			return;
		}

		navigator.mediaDevices.enumerateDevices()
			.then(this.gotSources)
			.catch(function(err) {
				console.log(err.name + ": " + err.message);
			});

		this.video = video;
		this.videoWidth = videoWidth;
		this.videoHeight = videoHeight;


		this.curCameraDevice = {device : '', id: ''};

		this.minFilter =  THREE.NearestFilter,
        this.magFilter = THREE.NearestFilter;

	}
	gotSources(sourceInfos){
		sourceInfos.forEach(function(sourceInfo){
			var kind = sourceInfo.kind;
			if(kind == "videoinput"){
				var label = sourceInfo.label;
				var id	  = sourceInfo.deviceId;

				this.videoList.push({id : id, label : label})
			}
		}.bind(this))

		this.start();
	}
	start(){
		var videoData = this.videoList[this.videoList.length - 1];
		this.curCameraDevice.device = videoData.label;
		var videoId = videoData.id;

		var constraints = {
			video: {
				optional: [{
					sourceId: videoId
				}]
			}
		};

		navigator.getUserMedia(constraints, this.successCallback.bind(this), this.errorCallback.bind(this));
	}
	changeVideo(_videoId){
		var videoId = _videoId;
		
		var stream = this.stream;
		var track = stream.getTracks()[0];  // if only one media track
		track.stop();

		var constraints = {
			video: {
				optional: [{
					sourceId: videoId
				}]
			}
		};

		navigator.getUserMedia(constraints, this.successCallback.bind(this), this.errorCallback.bind(this));
		
	}
	successCallback(stream){
		this.stream = stream;
		this.video.src	= URL.createObjectURL(stream);
		if(!this.isPlay) this.video.pause();
		this.updateTexture();

		// if(this.isFirst){
			this.eventDispatcher.dispatchEvent({type: "textuer:ready"})
			// this.isFirst = false;
		// }
	}
	errorCallback(error){
		alert('you got no WebRTC webcam');
	}
	updateTexture(){
		if( this.video.readyState !== this.video.HAVE_ENOUGH_DATA )	return;
		this.needsUpdate	= true;
	}
	destroy(){
		this.video.pause();
		var stream = this.stream;
		var track = stream.getTracks()[0];  // if only one media track
		track.stop();
	}
	clone(){
		return new this.constructor({width: this.videoWidth, height: this.videoHeight}).copy( this );
	}
	setGUI(gui){
		this.deviceArr = [];
		this.videoList.forEach(function(video){
			this.deviceArr.push(video.label);
		}.bind(this))

		this.cameraGUI = gui.addFolder('Cameras');
		this.videoController = this.cameraGUI.add(this, 'isPlay');
		this.controller = this.cameraGUI.add(this.curCameraDevice, 'device', this.deviceArr );

		this.cameraGUI.open();
		this.controller.onChange(this.onChangeVideo)
		this.videoController.onChange(this.onPlayCahnge);
	}
	onChangeVideo(text){
		var videoId;
		this.videoList.forEach(function(video){
			if(video.label == text) videoId = video.id;
		}.bind(this))

		if(videoId) this.changeVideo(videoId);
	}
	onPlayCahnge(isPlay){
		if(isPlay) 	this.video.play();
		else		this.video.pause()
	}
}
