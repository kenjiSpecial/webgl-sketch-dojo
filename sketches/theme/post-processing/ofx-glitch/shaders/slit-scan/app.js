var glslify = require('glslify')

module.exports = {
    uniforms: {
        "tDiffuse": { type: "t", value: null },
        "uWindow":  { type: "v2", value: null },
        "uRandom" : { type: "f", value: 0 },
        "uTime":    { type: "f", value: 0 },
        "uValue":   { type: "f", value: 0 }
    },
    vertexShader   : glslify('./shader.vert'),
    fragmentShader : glslify('./shader.frag')
};