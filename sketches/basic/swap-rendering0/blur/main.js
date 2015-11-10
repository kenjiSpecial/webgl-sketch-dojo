var glslify = require('glslify');

module.exports = {
    uniforms: {
        "tDiffuse" : { type: "t", value: null },
        "uTexture" : { type: "t", value: null },
        "uWindow"  : { type: "v2", value: null }
    },
    vertexShader   : glslify('./shader.vert'),
    fragmentShader : glslify('./shader.frag')
};