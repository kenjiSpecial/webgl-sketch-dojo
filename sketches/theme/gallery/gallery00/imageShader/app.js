var glslify = require('glslify')

module.exports = {
    uniforms: {
        "tMain": { type: "t", value: null },
        "tNext": { type: "t", value: null },
        "uImage": { type: "v2", value: new THREE.Vector2(512, 512) },
        "uRate": { type: "f", value: 0.0  },
        "uNext": { type: "f", value: 0.0  }
    },
    side: THREE.DoubleSide,
    vertexShader   : glslify('./shader.vert'),
    fragmentShader : glslify('./shader.frag')
};