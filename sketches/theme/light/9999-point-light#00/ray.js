
THREE.GodRay =  {
    uniforms : {
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
            value: 1.1
        },
        fExposure: {
            type: "f",
            value: 2.9
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
            value: 0.9
        },
        fClamp: {
            type: "f",
            value: 1
        }
    },
    vertexShader : require('./effect.vert')(),
    fragmentShader : require('./ray.frag')()
};