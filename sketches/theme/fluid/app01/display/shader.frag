
varying vec2 vUv;

uniform vec3 uBaseCol;
uniform sampler2D tDiffuse;

void main(){
        gl_FragColor = vec4(texture2D(tDiffuse, vUv).rgb + uBaseCol, 1.0);
}