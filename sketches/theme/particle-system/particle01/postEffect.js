var glslify = require('glslify');

module.exports = {
    uniforms: {
        "tDiffuse": { type: "t", value: null },
        "bgTex"   : { type: "t", value: null },
        "uWindow" : { type: "v2", value: null },
        "uOpacity" : { type: "f", value: null },
    },
    vertexShader   : glslify('./post-effect.vert'),
    fragmentShader : glslify('./post-effect.frag')
};