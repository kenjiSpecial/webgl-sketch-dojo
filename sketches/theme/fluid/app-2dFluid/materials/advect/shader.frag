uniform sampler2D uTexture;
uniform vec2 uWindow;

varying vec2 vUv;
void main(){
    float w = 1.0/512.;
    float h = 1.0/512.;
    float dt = 0.001;
    float tau = 0.5 * dt/h;
    float tauW = 0.5 * dt/w;
    vec2 tc = vUv;

    vec2 D = -tau*vec2(
         texture2D(uTexture, tc).r + texture2D(uTexture, vec2(tc.r - h, tc.g)).r,
         texture2D(uTexture, tc).g + texture2D(uTexture, vec2(tc.r, tc.g - h)).g );
       vec2 Df = floor(D),   Dd = D - Df;
       vec2 tc1 = tc + Df*h;
       vec3 new =
         (texture2D(uTexture, tc1).rgb*(1. - Dd.g) +
          texture2D(uTexture, vec2(tc1.r, tc1.g + w)).rgb*Dd.g)*(1. - Dd.r) +
         (texture2D(uTexture, vec2(tc1.r + w, tc1.g)).rgb*(1. - Dd.g) +
          texture2D(uTexture, vec2(tc1.r + w, tc1.g + h)).rgb*Dd.g)*Dd.r;
       gl_FragColor = vec4( new, texture2D(uTexture, tc).a );
}