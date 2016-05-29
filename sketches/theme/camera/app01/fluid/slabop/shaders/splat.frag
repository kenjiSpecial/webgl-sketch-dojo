uniform sampler2D read;
uniform sampler2D uOpticalFlow;
uniform vec2 gridSize;
uniform vec2 point;
uniform vec3 uCol;
uniform float radius;


varying vec2 vUv;

float gauss(vec2 p, float r){
    return exp(-dot(p, p) / r);
}

void main(){
    vec3 base = texture2D(read, vUv).xyz;
    vec2 coord = point.xy - vUv.xy;
    vec3 splat = texture2D(uOpticalFlow, vUv).rgb;// * gauss(coord, gridSize.x * radius * 0.00000001);
    vec3 col = base + splat;
//    col *= 0.9;
    gl_FragColor = vec4(col, 1.0);
//gl_FragColor = vec4(base + 0.01, 1.0);
}