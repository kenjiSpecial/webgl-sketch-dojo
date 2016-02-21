var SnowParticle = function(){
    this.reset()
};

SnowParticle.prototype.update = function(){
    if(this.interval > 0){
        this.interval -= 1/60;
        this.isVisible = false;
        return;
    }

    this.isVisible = true;
    this.time += 1/60;
    this.theta += this.time;
    //this.rad += this.velRad ;

    this.x = this.rad * Math.cos(this.theta) + this.initX;
    this.y = this.rad * Math.sin(this.theta) + this.initY;

    if(this.time > this.lifeSpan) this.reset();
};

SnowParticle.prototype.reset = function(){
    this.rad = 20;
    this.theta = Math.PI * 2 * Math.random();
    this.velRad = 0.4 + 0.8 * Math.random();

    this.initX = 300;
    this.initY = 300;

    this.time = 0;
    this.lifeSpan = 1 + 1 * Math.random();
    this.interval = 3 * Math.random() ;
};


module.exports = SnowParticle;

