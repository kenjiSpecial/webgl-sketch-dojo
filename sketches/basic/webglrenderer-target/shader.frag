varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float opacity;

void main(){
    vec4 texel  = texture2D( tDiffuse, vUv );
    gl_FragColor = texel * opacity + vec4(0.0, 0.0, 0.0, 1.0) * (1. - opacity);
}