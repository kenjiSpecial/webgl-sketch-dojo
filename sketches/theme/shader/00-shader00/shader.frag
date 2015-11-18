
uniform int percent;
uniform vec2 uResolution;
uniform vec2 uTopLeft;

#pragma glslify: setType = require(./util.glsl);

void main() {
    vec3 col = setType( uResolution, uTopLeft );

    gl_FragColor = vec4( col, 1. );
}