uniform sampler2D tPos;
varying vec2 vUv;

void main(){
  vUv = uv;
  vec4 pos = texture2D( tPos, position.xy );
  vec3 dif = cameraPosition - pos.xyz;

  gl_PointSize =  10.; //max(min( 10. ,  200. / length( dif )), 2.0);
//  pos.x = min(pos.x, 10.);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos.xyz, 1. );



}
