"use strict";
var Base = require('./base');
var glslify = require('glslify');

module.exports = (function(){
    var Jacobi = function( renderer, fs, grid, iterations, alpha, beta){
        this.grid = grid;
        this.iterations = iterations === undefined ? 5 : iterations;
        this.alpha = alpha === undefined ? -1 : alpha;
        this.beta = beta === undefined ? 4 : beta;
        // var fs = glslify('./shaders/jacobiscalar.frag');
        console.log(fs);

        this.renderer = renderer;

        this.uniforms = {
            x: {
                type: "t",
                value : null
            },
            b: {
                type: "t",
                value : null
            },
            gridSize: {
                type: "v2",
                value : grid.size
            },
            alpha: {
                type: "f",
                value : this.alpha
            },
            beta: {
                type: "f",
                value : this.beta
            },

        };



        Base.call(this, fs, this.uniforms);
    };

    Jacobi.prototype = Object.create(Base.prototype);
    Jacobi.prototype.constructor = Jacobi;

    _.extend(Jacobi.prototype, {
        compute : function( x, b, output ) {
           for(var ii = 0; ii < this.iterations; ii++){
               this.step(x, b, output )
           }
        },
        step : function(x, b, output){
            this.uniforms.x.value = x.target;
            this.uniforms.b.value = b.target;

            this.renderer.render(this.scene, this.camera, output.output, false);

            output.swap();
        }
    });

    return Jacobi;
})();