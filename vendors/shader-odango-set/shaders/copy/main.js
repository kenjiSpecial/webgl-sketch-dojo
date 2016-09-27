var glslify = require('glslify')

module.exports = {
    uniforms: {
        "tDiffuse": { type: "t", value: null },
        "opacity":  { type: "f", value: 1.0 }
    },
    vertexShader   : glslify('../00common/shader.vert'),
    fragmentShader : glslify('./shader.frag')
};