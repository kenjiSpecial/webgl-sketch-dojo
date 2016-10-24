varying vec2 vUv;

uniform float uTime;
uniform float uColorDiffuse;
uniform sampler2D bgTexture;
uniform sampler2D noise1;
uniform sampler2D noise2;
uniform sampler2D noise3;

void main() {
    vec4 noise1 = texture2D(noise1, vUv);
    vec4 noise2 = texture2D(noise2, vUv);
    vec4 noise3 = texture2D(noise3, vUv);
    vec2 texPos = clamp( vec2(vUv.x, vUv.y * (1.0 - uTime * uColorDiffuse)) + uColorDiffuse * uTime * (vec2(noise1.x, noise2.y) - vec2(0.5)), vec2(0), vec2(1.));
    vec4 bgCol = texture2D(bgTexture, texPos);

    float uScale = 0.6;
    float uScroll = 0.4;
    float alpha = clamp(  uScale * noise3.y + 1.0 +  uScroll * vUv.y - (1.0 + uScale + uScroll) * uTime , 0.0, 1.0);
//    vec3 color = mix( vec3(1.), bgCol.rgb, );

    gl_FragColor = vec4(bgCol.rgb,  alpha * (2.0 - alpha)  );
}
