var _ = require('lodash');
var Implement = require('./implement');

module.exports = (function() {
    var LookUpMesh = function(opts){
        this.initialize(opts);
        THREE.Mesh.call(this, this.geometry, this.material);
        // console.log(this);

        // this.scale.x = window.innerWidth;
        // this.scale.y = window.innerHeight;
        this.rotation.set(Math.PI/2, 0, 0);
    }
    
    LookUpMesh.prototype = Object.create(THREE.Mesh.prototype);
    
    _.extend(LookUpMesh.prototype, {
        geometry : null,
        matrerial : null,
        initialize  : Implement.initialize,
        update      : Implement.update
    });
    
    
    return LookUpMesh;
})();