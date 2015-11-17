
varying vec2 vUv;

uniform vec2 uWindow;

uniform sampler2D oldTexture;
uniform sampler2D nextTexture;

uniform float uTime;

void main(){

    float rate =  clamp(uTime / 1.0, 0.0, 1.0);
    vec4 oldFrame = texture2D(nextTexture, vUv);
    vec4 newFrame = texture2D(oldTexture, vUv);

    gl_FragColor = (rate) * oldFrame + (1.0 - rate) * newFrame;

}
