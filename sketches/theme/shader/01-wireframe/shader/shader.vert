attribute vec3 barycentric;

varying vec2 vUv;
varying vec3 vBarycentric;

void main() {
    vBarycentric = barycentric;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}