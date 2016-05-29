/*
    Horn-Schunke Optical Flow
    Based on shader by Andrew Benson
    https://github.com/v002/v002-Optical-Flow/blob/master/v002.GPUHSFlow.frag

    Creative Commons, Attribution – Non Commercial – Share Alike 3.0
    http://v002.info/licenses/
*/

varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uPreviousTexture;

uniform vec2 uResolution;
uniform vec2 uScale;
uniform float uOffset;
uniform float uLambda;

void main(){
    vec4 curCol = texture2D(uTexture, vUv);
    vec4 prevCol = texture2D(uPreviousTexture, vUv);
    vec2 offset = uOffset / uResolution;
    vec2 x1 = vec2(offset.x, 0.0);
    vec2 y1 = vec2(0.0, offset.y);

    vec4 curDif = prevCol - curCol;

    vec4 gradX = texture2D(uTexture, vUv + x1) - texture2D(uTexture, vUv - x1);
    gradX += texture2D(uPreviousTexture, vUv + x1) - texture2D(uPreviousTexture, vUv - x1);

    vec4 gradY = texture2D(uTexture, vUv + y1) - texture2D(uTexture, vUv - y1);
    gradY += texture2D(uPreviousTexture, vUv + y1) - texture2D(uPreviousTexture, vUv - y1);

    vec4 gradMag = sqrt(gradX * gradX + gradY * gradY + vec4(uLambda));
    vec4 vx = curDif * (gradX/gradMag);
    float vxd = vx.r;

    vec4 vy = curDif * (gradY/gradMag);
    float vyd = vy.r;

    gl_FragColor = vec4( vec2(vxd, vyd), 0.0, 1.0); //vec4(xOut.rg, 0.0, 1.0);
}