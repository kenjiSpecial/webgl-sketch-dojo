precision highp float;

varying vec2 vUv;
varying vec3 vCurPos;
uniform sampler2D tMat;
uniform vec2 uWindow;

void main(){
    vUv = uv;

    // texture2D(tVelocity, vUv);
    vec3 pos = texture2D( tMat , position.xy ).rgb ;
    pos = (pos.rgb - vec3(0.5)) * vec3(uWindow, 512.);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos.rgb, 1.0 );
//    gl_PointSize = 3.0/(2. + pos.b);
    vec3 dif = cameraPosition - pos.xyz;

    gl_PointSize = 1.0; // * min( 5. ,  50. / length( dif ));
    vCurPos = vec3(1.0, 0.0, 0.0);//pos.rgb/10.;

}
