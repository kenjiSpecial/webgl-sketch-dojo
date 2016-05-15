uniform sampler2D uTexture;
uniform float uC;
uniform vec2 uWindow;

varying vec2 vUv;

void main(){
   vec2 tc =vUv;
    float h = 1.0/512.;
   vec4 t = texture2D(uTexture, tc);
   t.g += uC*(t.b + texture2D(uTexture, vec2(tc.r, tc.g + h)).b );
   gl_FragColor = t;
}