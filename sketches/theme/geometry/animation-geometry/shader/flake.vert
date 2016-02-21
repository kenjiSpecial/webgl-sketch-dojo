uniform float size;
uniform sampler2D tColor;

attribute float scale;
attribute float alpha;
attribute float time;

varying float vAlpha;
varying float vTime;

#pragma glslify: range = require(ks-glsl-utils/range);
void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (size * scale) * (1000.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;

    float fade = smoothstep(900.0, 600.0, position.y);

    vAlpha = alpha * fade ;
    vTime = time;
}