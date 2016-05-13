uniform sampler2D tOPos;
uniform sampler2D tPos;

uniform float dT;
uniform float noiseSize;
uniform float damping;
uniform float friction;
uniform vec2  resolution;

varying vec2 vUv;

//$simplex
//$curl

#pragma glslify:curlNoise = require(glsl-curl-noise)

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main(){

  vec2 uv = gl_FragCoord.xy / resolution;
  vec4 oPos = texture2D( tOPos , uv );
  vec4 pos  = texture2D( tPos , uv );

  vec3 vel = pos.xyz - oPos.xyz;

  vec3 curl = curlNoise( pos.xyz * noiseSize );

  vel += curl;
  vel *= damping; // dampening


  vec3 p = pos.xyz + vel;
  p *= friction;
//  p.x += 0.01;
//  p.y += 0.01;
//  p.z += 0.01;


  gl_FragColor = vec4( p , 1. );


}