
varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec3 baseCol;


void main(){
    vec3 col = texture2D(uTexture, vUv).rgb + baseCol;
    float gray = (col.r + col.g + col.b) / 3.0;
    gray = (gray - 0.5) * 2.0;

    gl_FragColor = vec4(gray, gray, gray, 1.0);
}