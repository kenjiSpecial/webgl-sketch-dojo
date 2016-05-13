var _ = require('lodash');
// var textureFunc = require('./texture-func');
var glslify = require('glslify');
var THREE = require('three');

module.exports = (function(){

    // ----------------------

    var textureProperties = {
        size          : 128,
        count         : null,
        front         : null,
        back          : null,
        currentFront  : null,
        currentTarget : null,
        renderer     : null,
        render       : {
            scene    : null,
            camera   : null,
            mat      : null,
            plane    : null,
            mesh     : null
        }   
    };

    // ----------------------

    function Texture( renderer ){
        this.count = this.size * this.size;
        this.renderer = renderer;

        this.front = new THREE.WebGLRenderTarget(this.size, this.size, { minFilter: THREE.NearestFilter, maxFilter: THREE.NearestFilter, stencilBuffer: false, depthBuffer: false });
        this.back  = new THREE.WebGLRenderTarget(this.size, this.size, { minFilter: THREE.NearestFilter, maxFilter: THREE.NearestFilter, stencilBuffer: false, depthBuffer: false });
        this.front.texture.wrapS = this.front.texture.wrapT = THREE.RepeatWrapping;
        this.back.texture.wrapS = this.back.texture.wrapT = THREE.RepeatWrapping;
        
        this.render.scene    = new THREE.Scene();
        this.render.camera   = new THREE.OrthographicCamera( -this.size/2,  this.size/2, -this.size/2, this.size/2, -10000, 10000 );
        this.render.camera.position.z = 100;
        
        this.render.mat = new THREE.ShaderMaterial({
            depthTest : false,
            side: THREE.DoubleSide,
            uniforms : {
                "tVelocity" : {type: "t", value: null},
                "tPosition" : {type: "t", value: null}
            },
            vertexShader   : glslify("../velocity/shader.vert"),
            fragmentShader : glslify("../velocity/shader.frag"),
        });

        // this.render.mat = new THREE.MeshBasicMaterial({color: 0xff0000})


        this.render.plane = new THREE.PlaneGeometry(1, 1);
        this.render.mesh = new THREE.Mesh( this.render.plane, this.render.mat );
        this.render.scene.add(this.render.mesh);

        this.currentTarget = this.front;
        this.currentFront  = this.back;
    };
   

    function update( velocityTexture ){
        if(this.currentFront == this.front){
            this.currentFront = this.back;
            this.currentTarget = this.front;
        }else{
            this.currentFront = this.front;
            this.currentTarget = this.back;
        }


        this.render.mat.uniforms.tVelocity.value = velocityTexture;
        this.render.mat.uniforms.tPosition.value = this.currentFront;

        this.renderer.render( this.render.scene, this.render.camera, this.currentTarget );
    }




    var textureFunc = {
        update : update,
    };

    _.extend(Texture.prototype, textureProperties);
    _.extend(Texture.prototype, textureFunc)

    return Texture;
})();