precision mediump float;

varying vec2 vUv;

uniform vec2 uWindow;
uniform float uTime;

#pragma glslify: random = require(glsl-random)

void main() {
    gl_FragColor = vec4( vec3( random( (gl_FragCoord.xy + vec2(uTime) ) * uWindow.xy ) ), 1.0 );
}
