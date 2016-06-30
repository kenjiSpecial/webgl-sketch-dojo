    uniform vec2 uSize;
uniform float uTime;
uniform float shaderValue;

varying vec2 vUv;
varying vec3 vBarycentric;

#pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)

float edgeFactor(){
        vec3 vec = vBarycentric;
        vec3 d = fwidth(vec);
//        vec3 a3 = smoothstep(vec3(0.0), d*1.0 * (1.0 + 3.0 * sin( 10. * (vUv.x - 0.5) * (vUv.x - 0.5) * sin(uTime * 3.)+ 10. * (vUv.y-0.5) * (vUv.y-0.5) * cos( uTime ) )), vec * cos(uTime) * sin(uTime));
//        float modVal = mod(uTime, 4.);
//        d = 100. * vec3(d.x * d.x, d.y * d.y, d.z*d.z);
        vec3 a3 = smoothstep(vec3(0.0),
        d  * sin( 20. * (0.5 - vUv.x ) * (0.5 - vUv.y) * cos(uTime + vUv.y * 10.) )  * cos( 20. * (0.5 - vUv.x ) * (0.5 - vUv.y ) * cos(uTime + vUv.y) ) * sin( 10. * (0.5 - vUv.x ) * (0.5 - vUv.y ) * cos(uTime * 2. + vUv.x) ) * cos( 10. * (0.5 - vUv.x ) * (0.5 - vUv.y ) * cos(uTime + vUv.x * 10.) ),
        vec );
//        0.5 * cos(uTime * vUv.x * 10.0) * 0.5 * sin(uTime * vUv.y * 10.0
        return min(min(a3.x, a3.y), a3.z);
  }

void main(){
//    vec3 a3 = smoothstep(vec3(0.0), d*1.5, vBarycentric);

    gl_FragColor.rgb = mix(vec3(1.0), vec3(0.0), edgeFactor());
    gl_FragColor.a = 1.0;

//    float minVal = min(vBarycentric.x, min(vBarycentric.y , vBarycentric.z));
//    if(minVal < 0.01  ){
//    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//    }else{
//    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
//    }


}