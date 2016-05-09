
"use strict";
var slabop = require('./slabop');
var SwapRenderer = require('vendors/swapRenderer/index'), swapRenderer;
var glslify = require('glslify');

module.exports = (function(){
    var Solver = function(grid, time, windowSize, slabs, slabop, renderer){
        this.renderer = renderer;
        this.grid = grid;
        this.time = time;
        this.windowSize = windowSize;

        // slabs
        this.velocity = slabs.velocity;
        this.density = slabs.density;
        this.velocityDivergence = slabs.velocityDivergence;
        this.velocityVorticity = slabs.velocityVorticity;
        this.pressure = slabs.pressure;

        // slab operations
        this.advect = slabop.advect;
        this.diffuse = slabop.diffuse;
        this.divergence = slabop.divergence;
        this.poissonPressureEq = slabop.poissonPressureEq;
        this.gradient = slabop.gradient;
        this.splat = slabop.splat;
        this.vorticity = slabop.vorticity;
        this.vorticityConfinement = slabop.vorticityConfinement;

        this.viscosity = 0.3;
        this.applyViscosity = false;
        this.applyVorticity = false;

        // density attributes
        this.source = new THREE.Vector3(0.8, 0.0, 0.0);
        this.ink = new THREE.Vector3(0.0, 0.06, 0.19);
    };
    
    _.extend(Solver.prototype, {
        step  : function(mouse){
            var temp =  this.advect.uniforms.dissipation.value;
            //
            this.advect.uniforms.dissipation.value = 1;
            this.advect.compute(this.velocity, this.velocity, this.velocity);

            // console.log(temp);

            this.advect.uniforms.dissipation.value = temp;
            this.advect.compute(this.velocity, this.density, this.density);

            this.project();
        },
        
        addForces : function(){

        },
        project : function(){
            this.divergence.compute(
                this.velocity,
                this.velocityDivergence
            );
            //
            this.clearSlab(this.pressure);
            this.poissonPressureEq.alpha = -this.grid.scale * this.grid.scale;
            // this.poissonPressureEq.uniforms.alpha.value = this.poissonPressureEq.alpha
            // this.poissonPressureEq.compute(
            //     this.renderer,
            //     this.pressure,
            //     this.velocityDivergence,
            //     this.pressure
            // );
            //
            
            this.poissonPressureEq.compute(
                this.pressure,
                this.velocityDivergence,
                this.pressure
            );

            this.gradient.compute(
                this.pressure,
                this.velocity,
                this.velocity
            );
        },
        clearSlab : function(slab){
            this.renderer.clearTarget(slab.write, true, false, false);
            slab.swap();
        }
    });

    Solver.make = function( grid, time, windowSize, renderer ){
        var w = grid.size.x,
            h = grid.size.y;

        var slabs = {
            velocity : new SwapRenderer({width: w, height: h, renderer : renderer }),
            density  : new SwapRenderer({width: w, height: h, renderer : renderer }),
            velocityDivergence: new SwapRenderer({width: w, height: h, renderer : renderer }),
            velocityVorticity: new SwapRenderer({width: w, height: h, renderer : renderer }),
            pressure: new SwapRenderer({width: w, height: h, renderer : renderer })
        };

        slabs.velocity.resetRand(10.0);
        slabs.pressure.resetRand(10.0);
        // slabs.density.resetRand(0.0);

        time.step /= 10;
        // console.log(time);

        var slabopObj = {
            advect : new slabop.Advect(  renderer, grid, time ),
            divergence : new slabop.Divergence(renderer, grid),
            poissonPressureEq : new slabop.Jacobi(renderer, glslify("./slabop/shaders/jacobiscalar.frag"), grid),
            gradient :  new slabop.Gradient(renderer, grid)
        };

        // require('./slabop/shaders')

        return new Solver(grid, time, windowSize, slabs, slabopObj, renderer);
    };
    
    return Solver;
    
})();