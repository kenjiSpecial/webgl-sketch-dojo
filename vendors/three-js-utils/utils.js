module.exports = {
    toScreenPosition: function (obj, camera) {
        var widthHalf = 0.5 * window.innerWidth;
        var heightHalf = 0.5 * window.innerHeight;
        var vector = new THREE.Vector2();

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = -( vector.y * heightHalf ) + heightHalf;

        return {
            x: vector.x,
            y: vector.y
        };


    },
    screenToWorldAtZ : function(positionX, positionY, z, camera){
        var vector = new THREE.Vector3();

        vector.set(
            ( positionX/ window.innerWidth ) * 2 - 1,
            - ( positionY / window.innerHeight ) * 2 + 1,
            0.5 );


        vector.unproject( camera );
        var dir = vector.sub( camera.position ).normalize();

        var distance = (z- camera.position.z) / dir.z;

        var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
        return pos;
    },

    random : function(min, max){
        return min + (max - min) * Math.random();
    },
    
    createRandomTexture : function( value, width, height ){
        var size = width * height;
        var data = new Float32Array(size * 4);
        
        var num;
        for(var ii = 0; ii < size * 4; ii++){
            data[ii] = (Math.random() - 0.5) * value;
            
            if(ii % 4 == 3) data[ii] = 0;
        }
        
        var randomTexture = new THREE.DataTexture(
            data,
            width,
            height,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        randomTexture.minFilter =  THREE.NearestFilter,
        randomTexture.magFilter = THREE.NearestFilter,
        randomTexture.needsUpdate = true
        
        return randomTexture;
    },
    
    craeteBlackAndWhiteTexture : function(width, height){
        var size = width * height;
        var data = new Float32Array(size * 4);

        var num;
        for(var ii = 0; ii < size ; ii++){
            var random = Math.random();
            data[ii * 4] = random;
            data[ii * 4 + 1] = random;
            data[ii * 4 + 2] = random;

            if(ii % 4 == 3) data[4 * ii + 3] = 0;
        }

        var randomTexture = new THREE.DataTexture(
            data,
            width,
            height,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        randomTexture.minFilter =  THREE.NearestFilter,
            randomTexture.magFilter = THREE.NearestFilter,
            randomTexture.needsUpdate = true

        return randomTexture; 
    }
};