uniform sampler2D tPos;
varying vec2 vUv;

void main(){
  vUv = uv;
  vec4 pos = texture2D( tPos, position.xy );
  vec3 dif = cameraPosition - pos.xyz;

  gl_PointSize =  max(min( 100. ,  400. / length( dif )), 2.0);
//  pos.x = min(pos.x, 10.);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos.xyz, 1. );



}
