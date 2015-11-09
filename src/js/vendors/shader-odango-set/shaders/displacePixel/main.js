/**
 *
 * Created by kenjisaito on 11/8/15.
 *
 * Based on ofxDisplacePixels.h
 *
 * https://github.com/patriciogonzalezvivo/ofxFX/blob/master/src/operations/ofxDisplacePixels.h
 *
 * Use a normalMap (tex0) to displace pixels
 *
 */

var glslify = require('glslify');

module.exports = {
    uniforms: {
        "backBuffer"  : { type: "t" , value: null },
        "normalTexture"  : { type: "t" , value: null },
        "uWindow" : { type: "v2", value: null }
    },
    vertexShader   : glslify('../00common/shader.vert'),
    fragmentShader : glslify('./shader.frag')
};

