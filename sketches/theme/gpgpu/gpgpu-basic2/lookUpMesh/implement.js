var glslify = require('glslify');
import CustomGeometry from "./geometry";


module.exports = {
    initialize : function(opts){
        this.uniforms = opts.uniforms;
        this.geometry = new CustomGeometry({width: 600, height: 600, widthSegment : opts.size, heightSegment: opts.size });

        this.material = new THREE.ShaderMaterial({
            uniforms : this.uniforms,
            vertexShader   : glslify("../shaders/pass.vert"),
            fragmentShader : glslify("../shaders/pass.frag"),
            side : THREE.DoubleSide,
            transparent : true
        });
        // this.material = new THREE.MeshBasicMaterial({ color : 0xffff00, wireframe: true, side: THREE.DoubleSide })
        // new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, side: THREE.DoubleSide }));

        // console.log('?');
    },
    update : function(){
        // this.rotation.y += 0.01;
    }
}