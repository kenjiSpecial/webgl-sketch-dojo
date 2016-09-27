
//  Based on of
//  Based on http://www.iquilezles.org/apps/shadertoy/ Postprocessing shader
//

var glslify = require('glslify')

module.exports = {
    uniforms: {
        "tDiffuse": { type: "t", value: null },
    },
    vertexShader   : glslify('../common/shader.vert'),
    fragmentShader : glslify('./shader.frag')
};