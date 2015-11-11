var glslify = require('glslify');

module.exports = {

    vertexShader   : glslify('./shader.vert'),
    fragmentShader : glslify('./shader.frag')
};