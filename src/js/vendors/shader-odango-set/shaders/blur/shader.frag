
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 uWindow;

float kernel[9];
vec2  offset[9];

void main(){
    vec4 sum = vec4(0.0);

    float dx = 1.0/uWindow.x;
    float dy = 1.0/uWindow.y;
    offset[0] = vec2(-dx, -dy);
    offset[1] = vec2(0.0, -dy);
    offset[2] = vec2(1.0, -dy);

    offset[3] = vec2(-dx, 0.0);
    offset[4] = vec2(0.0, 0.0);
    offset[5] = vec2(dx, 0.0);

    offset[6] = vec2(-dx, dy);
    offset[7] = vec2(0.0, dy);
    offset[8] = vec2(dx, dy);

    kernel[0] = 1.0/16.0;   kernel[1] = 2.0/16.0;   kernel[2] = 1.0/16.0;
    kernel[3] = 2.0/16.0;   kernel[4] = 4.0/16.0;   kernel[5] = 2.0/16.0;
    kernel[6] = 1.0/16.0;   kernel[7] = 2.0/16.0;   kernel[8] = 1.0/16.0;

    for(int i = 0; i < 9; i++){
        vec4 tmp = texture2D( tDiffuse, vUv + offset[i]);
        sum += tmp * kernel[i];
    }

    gl_FragColor = sum;
}