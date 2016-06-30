var glslify = require('glslify');

module.exports = QuntumGodray;

function QuntumGodray(){
    this.uniforms = {
        tDiffuse: {
            type: "t",
            value: null
        },
        tAdd: {
            type: "t",
            value: null
        },
        fCoeff: {
            type: "f",
            value: 1
        }
    };
    this.vertexShader = glslify('./shader.vert')
    this.fragmentShader = glslify('./shader.frag')
}