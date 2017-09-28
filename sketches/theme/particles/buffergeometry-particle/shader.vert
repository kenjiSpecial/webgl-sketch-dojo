precision highp float;
precision highp int;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec3 vNormal;
varying vec2 vUv;

void main(){
  vNormal = normal;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position + vec3(uv, 0.0) * 10., 1.0 );
}