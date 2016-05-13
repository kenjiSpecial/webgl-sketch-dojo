var _ = require('lodash');

module.exports = (function(){
    var SwapRendererTarget = function(opts){
        this.width = opts.width;
        this.height = opts.height;
        
        this.front = new THREE.WebGLRenderTarget( this.width, this.height, {minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type:THREE.FloatType, stencilBuffer: false});
        this.back = this.front.clone();
        
        this.read = this.front;
        this.output = this.back;
    };

    THREE.EventDispatcher.prototype.apply( SwapRendererTarget.prototype );

    _.extend(SwapRendererTarget.prototype, {
        swap : function(){
            if(this.read == this.front){
                this.read = this.back;
                this.ouput = this.front;
            }else{
                this.read = this.front;
                this.ouput = this.back;
            }
        }
    });
    
    return SwapRendererTarget;
})();