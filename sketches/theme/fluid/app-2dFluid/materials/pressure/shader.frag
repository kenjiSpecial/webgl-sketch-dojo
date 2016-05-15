uniform sampler2D uTexture;
uniform vec2 uWindow;
uniform vec2 uInvWindow;

varying vec2 vUv;

void main(){
    vec4 t = texture2D(uTexture, vUv);
    vec2 tc = vUv;
    float w = 1.0/512.;//uInvWindow.x;
    float h = 1.0/512.; //uInvWindow.y;

    t.a =
         (texture2D(uTexture, vec2(tc.r - w, tc.g)).a +
          texture2D(uTexture, vec2(tc.r + w, tc.g)).a +
          texture2D(uTexture, vec2(tc.r, tc.g - h)).a +
          texture2D(uTexture, vec2(tc.r, tc.g + h)).a -
         (t.r - texture2D(uTexture, vec2(tc.r - w, tc.g)).r +
          t.g - texture2D(uTexture, vec2(tc.r, tc.g - h)).g) *h) *.25;

    gl_FragColor = t;
}