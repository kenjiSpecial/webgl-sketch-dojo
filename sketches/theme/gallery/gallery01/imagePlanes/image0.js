var MeshBase = require('./base');
var imageShader = require('./image0Shader/app');

var ImagePlane = function( image ){

    MeshBase.call(this, imageShader, image);
};

ImagePlane.prototype = Object.create(MeshBase.prototype);
ImagePlane.prototype.constructor = ImagePlane;


ImagePlane.prototype.update = function(dt, intersect){

    if(intersect && intersect.object == this){
        this.material.uniforms.uMouse.value = intersect.uv;
        this.material.uniforms.uRate.value += ( 4.0 - this.material.uniforms.uRate.value) * 0.05;
    }else{
        this.material.uniforms.uRate.value += (0.0 - this.material.uniforms.uRate.value) * 0.1;
    }

};

module.exports = ImagePlane;