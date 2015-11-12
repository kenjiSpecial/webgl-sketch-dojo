
varying vec2 vUv;

uniform vec2 uWindow;
uniform sampler2D backBuffer;
uniform float uTime;

void main(){

    float rate =  uTime / 2.0;

    vec4 newFrame = texture2D(backBuffer, vUv);
    gl_FragColor =  newFrame;



}
