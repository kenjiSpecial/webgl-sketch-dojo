uniform sampler2D texture;
varying vec2 vUv;

void main(){
    gl_FragColor = vec4(0.1, 0.0, texture2D(texture, vUv).r/80., 1.0);
}