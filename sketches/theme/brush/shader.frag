//#ifdef GL_OES_standard_derivatives
//	#extension GL_OES_standard_derivatives : enable
//#endif


#pragma glslify: aastep = require('glsl-aastep')
#pragma glslify: noise2 = require('glsl-noise/simplex/2d')


varying vec2 vUv;
uniform sampler2D tDiffuse;

void main(){
	/**
    vec4 texel  = texture2D( tDiffuse, vUv );
    float alpha = ink(0, texel.a, vUv);
    */


    vec4 texel  = texture2D( tDiffuse, vUv );
    float sdf = texel.a;
	float alpha = 0.0;
    alpha += aastep(0.5, sdf + noise2(vUv * 1000.0) * 0.1) * 1.0;
    alpha += aastep(0.5, sdf + noise2(vUv * 50.0) * 0.2) * 0.3;
    alpha += aastep(0.5, sdf + noise2(vUv * 500.0) * 0.2) * 0.3;

    gl_FragColor = vec4( texel.rgb, alpha ); // * opacity + vec4(0.0, 0.0, 0.0, 1.0) * (1. - opacity);
}