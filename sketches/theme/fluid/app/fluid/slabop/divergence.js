"use strict";
var Base = require('./base');
var glslify = require('glslify');

module.exports = (function(){
    var Divergence = function( renderer, grid){
        this.grid = grid;
        var fs = glslify("./shaders/divergence.frag");

        this.renderer = renderer;

        this.uniforms = {
            velocity: {
                type: "t",
                value : null
            },
            gridSize: {
                type: "v2",
                value : grid.size
            },
            gridScale: {
                type: "f",
                value : grid.scale
            }

        };

        Base.call(this, fs, this.uniforms);
    };

    Divergence.prototype = Object.create(Base.prototype);
    Divergence.prototype.constructor = Divergence;

    _.extend(Divergence.prototype, {
        compute : function(velocity, Divergenceed ) {
            this.uniforms.velocity.value = velocity.target;
            // this.uniforms.Divergenceed.value = Divergenceed.target;

            this.renderer.render(this.scene, this.camera, Divergenceed.output, false);

            Divergenceed.swap();
        }
    });

    return Divergence;
})();