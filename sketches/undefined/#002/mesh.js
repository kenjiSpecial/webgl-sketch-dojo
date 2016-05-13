import CustomGeometry from "./geometry";
var glslify = require('glslify');

export default class Mesh extends THREE.Mesh {
    constructor(){

        var  material =  new THREE.ShaderMaterial( {
            uniforms: {
                time: { type: "f", value: 1.0 },
                resolution: { type: "v2", value: new THREE.Vector2() }
            },
            vertexShader   : glslify('./shader.vert'),
            fragmentShader : glslify('./shader.frag'),
            side : THREE.DoubleSide
        } );
        super( new CustomGeometry({width: 200, height: 200, widthSegment : 4, heightSegment: 1 }), material);
        
    }
    updateLoop(dt){
        // this.geometry.updateLoop(dt);
    }

}