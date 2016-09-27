varying vec2 vUv;
uniform float opacity;

uniform sampler2D tDiffuse;

void main() {
    vec4 texel = texture2D( tDiffuse, vUv );
    gl_FragColor = texel * opacity;
}
