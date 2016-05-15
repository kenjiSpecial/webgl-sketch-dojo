uniform sampler2D uTexture;
uniform sampler2D uVelocity;
uniform sampler2D uOriginTexture;

uniform vec2 uWindow;
uniform vec2 uMouse;
uniform float uDis;
uniform float uTime;

varying vec2 vUv;

vec4 bilerp(sampler2D d, vec2 p)
{
    vec4 ij; // i0, j0, i1, j1
    ij.xy = floor(p - 0.5) + 0.5;
    ij.zw = ij.xy + 1.0;

    vec4 uv = ij / uWindow.xyxy;
    vec4 d11 = texture2D(d, uv.xy);
    vec4 d21 = texture2D(d, uv.zy);
    vec4 d12 = texture2D(d, uv.xw);
    vec4 d22 = texture2D(d, uv.zw);

    vec2 a = p - ij.xy;

    return mix(mix(d11, d21, a.x), mix(d12, d22, a.x), a.y);
}

void main()
{
    float theta = texture2D(uVelocity, vUv).x * 6. ;
    vec2 p = vUv - 0.001 * vec2(cos(theta), sin(theta));
    p.x *= uWindow.x;
    p.y *= uWindow.y;


        vec4 originCol = texture2D(uOriginTexture, vUv);
    float dis = distance(vUv * uWindow.xy, uMouse * uWindow.xy);
     if(dis < uDis){
        gl_FragColor = originCol;
     }else{
        vec4 calCol =  bilerp(uTexture, p);
        gl_FragColor = calCol ;
     }


}