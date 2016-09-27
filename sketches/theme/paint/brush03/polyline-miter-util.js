var THREE = require('three');

module.exports = {
    computeMiter : function( lineA, lineB ){

        var tan = lineA.clone().add(lineB).normalize();
        var miter = new THREE.Vector2(-tan.y, tan.x);
        var tmp = new THREE.Vector2(-lineA.y, lineA.x);

        return {miterLength: 1/ miter.dot(tmp), miter : miter, tangent : tan};
    },

    normal : function (dir) {
        return dir.clone().set(-dir.y, dir.x)
    },
    direction : function( pointA, pointB ){
        var dirLine = pointB.clone().sub(pointA);
        dirLine = dirLine.normalize();
        return dirLine;
    }
}