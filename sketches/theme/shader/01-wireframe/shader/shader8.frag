uniform vec2 uSize;
uniform float uTime;
uniform float shaderValue;

varying vec2 vUv;
varying vec3 vBarycentric;

#pragma glslify: pnoise2 = require(glsl-noise/periodic/2d)

float edgeFactor(){
        vec3 vec = vBarycentric;
        vec3 d = fwidth(vec);
        float dis = tan( (vUv.x - 0.5) * sin(uTime)* (vUv.y-0.5) ) * distance(vUv, vec2(0.5)) + tan(uTime)/10.;

        vec3 a3 = smoothstep(vec3(0.0), d + dis, vec  );
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