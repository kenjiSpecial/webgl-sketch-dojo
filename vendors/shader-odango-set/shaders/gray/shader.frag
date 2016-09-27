
varying vec2 vUv;
uniform sampler2D tDiffuse;

void main(){
    vec4 texel = texture2D( tDiffuse, vUv );
    float luminance = dot( vec3 (0.2125, 0.7154, 0.0721), vec3(texel));
    gl_FragColor = vec4(luminance, luminance, luminance, texel.a);
}