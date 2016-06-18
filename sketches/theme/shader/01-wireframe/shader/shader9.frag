uniform vec2 uSize;
uniform float uTime;
uniform float shaderValue;

varying vec2 vUv;
varying vec3 vBarycentric;

#pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)

float edgeFactor(){
        vec3 vec = vBarycentric;
        vec3 d = fwidth(vec);
//        float dis = tan( (vUv.x - 0.5) * sin(uTime)* (vUv.y-0.5) ) * distance(vUv, vec2(0.5)) + tan(uTime)/10.;
        float test = (cos( (atan( (-0.5+vUv.y), (-0.5 + vUv.x) )) * (sin(uTime) + 2.0) * (cos(uTime) + 2.0) * 0.5 + uTime * 2.0 ) + 1.0) * 0.5;
//        test -= 0.5;
        vec3 a3 = smoothstep(vec3(0.0), d * test + 0.1, vec + test );
//        a3.x += 0.1;
        return min(min(a3.x, a3.y), a3.z);
  }

void main(){
//    vec3 a3 = smoothstep(vec3(0.0), d*1.5, vBarycentric);

    gl_FragColor.rgb = mix(vec3(1.0), vec3(0.0), edgeFactor());
    float test = atan( (-0.5+vUv.y), (-0.5 + vUv.x) ) + 3.14; //* (1.0 - sin(cos(uTime) + uTime));
//    gl_FragColor.rgb += 0.1;
    gl_FragColor.a = 1.0;

//    float minVal = min(vBarycentric.x, min(vBarycentric.y , vBarycentric.z));
//    if(minVal < 0.01  ){
//    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//    }else{
//    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
//    }


}