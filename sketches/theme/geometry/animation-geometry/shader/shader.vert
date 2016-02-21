// #extension GL_EXT_frag_depth : enable

uniform sampler2D tNormal;
uniform sampler2D tNoise;
uniform sampler2D tDiffuse;
uniform sampler2D tInteraction;
uniform float uTime;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vTransformNormal;
varying vec3 vWorldPosition;

#pragma glslify: range = require(ks-glsl-utils/range);

void main(){
    vUv = uv;
    //tInteraction

//    vec3 pos = position + vec3(0., 0., -texture2D(tInteraction, vUv).r * 10.);
    vec3 pos = position;
    float deform = texture2D(tInteraction, uv).r;
//    deform = clamp(range(deform, 0.3, 1.0, 0.0, 1.0), 0.0, 1.0);

    deform *= smoothstep(950.0, 900.0, pos.x);
    deform *= smoothstep(-950.0, -900.0, pos.x);
    deform *= smoothstep(950.0, 900.0, pos.z);
    deform *= smoothstep(-950.0, -900.0, pos.z);

    pos += -normal * 500.0 * deform;

    float rad = length(vec2(uv.x-0.5, uv.y-0.5));
    float dis = rad - clamp(0.015 * uTime, 0., 0.5);
    float rate = 1.0 - clamp(dis, 0.0, 1.0);
//    pos.z *= clamp(0.1 * uTime - 0.1, 0., 1.0);

     pos.x *= rate * rate;
     pos.y *= rate * rate;
//    }else{
//        pos.x
//    }

//    -texture2D(tInteraction, vUv).r * 20. * normal;

    //pos +=
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = pos;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    vTransformNormal = normalMatrix * normal;

    gl_Position = projectionMatrix * mvPosition;

}