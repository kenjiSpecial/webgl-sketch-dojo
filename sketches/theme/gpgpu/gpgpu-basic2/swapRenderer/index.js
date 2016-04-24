var Implement = require('./implement');
var _ = require('lodash');

module.exports = (function(){
    var SwapRenderer = function(opts){if(this.initialize) this.initialize(opts) };

    THREE.EventDispatcher.prototype.apply( SwapRenderer.prototype );
    
    /** property and method **/

    _.extend(SwapRenderer.prototype, {
        size : 128,
        initialize : Implement.initialize ,
        createTexturePassProgram : Implement.createTexturePassProgram,
        update : Implement.update,
        render : Implement.render,
        pass : Implement.pass,
        out : Implement.out,
        reset : Implement.reset,
        resetRand : Implement.resetRand,
    });
    
    
    return SwapRenderer;
    
});