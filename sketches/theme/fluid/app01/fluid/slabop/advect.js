"use strict";
var Base = require('./base');
var glslify = require('glslify');

module.exports = (function(){
    var Advect = function( renderer, grid, time, dissipation, isDensity ){
        this.grid = grid;
        this.time = time;
        isDensity = !!isDensity;
        var fs = glslify("./shaders/advect.frag");

        this.renderer = renderer;
        this.dissipation = dissipation === undefined ? 0.998 : dissipation;

        this.uniforms = {
            uDensity : {
                value : isDensity
            },
            velocity: {
                type: "t",
                value : null
            },
            advected: {
                type: "t",
                value : null,
            },
            gridSize: {
                type: "v2",
                value : grid.size
            },
            gridScale: {
                type: "f",
                value : grid.scale
            },
            timestep: {
                type: "f",
                value : time.step
            },
            dissipation: {
                type: "f",
                value : this.dissipation
            }
        };

        console.log(grid.size);

        Base.call(this, fs, this.uniforms);
    };

    Advect.prototype = Object.create(Base.prototype);
    Advect.prototype.constructor = Advect;

    _.extend(Advect.prototype, {
        compute : function(velocity, advected, outputRenderer ) {
            this.uniforms.velocity.value = velocity.target;
            this.uniforms.advected.value = advected.target;
            
            this.renderer.render(this.scene, this.camera, outputRenderer.output, false);
            
            outputRenderer.swap();
        }
    });

    return Advect;
})();