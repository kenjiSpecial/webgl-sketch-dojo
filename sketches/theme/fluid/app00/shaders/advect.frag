uniform sampler2D velocity;
uniform sampler2D target;

uniform vec2 uWindow;

vec3 bilerpVec3(sampler2D d, vec2 p){
    vec4 ij; // i0, j0, i1, j1
    ij.xy = floor(p - 0.5) + 0.5;
    ij.zw = ij.xy + 1.0;

    vec4 uv = ij / uWindow.xyxy;
    vec3 d11 = texture2D(d, uv.xy).rgb;
    vec3 d21 = texture2D(d, uv.zy).rgb;
    vec3 d12 = texture2D(d, uv.xw).rgb;
    vec3 d22 = texture2D(d, uv.zw).rgb;

    vec2 a = p - ij.xy;

    return mix(mix(d11, d21, a.x), mix(d12, d22, a.x), a.y);
}

void main(){
    vec2 uv = gl_FragCoord.xy / uWindow.xy;
    vec2 p = gl_FragCoord.xy -  5. * texture2D(velocity, uv).xy;
    vec4 outputPos = vec4( bilerpVec3(target, p), 1.0);

    gl_FragColor = outputPos;
}
