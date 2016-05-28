uniform sampler2D texture;
uniform vec3 baseCol;

varying vec2 vUv;

void main(){
    gl_FragColor = texture2D(texture, vUv) + vec4(baseCol.rgb, 0.0);
}