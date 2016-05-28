"use strict";
var Base = require('./base');
var glslify = require('glslify');

module.exports = (function(){
    var Divergence = function( renderer, grid){
        this.grid = grid;
        var fs = glslify("./shaders/gradient.frag");

        this.renderer = renderer;

        this.uniforms = {
            p: {
                type: "t"
            },
            w: {
                type: "t"
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
        compute : function(p, w, output) {
            this.uniforms.p.value = p.target;
            this.uniforms.w.value = w.target;

            this.renderer.render(this.scene, this.camera, output.output, false);

            output.swap();
        }
    });

    return Divergence;
})();