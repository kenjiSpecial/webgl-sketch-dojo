varying vec2 vUv;

void main(){
   float dis = distance(gl_PointCoord.xy, vec2(0.5, 0.5));
//vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);


  gl_FragColor = vec4( 1.0, 1.0, 1.0, clamp(1. - dis * 5., 0., 1.)  );
}
