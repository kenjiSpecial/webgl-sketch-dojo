var glslify = require('glslify');
import CustomGeometry from "./geometry";

module.exports = {
    initialize : function(opts){
        this.opts = opts;
        this.renderer = opts.renderer;
        if(opts.size) this.size = opts.size;
        this.s2 = this.size * this.size;

        this.front = new THREE.WebGLRenderTarget( this.size, this.size, {minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type:THREE.FloatType, stencilBuffer: false});
        this.back = this.front.clone();

        this.curTexture = this.front;
        this.target = this.back;

        this.texturePassProgramMaterial = this.createTexturePassProgram();
        // this.simulationMateril = this.createSimulationProgram( opts.shader );

        /**
         GPGPU Utilities
         From Sporel by Mr.Doob
         @author mrdoob / http://www.mrdoob.com */

        this.geometry = new CustomGeometry({width: opts.size, height: opts.size, widthSegment : opts.size, heightSegment: opts.size });
        this.geometry = new THREE.PlaneBufferGeometry( 1, 1 )
        this.camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 );
        this.scene = new THREE.Scene();
        this.mesh = new THREE.Mesh( this.geometry, this.texturePassProgramMaterial );
        this.scene.add( this.mesh );
    },

    createTexturePassProgram : function(){
        if(this.opts.uniforms) this.uniforms = this.opts.uniforms;
        else                    this.uniforms = {};

        this.uniforms = _.extend(this.uniforms, {
            texture : { type: "t", value: null },
            uSize   : { type: "f", value: this.size}
        })

        return new THREE.ShaderMaterial({
            uniforms : this.uniforms,
            vertexShader   : glslify("./shaders/pass/shader.vert"),
            fragmentShader : glslify("./shaders/pass/shader.frag")
        });
    },
    
    update : function(){
        // console.log('update');
        if(this.target != this.front){
            this.curTexture = this.back;
            this.target = this.front;
        }else{
            this.curTexture = this.front;
            this.target = this.back;
        }

        this.texturePassProgramMaterial.uniforms.texture.value = this.curTexture;
        this.render(this.scene, this.camera, this.target);

        return this.target;
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

        for( var i =0; i < data.length; i = i+4 ){

            //console.log('ss');
            var rand =  (Math.random() - .5 ) * size;
            data[ i ] = rand;
            data[ i + 1 ] = rand;
            data[ i + 2 ] = rand;

            if( alpha && i % 4 ===3 ){
                data[i + 3] = 0;
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
    },
    createDebugScene :function (){
        var debugScene = new THREE.Object3D();
        debugScene.position.z = 0;

        var geo = new THREE.PlaneBufferGeometry( 100 , 100 );

        var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
            map: this.front
        }));
        debugMesh.position.set( -52.5 , 0 , 0 );

        debugScene.add( debugMesh );

        var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
            map: this.back
        }));
        debugMesh.position.set( 52.5 , 0 , 0 );
        debugScene.add( debugMesh )

        return debugScene;
    }

    
    
};