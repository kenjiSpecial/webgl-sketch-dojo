var glslify = require('glslify');
var SwapRenderer = require('vendors/swapRenderer/index');
var slabop = require('./slabop');

export default class Solver {
    /**
     * 
     * @param {size} grid
     * @param {renderer} renderer
     */
    constructor(grid, renderer ){
        console.log(grid);
        this.grid = grid;
        this.renderer = renderer;
        
        this.velocity = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});
        this.density  = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});
        this.velocityDivergence = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});
        this.velocityVorticity = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});
        this.pressure = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});


        this.velocity.resetRand(10.0);
        // this.pressure.resetRand(10.0);

        this.time = {step : 1};

        this.advect = new slabop.Advect( renderer, grid, this.time );
        this.divergence = new slabop.Divergence(renderer, grid);
        this.poissonPressureEq = new slabop.Jacobi(renderer, glslify("./slabop/shaders/jacobiscalar.frag"), grid);
        this.gradient = new slabop.Gradient(renderer, grid);
    }

    /**
     *
     * @param {x: number, y: number} mouse
     */
    step(mouse){
        // var temp =  this.advect.uniforms.dissipation.value;
        // this.advect.uniforms.dissipation.value = 1;
        // this.advect.compute(this.velocity, this.velocity, this.velocity);
        //
        // this.addForce(mouse);
        
        // this.project();
    }
    
    addForce(mouse){
        
    }
    
    
    project(){
        this.divergence.compute(
            this.velocity,
            this.velocityDivergence
        );

        this.clearSlab(this.pressure);
        this.poissonPressureEq.alpha = -this.grid.scale * this.grid.scale;
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
    }
    clearSlab(renderTarget){
        this.renderer.clearTarget(renderTarget.output, true, false, false);
        this.renderer.clearTarget(renderTarget.target, true, false, false);
        renderTarget.swap();
    }
    
}
