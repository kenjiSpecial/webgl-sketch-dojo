var glslify = require('glslify');
import CustomGeometry from "./geometry";


module.exports = {
    initialize : function(opts){
        this.uniforms = opts.uniforms;
        this.size = opts.size;
        // console.log(this.uniforms);
        this.geometry = new CustomGeometry({width: 600, height: 600, widthSegment : opts.size, heightSegment: opts.size });

        this.material = new THREE.ShaderMaterial({
            uniforms : this.uniforms,
            vertexShader   : glslify("../shaders/pass.vert"),
            fragmentShader : glslify("../shaders/pass.frag"),
            side : THREE.DoubleSide,
            transparent : true
        });
        // console.log(this.uniforms);
        // this.material = new THREE.MeshBasicMaterial({ color : 0xffff00, wireframe: true, side: THREE.DoubleSide })
        // new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, side: THREE.DoubleSide }));

        // console.log('?');
        this.resetRand();
    },
    update : function(){
        // this.rotation.y += 0.01;
    },

    resetRand : function(){

        var s2 = this.size * this.size;
        var data = new Float32Array(s2 * 4);

        for(var ii = 0; ii < s2; ii++){
            var rand = 256 * (Math.random() - 0.5);
            data[4 * ii + 0] = rand;
            data[4 * ii + 1] = rand;
            data[4 * ii + 2] = rand;
            data[4 * ii + 3] = 0;
        }

        var texture = new THREE.DataTexture(
            data,
            this.size,
            this.size,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        texture.minFilter =  THREE.NearestFilter,
        texture.magFilter = THREE.NearestFilter,
        texture.needsUpdate = true;

        
        this.uniforms.texture.value = texture;
        // this.uniformstexture
    }
}