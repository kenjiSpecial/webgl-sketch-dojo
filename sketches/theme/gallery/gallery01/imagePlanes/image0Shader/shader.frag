
varying vec2 vUv;

uniform sampler2D tMain;
uniform float uRate;
uniform float uNext;
uniform vec2 uMouse;

void main(){
    vec4 col;

     if(uMouse.x > 10.){
        col = texture2D(tMain, vUv);
     }else{
        col = texture2D(tMain, vUv+ vec2( abs( length( uMouse - vUv) - 0.5 ) / 2. * uRate   ));
     }

    gl_FragColor = col;
}