uniform sampler2D uTexture;
uniform vec2 uWindow;
uniform vec2 uInvWindow;

varying vec2 vUv;

void main(){
    vec2 tc = vUv;
    float n = 512.;
    float h = 1.0/n;

    vec4 t = texture2D(uTexture, tc);
    t.r -= (texture2D(uTexture, vec2(tc.r + h, tc.g)).a - t.a)*n;
    t.g -= (texture2D(uTexture, vec2(tc.r, tc.g + h)).a - t.a)*n;
    gl_FragColor = t;
}