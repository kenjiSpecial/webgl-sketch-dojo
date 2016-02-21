var utils = require('../../../../src/js/vendors/three-js-utils/utils');
var config = require('./config');

var Particle = function( index, lineIndex, camera ){
    this.index = index;
    this.lineIndex = index;
    this.camera = camera;

    this.initPosition();

    this.depthRate = 1 - Math.abs(camera.position.z - this.position.z)/3000;
    if(this.depthRate > 1) this.depthRate = 1;
    if(this.depthRate < 0) this.depthRate = 0;
};


Particle.prototype.initPosition = function(){
    /**
    var randomX = window.innerWidth * Math.random();
    var randomY = utils.random(config.pageHeight.min, config.pageHeight.max);
    var z = 1500;

    this.position = utils.screenToWorldAtZ(randomX, randomY, z, this.camera);
     */
    this.position = new THREE.Vector3();
    this.prevPosition = new THREE.Vector3();

    this.position.x = utils.random(config.pageWidth.min, config.pageWidth.max);
    this.position.y = utils.random(config.pageHeight.min, config.pageHeight.max);
    this.position.z = utils.random(config.pageFrontDepth.min, config.pageFrontDepth.max);

    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;
    this.prevPosition.z = this.position.z;

    this.velocity = new THREE.Vector3();
    this.velocity.x = utils.random(-3, 3);
    this.velocity.y = utils.random(-3, 3);
    //this.velocity.z = utils.random(-10, 10);
    //this.position
};

Particle.prototype.update = function( dt, positionAttribute ){
    this.position.x += dt * this.velocity.x;
    this.position.y += dt * this.velocity.y;

    if(this.position.x < config.pageWidth.min) this.position.x += (config.pageWidth.max - config.pageWidth.min);
    if(this.position.x > config.pageWidth.max) this.position.x -= (config.pageWidth.max - config.pageWidth.min);

    if(this.position.y < config.pageHeight.min) this.position.y += (config.pageHeight.max - config.pageHeight.min);
    if(this.position.y > config.pageHeight.max) this.position.y -= (config.pageHeight.max - config.pageHeight.min);


    positionAttribute.setXYZ(this.index, this.position.x, this.position.y, this.position.z);
};

Particle.prototype.updateLine = function(lineAttribute, lineDY){
    lineAttribute.setXYZ(this.lineIndex  * 2, this.position.x, this.position.y, this.position.z);
    lineAttribute.setXYZ(this.lineIndex  * 2 + 1, this.position.x, this.position.y - lineDY * this.depthRate * 1.3 , this.position.z);
};


module.exports = Particle;