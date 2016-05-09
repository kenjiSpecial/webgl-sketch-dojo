"use strict";
var glslify = require('glslify');

module.exports = (function(){
    var Base = function(fs, uniforms){
        var geometry = new THREE.PlaneBufferGeometry(2, 2);
        var material = new THREE.ShaderMaterial({
            uniforms : uniforms,
            vertexShader : glslify("../../display/shader.vert"),
            fragmentShader : fs,
            depthWrite : false,
            depthTest  : false,
            blending   : THREE.NoBlending
        });
        var quad = new THREE.Mesh(geometry, material);

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.scene.add(quad);
    };
    
    return Base;
    
})();