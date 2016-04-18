var createGeometry = require('../utils/create/geometry');
var glslify = require('glslify');


module.exports = {
    initialize : function(opts){
        this.uniforms = {
            texture: { type:"t" , value: null }
        };

        this.geometry = createGeometry(opts.size);
        // this.geometry = new THREE.PlaneGeometry(10, 10);
        /**
        this.material = new THREE.ShaderMaterial({
            uniforms : this.uniforms,
            vertexShader   : glslify("../shaders/pass.vert"),
            fragmentShader : glslify("../shaders/pass.frag")
        }); */
        this.material = new THREE.MeshBasicMaterial({color : 0xffff00})
        // console.log('?');
    },
    update : function(mat){
        this.material = mat;
    }
}