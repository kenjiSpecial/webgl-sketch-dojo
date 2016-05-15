varying vec2 vUv;

uniform sampler2D samp;
uniform sampler2D samp2;

void main() {
    vec4 t = texture2D(samp,vUv);
    t.b += texture2D(samp2, vUv).b;
    gl_FragColor = t;
}