precision highp float;

varying vec2 vUv;
varying vec3 vCurPos;
//uniform sampler2D tVelocity;
uniform sampler2D tMap;

void main(){
//    vec4 velocity = texture2D(tMap, vUv);
//    vec4 tPosition = texture2D(tPosition, vUv);
//
//    vec4 position = tPosition + velocity/100.;
//    position *= 0.95;

    gl_FragColor = vec4(vCurPos, 1.0) ; //vec4(1.0, 0.0, 0.0, 1.0);
}