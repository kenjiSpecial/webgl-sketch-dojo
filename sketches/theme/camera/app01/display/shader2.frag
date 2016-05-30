
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform sampler2D tDensity;

void main(){
        gl_FragColor = vec4(texture2D(tDensity, vUv).rgb, 1.0);
}