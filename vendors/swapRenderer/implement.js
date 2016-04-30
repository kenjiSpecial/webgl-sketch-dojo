var glslify = require('glslify');

module.exports = {
    initialize : function(opts){
        this.renderer = opts.renderer;
        this.width = opts.width;
        this.height = opts.height;
        
        this.s2 = this.width * this.height;
        
        this.front = new THREE.WebGLRenderTarget( this.width, this.height, {minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type:THREE.FloatType, stencilBuffer: false});
        this.back = this.front.clone();

        this.output = this.front;
        this.target = this.back;

        this.texturePassProgramMaterial = this.createTexturePassProgram();
        this.simulationMateril = this.createSimulationProgram( opts.shader,  opts.uniforms);

        /**
         GPGPU Utilities
         From Sporel by Mr.Doob
         @author mrdoob / http://www.mrdoob.com */

        this.camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 );
        this.scene = new THREE.Scene();
        this.mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1 ), this.simulationMateril );
        this.scene.add( this.mesh );
    },

    createSimulationProgram : function(sim, uniforms) {
        this.uniforms = uniforms;
        
        return new THREE.ShaderMaterial({
            uniforms        : this.uniforms,
            vertexShader    : glslify("./shaders/pass/shader.vert"),
            fragmentShader  : sim,
            depthTest : false,
            side : THREE.DoubleSide
        });
    },

    createTexturePassProgram : function(){
        return new THREE.ShaderMaterial({
            uniforms : {
                texture : { type: "t", value: null } },
            vertexShader   : glslify("./shaders/pass/shader.vert"),
            fragmentShader : glslify("./shaders/pass/shader.frag")
        });
    },
    
    swap : function(){
        if(this.target != this.front){
            this.output = this.back;
            this.target = this.front;
        }else{
            this.output = this.front;
            this.target = this.back;
        }
    },
    
    update : function(){
        this.mesh.material = this.simulationMateril;
        this.renderer.render(this.scene, this.camera, this.output, false);
    },
    

    render : function(scene, camera, target){
        this.renderer.render( scene, camera, target, false );
    },
    
    pass : function( shaderMat, rTarget ){
        this.mesh.material = shaderMat;
        this.renderer.render( this.scene, this.camera, rTarget, false);
    },

    out: function(shader){
        this.mesh.material = shader.material;
        this.renderer.render( this.scene, this.camera );
    },

    
    reset : function( texture ){
        this.texture = texture;
        this.texturePassProgramMaterial.uniforms.texture.value = texture;

        this.pass(this.texturePassProgramMaterial, this.front);
        this.pass(this.texturePassProgramMaterial, this.back);
    },
    resetRand : function( size, alpha ){
        var size = size || 100;
        var data = new Float32Array( this.s2 * 4 );

        for( var i =0; i < data.length; i++ ){

            //console.log('ss');
            data[ i ] = (Math.random() - .5 ) * size;

            if( alpha && i % 4 ===3 ){
                data[i] = 0;
            }

        }

        var texture = new THREE.DataTexture(
            data,
            this.size,
            this.size,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        texture.minFilter =  THREE.NearestFilter,
            texture.magFilter = THREE.NearestFilter,
            texture.needsUpdate = true;

        this.reset( texture);
    }

    
    
};