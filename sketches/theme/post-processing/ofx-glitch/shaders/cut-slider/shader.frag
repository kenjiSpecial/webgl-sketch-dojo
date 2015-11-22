
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uWindow;
uniform float uRandom;

void main(){
    vec4 col = texture2D(tDiffuse, vUv + vec2(floor(sin(vUv.y*30.0*uRandom+uRandom*uRandom))* 10.0/ uWindow.x *uRandom,0.));
    gl_FragColor = col;
}