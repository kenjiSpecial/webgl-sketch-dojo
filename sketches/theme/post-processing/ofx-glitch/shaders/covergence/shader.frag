
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform vec2 uWindow;
uniform float uRandom;

void main(){

    vec4 col   = texture2D(tDiffuse, vUv);
    vec4 col_r = texture2D(tDiffuse, vUv + vec2(-35.0/uWindow.x * uRandom,0.));
    vec4 col_l = texture2D(tDiffuse, vUv + vec2( 35.0/uWindow.x * uRandom,0.));
    vec4 col_g = texture2D(tDiffuse, vUv + vec2( -7.5/uWindow.x * uRandom,0.));

    col.b = col.b + col_r.b*max(1.0,sin(vUv.y*12.)*2.5)*uRandom;
    col.r = col.r + col_l.r*max(1.0,sin(vUv.y*12.)*2.5)*uRandom;
    col.g = col.g + col_g.g*max(1.0,sin(vUv.y*12.)*2.5)*uRandom;

    gl_FragColor = col;
}