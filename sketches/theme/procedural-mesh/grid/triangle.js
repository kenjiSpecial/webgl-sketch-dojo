//import Particle from "./particle"

export default class triangle {
    constructor( parentIndex, index, xx0, yy0, xx1, yy1, xx2, yy2){
        var unit = 3;
        this.parentIndex = parentIndex;
        this.index = index;

        this.p0 = new THREE.Vector3(xx0 * unit, yy0* unit, 0);
        this.o0 = this.p0.clone();
        this.r0 = new THREE.Vector3();

        this.p1 = new THREE.Vector3(xx1* unit, yy1* unit, 0);
        this.o1 = this.p1.clone();
        this.r1 = new THREE.Vector3();

        this.p2 = new THREE.Vector3(xx2* unit, yy2* unit, 0);
        this.o2 = this.p2.clone();
        this.r2 = new THREE.Vector3();


        this.center = new THREE.Vector3(
            (this.o0.x + this.o1.x + this.o2.x)/3 ,
            (this.o0.y + this.o2.y + this.o2.y)/3,
            (this.o0.z + this.o1.z + this.o2.z)/3
        );


        this.dVec = new THREE.Vector3(this.center.x-this.p0.x, this.center.y-this.p0.y, this.center.z - this.p0.z );
        this.rad = 0.5 + 0.5 * Math.random(); //2 + 3 * Math.random(); //this.dVec.length() * (1.0 + 0.4 * Math.random());
        this.rate = 1;

        this.setRandom();
        this.p0.copy(this.r0);
        this.p1.copy(this.r1);
        this.p2.copy(this.r2);
    }

    setRandom(){
        var rateX = this.center.x/32;
        var rateZ = this.center.y/18;
        //console.log(rate);
        var randomX = 30 * rateX ;
        var randomZ = 30 * rateZ -200;
        var y = -120;

        var random = Math.PI * 2 * Math.random();
        var randomRad = 15 * Math.random();
        var randomTheta = 2 * Math.PI * Math.random();
        var randomXX =  randomRad  * Math.cos(randomTheta);
        var randomZZ = randomRad/2 * Math.sin(randomTheta);

        for(var ii = 0; ii < 3; ii++){
            var theta = random + 1/3 * Math.PI * 2 * ii;
            //var randomX = 30 * Math.random() - 15;

            var x = this.rad * Math.cos(theta) + randomXX + (this.parentIndex - 1) * 40;
            var z = this.rad * Math.sin(theta) + randomZZ-200;

            if(ii == 0)         this.r0.set(x , y, z);
            else if(ii == 1)    this.r1.set(x , y, z);
            else if(ii == 2)    this.r2.set(x , y, z);
        }

    }

    updateLoop(dt, verticeAttribute){
        var random0 = 0;//(4 * Math.random() - 2) * this.rate/10;
        var random1 = 0;//(4 * Math.random() - 2) * this.rate/10;
        var random2 = 0;//(4 * Math.random() - 2) * this.rate/10;

        verticeAttribute.setXYZ(this.index * 3, this.p0.x + random0, this.p0.y + random0, this.p0.z + random0);
        verticeAttribute.setXYZ(this.index * 3 + 1, this.p1.x + random1, this.p1.y + random1, this.p1.z + random1);
        verticeAttribute.setXYZ(this.index * 3 + 2, this.p2.x + random2, this.p2.y + random2, this.p2.z + random2);
    }

    backToInitState(){
        var duration = 1;
        var delay = 0; //0.5 * Math.random(); //0.6 + 0.4 * Math.random(); //Math.random() * 2 + 1;
        var random = 0.4 + 0.4 * Math.random(); //duration - delay;//0.4 + 0.4 * Math.random();
        if(this.tl0) this.tl0.pause();
        if(this.tl1) this.tl1.pause();
        if(this.tl2) this.tl2.pause();
        if(this.tl3) this.tl3.pause();

        this.tl0 = TweenLite.to(this.p0, random + 0.1 * Math.random(), {x: this.o0.x, y: this.o0.y, z: this.o0.z, delay: delay, ease: Quint.easeInOut});
        this.tl1 = TweenLite.to(this.p1, random + 0.1 * Math.random(), {x: this.o1.x, y: this.o1.y, z: this.o1.z, delay: delay, ease: Quint.easeInOut});
        this.tl2 = TweenLite.to(this.p2, random + 0.1 * Math.random(), {x: this.o2.x, y: this.o2.y, z: this.o2.z, delay: delay, ease: Quint.easeInOut});
        this.tl3 = TweenLite.to(this, 1.0, {rate: 0, delay: delay});
    }

    backToWall(){
        //var duration = 1;
        //var delay = 0.5 * Math.random(); //0.6 + 0.4 * Math.random(); //Math.random() * 2 + 1;
        //var random = duration - delay;
        var delay = 0; //0.6 + 0.4 * Math.random(); //Math.random() * 2 + 1;
        var random = 0.4 + 0.4 * Math.random();
        if(this.tl0) this.tl0.pause();
        if(this.tl1) this.tl1.pause();
        if(this.tl2) this.tl2.pause();
        if(this.tl3) this.tl3.pause();


        this.tl0 = TweenLite.to(this.p0, random + 0.1 * Math.random(), {x: this.r0.x, y: this.r0.y, z: this.r0.z, delay: delay, ease: Quint.easeInOut});
        this.tl1 = TweenLite.to(this.p1, random + 0.1 * Math.random(), {x: this.r1.x, y: this.r1.y, z: this.r1.z, delay: delay, ease: Quint.easeInOut});
        this.tl2 = TweenLite.to(this.p2, random + 0.1 * Math.random(), {x: this.r2.x, y: this.r2.y, z: this.r2.z, delay: delay, ease: Quint.easeInOut});
        this.tl3 = TweenLite.to(this, 1.0, {rate: 1, delay: delay});
    }

}
