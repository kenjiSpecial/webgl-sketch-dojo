varying vec2 vUv;
uniform sampler2D tVelocity;
uniform sampler2D tPosition;

void main(){

    vec4 tPosition = texture2D(tPosition, vUv);
    vec4 velocity = texture2D(tVelocity, vUv);

    vec4 position = tPosition +  velocity/100.;
//    position *= 0.95;

    gl_FragColor = vec4(position.rgb, 1.0);
}