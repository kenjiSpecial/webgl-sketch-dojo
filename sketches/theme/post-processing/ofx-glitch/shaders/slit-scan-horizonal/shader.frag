
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uRandom;
uniform vec2 uWindow;
uniform float uValue;

void main(){
    vec2 texCoord = vec2( gl_FragCoord.x, 3.0+floor(gl_FragCoord.y/uValue)*uValue );
    vec4 texel = texture2D( tDiffuse, texCoord/uWindow );
    gl_FragColor = texel;
}