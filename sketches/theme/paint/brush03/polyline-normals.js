var THREE = require('three');
var util  = require('./polyline-miter-util');

var lineB, lineA;
var miter, tangent;

module.exports = function(points){
    var total = points.length
    var curNormal;
    var out = [];
    
    for (var ii=1; ii<total; ii++) {
        var last = points[ii-1]
        var cur = points[ii]
        var next = ii<points.length-1 ? points[ii+1] : null

        lineA = util.direction( last, cur )
        
        if (!curNormal)  {
            curNormal = util.normal(lineA)
        }

        if ( ii === 1) //add initial normals
            out.push(addNext(curNormal, 1));

        if (!next) { //no miter, simple segment
            curNormal = util.normal(lineA) //reset normal
            out.push(addNext(curNormal, 1));
        } else { //miter with last
            //get unit dir of next line
            lineB = util.direction( cur, next);

            //stores tangent & miter
            var { miterLength, miter, tangent } = util.computeMiter(lineA, lineB)
            out.push(addNext(miter, miterLength))
        }
    }

    return out;
}

function addNext(normal, length) {
    // out.push([[normal[0], normal[1]], length])
    return {normal : normal, lengh : length};
}