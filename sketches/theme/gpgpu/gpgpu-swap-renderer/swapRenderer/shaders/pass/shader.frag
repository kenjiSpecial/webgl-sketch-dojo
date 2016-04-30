uniform sampler2D texture;
uniform sampler2D tVelocity;
uniform float uSize;
varying vec2 vUv;

void main(){
    float unit = 1.0 / uSize;
    vec3 col = texture2D(texture, vUv).rgb;
    vec4 leftVel = texture2D(tVelocity, vUv - vec2(unit, 0.));
    vec4 rightVel= texture2D(tVelocity, vUv + vec2(unit, 0.));
    vec4 topVel= texture2D(tVelocity, vUv + vec2(0., unit));
    vec4 botVel= texture2D(tVelocity, vUv - vec2(0., unit));

    vec4 div = (rightVel - leftVel + topVel - botVel)/2.0;
    vec2 dDiv = div.xy;

    vec3 getCol = texture2D(texture, vUv - dDiv).rgb;

//    vec3 colO = texture2D(tVelocity, vUv).rgb;

//    vec4 outputCol = col;
    gl_FragColor = vec4( col + getCol/10., 1.0);
}