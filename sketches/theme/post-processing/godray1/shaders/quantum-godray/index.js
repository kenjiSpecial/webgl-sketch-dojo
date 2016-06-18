var glslify = require('glslify');

module.exports = QuntumGodray;

function QuntumGodray(){
    this.uniforms = {
        tDiffuse: {
            type: "t",
            value: null
        },
        fX: {
            type: "f",
            value: 0.5
        },
        fY: {
            type: "f",
            value: 0.5
        },
        fExposure: {
            type: "f",
            value: 0.9
        },
        fDecay: {
            type: "f",
            value: 0.93
        },
        fDensity: {
            type: "f",
            value: 0.96
        },
        fWeight: {
            type: "f",
            value: 0.8
        },
        fClamp: {
            type: "f",
            value: 1
        },
    };
    this.vertexShader = glslify('./shader.vert');
    this.fragmentShader = glslify('./shader.frag');
}