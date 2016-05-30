var glslify = require('glslify');
var SwapRenderer = require('vendors/swapRenderer/index');
var slabop = require('./slabop');
import ForceMat from "./force/mat";

export default class Solver {
    /**
     * 
     * @param {size} grid
     * @param {renderer} renderer
     */
    constructor(grid, renderer ){
        this.grid = grid;
        this.renderer = renderer;
        
        this.velocity = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});
        this.density  = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});
        this.velocityDivergence = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});
        this.velocityVorticity = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});
        this.pressure = new SwapRenderer({width: this.grid.size.width, height: this.grid.size.height, renderer: renderer});

        this.time = {step : 1/60};

        this.advect = new slabop.Advect( renderer, grid, this.time, false );
        this.densityAdvect = new slabop.Advect( renderer, grid, this.time, true );
        this.divergence = new slabop.Divergence(renderer, grid);
        this.poissonPressureEq = new slabop.Jacobi(renderer, glslify("./slabop/shaders/jacobiscalar.frag"), grid);
        this.gradient = new slabop.Gradient(renderer, grid);
        this.splat = new slabop.Splat(renderer, grid, 10);
        this.splat2 = new slabop.Splat2(renderer, grid, 10);
        // this.poissonPressureEq.beta = 1;


        this.viscosity = 0.3;
        this.applyViscosity = false;
        this.applyVorticity = false;

        // density attributes
        this.source = new THREE.Vector3(0.8, 0.0, 0.0);
        this.ink = new THREE.Vector3(0.0, 0.06, 0.19);
    }

    /**
     *
     * @param {x: number, y: number} mouse
     */
    step(texture, isScale){
        var temp =  this.advect.uniforms.dissipation.value;
        this.advect.uniforms.dissipation.value = 0.99;
        this.advect.compute(this.velocity, this.velocity, this.velocity);

        if(isScale){
            this.splat2.uniforms.uScale.value = 1;
        }else{
            this.splat2.uniforms.uScale.value = -1;
        }

        //
        this.densityAdvect.uniforms.dissipation.value = 0.99;
        this.densityAdvect.compute(this.velocity, this.density, this.density);

        this.addForce(texture);
        
        this.project();
    }
    
    addForce(texture){
        // console.log(mouse);
        // if(this.prevMouse){
            // var velX = (mouse.x - this.prevMouse.x) * 1000;
            // var velY = (mouse.y - this.prevMouse.y) * 1000;
            // var vel = new THREE.Vector3(velX, velY, 0);
            // vel = vel.normalize();
            // vel = new THREE.Vector3(1.0, 0.0, 0.0)
        var vel = new THREE.Vector3();
        var col = new THREE.Vector3();

            this.splat.compute(
                this.velocity,
                texture,
                this.grid,
                vel,
                this.velocity
            );
        // }

        // if(!vel) vel = new THREE.Vector3(0, 0, 0);
        // var velLength = vel.length();
        //
        // var col = new THREE.Vector3(1 * velLength, 1 * velLength, 1 * velLength);

        // var dMouse = new THREE.Vector2();
        // if(this.prevMouse) dMouse = dMouse.subVectors(new THREE.Vector2(mouse.x * window.innerWidth, mouse.y * window.innerHeight), new THREE.Vector2( window.innerWidth * this.prevMouse.x, window.innerHeight * this.prevMouse.y ) );
        //
        // if(dMouse.length() > 1){
        //
        // }else{

            this.splat2 .compute(
                this.density,
                texture,
                this.grid,
                col,
                this.density
            );
        // }


        // this.prevMouse = mouse.clone();
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

        // this.velocity.swap();
    }
    clearSlab(renderTarget){
        this.renderer.clearTarget(renderTarget.output, true, false, false);
        this.renderer.clearTarget(renderTarget.target, true, false, false);
        // renderTarget.swap();
    }
    
}
