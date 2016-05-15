
varying vec2 vUv;
uniform sampler2D samp;

void main() {
    float ttt = texture2D(samp, vUv).b;

    if(ttt > 0.) gl_FragColor = vec4(ttt, 0., 0., 1.);
    else gl_FragColor = vec4(0., 0., -ttt, 1.);
}