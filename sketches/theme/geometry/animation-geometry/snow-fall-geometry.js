export default class SnowFallGeometry extends THREE.BufferGeometry{
    constructor(){
        super()
        this.count = 6000;
        var positionArray  =new Float32Array(this.count * 3);
        var scaleArray     = new Float32Array(this.count);
        var alphaArray     = new Float32Array(this.count);
        var velocityArray  = new Float32Array(this.count * 3);
        var timeArray      = new Float32Array(this.count);

        for(var ii = 0; ii < this.count; ii++){
            var velocity = 100 + 200 * Math.random();
            var theta0 = 2 * Math.PI * Math.random();
            var theta1 = Math.PI/2;

            positionArray[ii * 3 + 0] = 0;
            positionArray[ii * 3 + 1] = 140 + 40 * Math.random(); // + 2000 * Math.random();
            positionArray[ii * 3 + 2] = 0;

            timeArray[ii] = -5 * Math.random();

            velocityArray[ii * 3 + 0] = velocity *  Math.sin(theta0) ;
            velocityArray[ii * 3 + 1] = velocity * Math.sin(theta1) + 200.0 + 200 * Math.random();
            velocityArray[ii * 3 + 2] = velocity * Math.cos(theta0);

            scaleArray[ii] = (50 + 100 * Math.random()) / 100;
            alphaArray[ii] = 1;
        }

        this.positionArray = positionArray;
        this.velocityArray = velocityArray;
        this.timeArray     = timeArray;

        this.positionAttribute = new THREE.BufferAttribute(positionArray, 3);
        this.timeAttribute     = new THREE.BufferAttribute(timeArray, 1);

        this.addAttribute("position", this.positionAttribute );
        this.addAttribute("time",     this.timeAttribute );
        this.addAttribute("scale",    new THREE.BufferAttribute(scaleArray, 1));
        this.addAttribute("alpha",    new THREE.BufferAttribute(alphaArray, 1));
    }

    update(dt){
        //console.log(this.positionAttribute);


        for(var ii = 0; ii < this.count; ii++){
            this.timeArray[ii] = this.timeArray[ii] + dt;
            if(this.timeArray[ii] < 0 ) continue;

            this.velocityArray[3 * ii + 1] = this.velocityArray[3 * ii + 1] - 400 * dt;
            if(this.velocityArray[3 * ii + 1] < -200) this.velocityArray[3 * ii + 1] = -200;
            //this.velocityArray[3 * ii ] = this.velocityArray[3 * ii ] * 0.99;
            //this.velocityArray[3 * ii+2] = this.velocityArray[3 * ii+2] * 0.99;
            var velX = this.velocityArray[3 * ii];
            var velY = this.velocityArray[3 * ii + 1];
            var velZ = this.velocityArray[3 * ii + 2];

            var xPos = this.positionArray[3 * ii] + velX * dt;
            var yPos = this.positionArray[3 * ii + 1] + velY * dt;
            var zPos = this.positionArray[3 * ii + 2] + velZ * dt;

            this.positionAttribute.setXYZ(ii, xPos, yPos, zPos);

            if(this.timeArray[ii] > 5.0){
                this.reset(ii);
            }
        }

        this.timeAttribute.needsUpdate = true;
        this.positionAttribute.needsUpdate = true;
    }

    reset(ii){
        var velocity = 100 + 200 * Math.random();
        var theta0 = 2 * Math.PI * Math.random();
        var theta1 = Math.PI/2;

        this.timeArray[ii] = 0;

        this.positionArray[ii * 3 + 0] = 0;
        this.positionArray[ii * 3 + 1] = 140 + 40 * Math.random(); // + 2000 * Math.random();
        this.positionArray[ii * 3 + 2] = 0;

        this.velocityArray[ii * 3 + 0] = velocity *  Math.sin(theta0) ;
        this.velocityArray[ii * 3 + 1] = velocity * Math.sin(theta1) + 200.0 + 120 * Math.random()
        this.velocityArray[ii * 3 + 2] = velocity * Math.cos(theta0);

    }
}