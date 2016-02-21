uniform sampler2D tNormal;
uniform sampler2D tNoise;
uniform sampler2D tDiffuse;
uniform samplerCube tCube;

uniform vec2 uvOffset;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vTransformNormal;
varying vec3 vWorldPosition;

vec3 unpackNormal(vec3 eyePos, vec3 surfNorm, sampler2D normalMap, float intensity, float scale, vec2 uv ){
    vec3 surfNormalizeNorm = normalize(surfNorm);

    vec3 q0  = dFdx(eyePos.xyz);
    vec3 q1  = dFdy(eyePos.xyz);
    vec2 st0 = dFdx(uv.st);
    vec2 st1 = dFdy(uv.st);

    vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
    vec3 N = normalize( surfNormalizeNorm );

    vec3 mapN = texture2D( normalMap, uv * scale ).xyz * 2.0 - 1.0;
    mapN.xy *= intensity;
    mat3 tsn = mat3( S, T, N );

    return normalize( tsn * mapN );
}

#pragma glslify: range = require(ks-glsl-utils/range);

vec3 reflection(vec3 worldPosition, vec3 normal) {
    vec3 cameraToVertex = normalize(worldPosition - cameraPosition);

    return reflect(cameraToVertex, normal);
}

vec3 refraction(vec3 worldPosition, vec3 normal, float rRatio) {
    vec3 cameraToVertex = normalize(worldPosition - cameraPosition);

    return refract(cameraToVertex, normal, rRatio);
}

vec4 envColor(samplerCube map, vec3 vec) {
    float flipNormal = 1.0;
    return textureCube(map, flipNormal * vec3(-1.0 * vec.x, vec.yz));
}

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

float calculateLight(vec3 normal){
    vec3 lightPos = vec3( 0., 1000., 1000.);
    float light = max(dot(normalize(lightPos), normal), 0.0) ;
    light = range(light, 0.0, 1.0, 0.2, 1.0);
    return light;
}

void main(){

    vec3 normal = unpackNormal(-vViewPosition, vTransformNormal, tNormal, 1.0, 5.0, vUv + uvOffset);
    vec4 noise = texture2D( tNoise, 4.0 * (vUv + uvOffset));
    float light = calculateLight(normal);

    float n = range(noise.r, 0.0, 1.0, 0.9, 1.0);

    vec3 diffuse = texture2D(tDiffuse, 2.0 * (vUv * uvOffset)).rgb;
    vec3 colorMap = vec3(1.);
    /**
    // vec3 colorMap = texture2D(tColor, vUv).tgb;
    // colorMap += emissive;

    vec3 reflectVec = reflection(vWorldPosition, normal);
    vec3 sky = envColor(tCube, reflectVec).rgb;

    float reflectNoise = clamp(range(diffuse.r, 0.87, 1.0, 0.0, 1.0), 0., 1.);

    */

    vec3 color = diffuse * colorMap * light;
//    color += sky * 0.1 * reflectNoise;

    gl_FragColor = vec4(color, 1.0);

}