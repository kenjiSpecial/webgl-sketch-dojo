uniform sampler2D tDiffuse;
uniform sampler2D tAdd;
uniform float fCoeff;

varying vec2 vUv;

void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec4 add = texture2D(tAdd, vUv);
    gl_FragColor = texel + add * fCoeff;
}