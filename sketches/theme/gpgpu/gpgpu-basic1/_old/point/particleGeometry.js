export default class ParticleGeometry extends THREE.BufferGeometry {
    constructor(gpgpuTex) {
        super()

        this.count = gpgpuTex.count;
        var positionArray = new Float32Array(this.count * 3);

        for (var ii = 0; ii < this.count; ii++) {
            positionArray[ii * 3 + 0] = (ii%gpgpuTex.size)/gpgpuTex.size;
            positionArray[ii * 3 + 1] = parseInt(ii/gpgpuTex.size)/gpgpuTex.size; //140 + 40 * Math.random(); // + 2000 * Math.random();
            positionArray[ii * 3 + 2] = 0;
        }


        this.positionArray = positionArray;

        this.positionAttribute = new THREE.BufferAttribute(positionArray, 3);

        this.addAttribute("position", this.positionAttribute);
    }

    update(dt) {
        //console.log(this.positionAttribute);


        /**
        for (var ii = 0; ii < this.count; ii++) {
            this.timeArray[ii] = this.timeArray[ii] + dt;
            if (this.timeArray[ii] < 0) continue;

            this.velocityArray[3 * ii + 1] = this.velocityArray[3 * ii + 1] - 400 * dt;
            if (this.velocityArray[3 * ii + 1] < -200) this.velocityArray[3 * ii + 1] = -200;
            var velX = this.velocityArray[3 * ii];
            var velY = this.velocityArray[3 * ii + 1];
            var velZ = this.velocityArray[3 * ii + 2];

            var xPos = this.positionArray[3 * ii] + velX * dt;
            var yPos = this.positionArray[3 * ii + 1] + velY * dt;
            var zPos = this.positionArray[3 * ii + 2] + velZ * dt;

            //if(Math.sqrt(xPos * xPos + zPos * zPos) > 500 ){

            this.velocityArray[3 * ii] = this.velocityArray[3 * ii] * (0.985 + 0.02 * Math.random());
            this.velocityArray[3 * ii + 2] = this.velocityArray[3 * ii + 2] * (0.985 + 0.02 * Math.random());
            //}
            this.positionAttribute.setXYZ(ii, xPos, yPos, zPos);

            if (this.timeArray[ii] > 5.0) {
                this.reset(ii);
            }
        }

        this.timeAttribute.needsUpdate = true;
        this.positionAttribute.needsUpdate = true; */

    }

}