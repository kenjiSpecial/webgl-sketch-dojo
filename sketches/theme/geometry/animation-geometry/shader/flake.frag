uniform sampler2D tMap;

varying float vTime;
varying float vAlpha;

void main() {
    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    vec4 texel = texture2D(tMap, uv);

    if(vTime < 0.0) texel.a *= 0.0;
    else if(vTime > 3.0) texel.a *= vAlpha * clamp((5.0 - vTime), 0.0, 1.0) * 0.6;
    else            texel.a *= vAlpha * 0.6;


    gl_FragColor = texel;
}