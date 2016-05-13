// ------------
// based on PhysicsRenderer, customized for myself
// https://github.com/cabbibo/PhysicsRenderer
// ------------

var _ = require('lodash');
var glslify = require('glslify');
var THREE = require('three');

module.exports = (function(){

    /** ====================== **/

    var properties = {
        renderer            : null,
        size                : 128,
        s2                  : null,
        rTargets            : [],
        targetLength        : null,
        counter             : 0,
        debugScene          : null,
        texturePassProgram  : null,
        simulation          : null,
        material            : null,
        camera              : null,
        scene               : null,
        mesh                : null,
        boundTextures       : []
    };

    /** ====================== **/

    var PhysicsRenderer = function(opts){
        this.renderer = opts.renderer;
        if(opts.size) this.size = opts.size;
        this.s2 = this.size * this.size;

        this.clock = new THREE.Clock();
        this.resolution = new THREE.Vector2( this.size, this.size );

        var rTarget =  new THREE.WebGLRenderTarget( this.size, this.size, {minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type:THREE.FloatType, stencilBuffer: false});
        this.rTargets = [rTarget, rTarget.clone(), rTarget.clone()];
        this.targetLength = this.rTargets.length;

        this.debugScene = this.createDebugScene();
        this.texturePassProgram = this.createTexturePassProgram();

        this.simulation = this.createSimulationProgram( opts.shader );
        this.material = this.simulation;

        /**
         GPGPU Utilities
         From Sporel by Mr.Doob
         @author mrdoob / http://www.mrdoob.com
         */

        this.camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 );
        this.scene = new THREE.Scene();
        this.mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1 ) );
        this.scene.add( this.mesh );
    }

    /** ====================== **/

    function initialize(){
        this.counter = 0;
    };

    /** ----------------------- **/

    function createDebugScene(){
        var debugScene = new THREE.Object3D();
        debugScene.position.z = 0;

        var geo = new THREE.PlaneBufferGeometry( 100 , 100 );

        var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
            map: this.rTargets[0]
        }));
        debugMesh.position.set( -105 , 0 , 0 );

        debugScene.add( debugMesh );

        var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
            map: this.rTargets[1]
        }));
        debugMesh.position.set( 0 , 0 , 0 );
        debugScene.add( debugMesh );

        var debugMesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
            map: this.rTargets[2]
        }));
        debugMesh.position.set( 105, 0 , 0 );
        debugScene.add( debugMesh );

        return debugScene;
    };

    /** ----------------------- **/

    function createTexturePassProgram(){

        var texturePassShader = new THREE.ShaderMaterial({
            uniforms : {
                texture : { type: "t", value: null } },
            vertexShader   : glslify("./shaders/pass/shader.vert"),
            fragmentShader : glslify("./shaders/pass/shader.frag")
        });

        return texturePassShader;
    }

    /** ----------------------- **/

    function createSimulationProgram(sim) {
        this.simulationUniforms = {
            tOPos:{ type: "t"  , value: null },
            tPos:{  type: "t"  , value: null },
            resolution: { type: "v2" , value: this.resolution }
        };


        return new THREE.ShaderMaterial({
            uniforms        : this.simulationUniforms,
            vertexShader    : glslify("./shaders/pass/shader.vert"),
            fragmentShader  : sim
        });
    }

    /** ----------------------- **/

    function update(){
        this.simulation.uniforms.tOPos.value = this.rTargets[this.counter];
        this.simulation.uniforms.tPos.value  =  this.rTargets[(this.counter+1) % this.targetLength];
        
        this.pass(this.simulation, this.rTargets[(this.counter+2) % this.targetLength]);

        this.ooOutput = this.rTargets[this.counter];
        this.oOutput = this.rTargets[(this.counter+1) % this.targetLength];
        this.output = this.rTargets[(this.counter+2) % this.targetLength];

        this.counter = (this.counter + 1) % this.targetLength;

        this.bindTextures();
    }

    /** ----------------------- **/

    function bindTextures(){
        for( var i = 0; i < this.boundTextures.length; i++ ){

            var uniform = this.boundTextures[i][0];
            var textureToBind = this.boundTextures[i][1];

            uniform.value = this[ textureToBind ];
        }
    }

    /** ----------------------- **/

    function addBoundTexture( uniform, value ){
        this.boundTextures.push( [ uniform , value ] );
    }

    /** ----------------------- **/

    function setUniforms(uniforms){
        for( var propt in uniforms ){

            this.simulation.uniforms[ propt ]  = uniforms[ propt]

        }

        // Have to make sure that these always remain!
        this.simulation.uniforms.tPos      = { type:"t"  , value:null            };
        this.simulation.uniforms.tOPos     = { type:"t"  , value:null            };
        this.simulation.uniforms.resolution = { type:"v2" , value:this.resolution };
    }

    /** ----------------------- **/

    function setUniform( name, u ){
        this.simulation.uniforms[name] = u;
    }

    /** ----------------------- **/

    // resets the render targets to the from position
    function reset( texture ){

        this.texture = texture;
        this.texturePassProgram.uniforms.texture.value = texture;

        this.rTargets.forEach(function(rTarget){
            this.pass( this.texturePassProgram , rTarget );
        }.bind(this))

    }

    /** ----------------------- **/

    function render(scene, camera, target){
        this.renderer.render( scene, camera, target, false );
    }

    /** ----------------------- **/

    function pass( shader, target ){
        this.mesh.material = shader;
        this.renderer.render( this.scene, this.camera, target, false );
    }

    /** ----------------------- **/

    function out(shader){
        this.mesh.material = shader.material;
        this.renderer.render( this.scene, this.camera );
    }

    /** ----------------------- **/
    // resets the render targets to the from position
    function resetRand( size , alpha ){

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

    /** ----------------------- **/

    function removeDebugScene ( scene ){
        scene.remove( this.debugScene );
    }

    function addDebugScene ( scene ){
        scene.add( this.debugScene );
    }

    /** ----------------------- **/


    var methods = {
        initialize                  : initialize,
        createDebugScene            : createDebugScene,
        createTexturePassProgram    : createTexturePassProgram,
        createSimulationProgram     : createSimulationProgram,
        addBoundTexture             : addBoundTexture,
        bindTextures                : bindTextures,
        setUniforms                 : setUniforms,
        update                      : update,
        reset                       : reset,
        pass                        : pass,
        render                      : render,
        out                         : out,
        resetRand                   : resetRand,
        removeDebugScene            : removeDebugScene,
        addDebugScene               : addDebugScene
    };

    /** ====================== **/

    THREE.EventDispatcher.prototype.apply( PhysicsRenderer.prototype );
    _.extend(PhysicsRenderer.prototype, properties);
    _.extend(PhysicsRenderer.prototype, methods);

    /** ====================== **/

    return PhysicsRenderer;

})();