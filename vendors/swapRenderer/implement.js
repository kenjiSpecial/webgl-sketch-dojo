var glslify = require('glslify');

module.exports = {
    /**
     * @param {width, height, shader, uniforms} opts
     */
    initialize : function(opts){
        this.renderer = opts.renderer;
        this.width = opts.width;
        this.height = opts.height;
        
        this.s2 = this.width * this.height;
        
        this.front = new THREE.WebGLRenderTarget( this.width, this.height, {minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type:THREE.FloatType, stencilBuffer: false, debugTest : false});
        this.back = this.front.clone();

        this.output = this.front;
        this.target = this.back;

        this.texturePassProgramMaterial = this.createTexturePassProgram();
        if(opts.shader && opts.uniforms) this.simulationMateril = this.createSimulationProgram( opts.shader,  opts.uniforms);
        else if(opts.shaderMaterial)     this.simulationMateril = opts.shaderMaterial;

        /**
         GPGPU Utilities
         From Sporel by Mr.Doob
         @author mrdoob / http://www.mrdoob.com */

        this.camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 100 );
        this.camera.position.z = 100;
        this.camera.updateProjectionMatrix();
        this.scene = new THREE.Scene();
        this.mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1 ) );
        this.scene.add( this.mesh );

        /** debug material **/
        this.debugMat = new THREE.MeshBasicMaterial({ side : THREE.DoubleSide, color: 0xff0000 });
        this.debugMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1 ), this.debugMat );
        this.debugScene = new THREE.Scene();
        this.debugScene.add( this.debugMesh );
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
                baseCol : {type : 'v3',value: new THREE.Vector3() },
                texture : { type: "t", value: null } },
            vertexShader   : glslify("./shaders/pass/shader.vert"),
            fragmentShader : glslify("./shaders/pass/shader.frag")
        });
    },
    swapUpdate : function(mat){
        this.mesh.material = mat;
        this.renderer.render(this.scene, this.camera, this.output, false);
        this.swap();
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
        if(this.simulationMateril) this.mesh.material = this.simulationMateril;
        this.renderer.render(this.scene, this.camera, this.output, false);
    },

    setSimulationMateril : function(mat){
        this.simulationMateril = mat;
    },

    render : function(scene, camera, target){
        this.renderer.render( scene, camera, target, false );
    },
    
    pass : function( shaderMat, rTarget ){
        this.mesh.material = shaderMat;
        this.renderer.render( this.scene, this.camera, rTarget, false);
    },

    out: function(shaderMat){
        this.mesh.material = shaderMat;
        this.renderer.render( this.scene, this.camera );
    },

    changeDebugBaseCol : function(col){
        var baseCol = col || new THREE.Vector3();

        this.texturePassProgramMaterial.uniforms.baseCol.value = col;
    },

    debugOutput : function(texture) {
        if(texture) this.debugMat.map = texture;
        this.texturePassProgramMaterial.uniforms.texture.value = texture;
        this.debugMesh.material = this.texturePassProgramMaterial
        // this.debugMesh.scale.set(window.innerWidth, window.innerHeight, 1);

        this.renderer.render( this.debugScene, this.camera );
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
            this.width,
            this.height,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        texture.minFilter =  THREE.NearestFilter,
            texture.magFilter = THREE.NearestFilter,
            texture.needsUpdate = true;

        this.reset( texture);
    },
    setUniform : function( propertyName, value){
        this.uniforms[propertyName].value = value;
    }

    
    
};