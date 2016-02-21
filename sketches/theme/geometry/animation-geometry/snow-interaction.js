var SnowParticle = require('./snow-particle');

var SnowInteraction = function(geo){
    var size = Math.sqrt(geo.vertices.length);

    this.vertices = geo.vertices;
    this.verticeArr = [];

    for(var yy = 0; yy < size; yy++){
        this.verticeArr[yy] = [];

        for(var xx = 0; xx < size; xx++){
            var num = size * yy + xx;
            this.verticeArr[yy][xx] = this.vertices[num].z;
        }

    }

    this.verticeArr = [];

    this.animationCanvas = document.createElement('canvas');
    this.animationRad = 12;
    this.animationCanvas.width = this.animationRad * 2;
    this.animationCanvas.height = this.animationRad * 2;
    var animationCtx = this.animationCanvas.getContext('2d');
    var gradient = animationCtx.createRadialGradient( this.animationRad, this.animationRad, this.animationRad, this.animationRad, this.animationRad,0);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.0)");
    gradient.addColorStop(1, "rgba(120, 0, 0, 0.6)");
    animationCtx.fillStyle = gradient;
    animationCtx.fillRect(0, 0, this.animationRad * 2, this.animationRad * 2);

    this.snowParticles = [];

    for(var ii = 0; ii < 100; ii++){
        var snowParticle = new SnowParticle();
        this.snowParticles.push(snowParticle);
    }


    var canvas = document.createElement("canvas");
    canvas.width  = 600;
    canvas.height = 600;
    this.canvas = canvas;

    this.canvas = canvas;

    this.theta = 0;

    this.ctx = canvas.getContext('2d');

    this.texture = new THREE.Texture(this.canvas);
    this.texture.needsUpdate = true;
    this.texture.magFilter = this.texture.minFilter = THREE.LinearFilter;
};

SnowInteraction.prototype.update = function(){
    this.theta += 1/600  * Math.PI;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.snowParticles.forEach(function(snowParticle){
        snowParticle.update();
        var xPos = snowParticle.x;
        var yPos = snowParticle.y;

         if(snowParticle.isVisible) {
             this.ctx.drawImage( this.animationCanvas, xPos, yPos );
         }
    }.bind(this));

    this.texture.needsUpdate = true;
};

module.exports = SnowInteraction;