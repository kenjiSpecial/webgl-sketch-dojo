
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uRandom;
uniform vec2 uWindow;
uniform float uValue;

void main(){
    float slit_h = uValue;
    vec2 texCoord = vec2( slit_h/2.+floor(gl_FragCoord.x/slit_h)*slit_h , gl_FragCoord.y );
    vec4 texel = texture2D( tDiffuse, texCoord/uWindow );
    gl_FragColor = texel;
}