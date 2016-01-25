var glslify = require('glslify')

module.exports = {
    uniforms: {
        "tMain": { type: "t", value: null },
        "uRate": { type: "f", value: 0.0  },
        "uNext": { type: "f", value: 0.0  },
        'uMouse' : { type: "v2", value: new THREE.Vector2(-9999, -9999)}
    },
    side: THREE.DoubleSide,
    vertexShader   : glslify('./shader.vert'),
    fragmentShader : glslify('./shader.frag')
};