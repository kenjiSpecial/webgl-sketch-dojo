module.exports = function(size){
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(  size * size * 3 );

    for ( var i = 0, j = 0, l = positions.length / 3; i < l; i ++, j += 3 ) {

        positions[ j     ] = ( i % size ) / size;
        positions[ j + 1 ] = Math.floor( i / size ) / size;
        
    }

    var posAtt = new THREE.BufferAttribute( positions , 3 );
    geo.addAttribute( 'position', posAtt );

    return geo;

};