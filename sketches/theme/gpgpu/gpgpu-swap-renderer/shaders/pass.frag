uniform sampler2D texture;
varying vec2 vUv;

void main(){
    gl_FragColor = vec4(texture2D(texture, vUv).rgb, 1.0);
}