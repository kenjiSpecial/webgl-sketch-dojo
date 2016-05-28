
"use strict";
var Base = require('./base');
var glslify = require('glslify');

module.exports = (function(){
    var Splat = function( renderer, grid, radius){
        var fs = glslify('./shaders/splat.frag');

        this.renderer = renderer;

        this.grid = grid;
        this.radius = radius === undefined ? 1 : radius;
        
        this.uniforms = {
            read : {value : null},
            gridSize : {value: new THREE.Vector2()},
            point : {value : new THREE.Vector2()},
            radius : {value : this.radius},
            uCol   : {value: new THREE.Vector3()}
        }

        Base.call(this, fs, this.uniforms);
    };

    Splat.prototype = Object.create(Base.prototype);
    Splat.prototype.constructor = Splat;

    _.extend(Splat.prototype, {
        compute : function(input, point, grid, uCol, output){
            this.uniforms.read.value = input.target;
            this.uniforms.point.value = point;
            this.uniforms.gridSize.value = grid.size;
            this.uniforms.uCol.value = uCol;
            
            this.renderer.render(this.scene, this.camera, output.output, false);

            output.swap();
        }
    });

    return Splat;
})();