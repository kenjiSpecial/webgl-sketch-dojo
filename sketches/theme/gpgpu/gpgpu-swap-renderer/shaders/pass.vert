varying vec2 vUv;
uniform sampler2D texture;

void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}