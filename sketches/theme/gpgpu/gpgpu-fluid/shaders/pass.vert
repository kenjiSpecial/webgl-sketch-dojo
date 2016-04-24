varying vec2 vUv;
uniform sampler2D tPos;

void main() {
      vUv = uv;

      vec4 pos = texture2D( tPos, uv.xy );
      vec4 outputPos = vec4(position.x + pos.x, position.y + pos.y, position.z + pos.z, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * outputPos;
}