var Implement = require('./implement');
var _ = require('lodash');

module.exports = (function(){
    var SwapRenderer = function(opts){if(this.initialize) this.initialize(opts) };
    
    THREE.EventDispatcher.prototype.apply( SwapRenderer.prototype );
    
    /** property and method **/

    _.extend(SwapRenderer.prototype, {
        initialize : Implement.initialize ,
        createTexturePassProgram : Implement.createTexturePassProgram,
        createSimulationProgram : Implement.createSimulationProgram,
        swapUpdate : Implement.swapUpdate,
        swap   : Implement.swap,
        update : Implement.update,
        render : Implement.render,
        pass : Implement.pass,
        out : Implement.out,
        reset : Implement.reset,
        resetRand : Implement.resetRand,
        changeDebugBaseCol : Implement.changeDebugBaseCol,
        debugOutput : Implement.debugOutput
    });
    
    
    return SwapRenderer;
    
})();