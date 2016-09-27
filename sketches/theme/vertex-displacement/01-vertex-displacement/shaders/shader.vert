varying vec3 vPos;
varying vec3 vNormal;

uniform float uTime;

vec3 getNewVertPosition(){
    vec3 outputPos = (modelMatrix * vec4(position, 1.0)).xyz;
    float melt = outputPos.y;
    melt = 1. - clamp(melt, 0., 1.);

    vec3 uNormal = normal;
    uNormal = normalize(uNormal);
    outputPos.y = max(position.y/10., outputPos.y);
    outputPos.xz = outputPos.xz + uNormal.xz * melt * 10.;


    return outputPos;
}

void main() {
  vec3 outputPos = getNewVertPosition();
//  outputPos.x = outputPos.x + sin(outputPos.y * 2. + 1.0 * uTime);

  vPos = (modelMatrix * vec4(outputPos, 1.0 )).xyz;
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * viewMatrix * vec4(outputPos,1.0);
}