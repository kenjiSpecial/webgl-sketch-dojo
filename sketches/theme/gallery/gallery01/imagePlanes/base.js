
var ImageBasee = function( shader, image ){
    var imgSize = 256;
    var plane = new THREE.PlaneBufferGeometry( imgSize, imgSize );
    var mat = new THREE.ShaderMaterial(shader);

    THREE.Mesh.call(this, plane, mat );
    this.material.uniforms.tMain.value = image;
};

ImageBasee.prototype = Object.create(THREE.Mesh.prototype);
ImageBasee.prototype.constructor = ImageBasee;


ImageBasee.prototype.update = function(dt, intersect){
};

module.exports = ImageBasee;