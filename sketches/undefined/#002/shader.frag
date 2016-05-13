varying vec2 vUv;

uniform vec3 color00, color01, color02, color03, color04;
uniform vec3 color10, color11, color12, color13, color14;
uniform sampler2D outlineTexture;

uniform sampler2D normalTexture;
uniform sampler2D playTexture;
uniform sampler2D pauseTexture;

uniform float playState;
uniform float hoverState;

void main() {

    float colRate = mod(vUv.y * 400.0, 100.0)/100.;
    float colNum = vUv.y * 4.;

    vec3 colRGB;

    if(colNum < 1.0){
        colRGB = mix(mix(color00, color01, colRate), mix(color10, color11, colRate), vUv.x);
    }else if(colNum < 2.0){
        colRGB = mix(mix(color01, color02, colRate), mix(color11, color12, colRate), vUv.x);
    }else if(colNum < 3.0){
        colRGB = mix(mix(color02, color03, colRate), mix(color12, color13, colRate), vUv.x);
    }else {
        colRGB = mix(mix(color03, color04, colRate), mix(color13, color14, colRate), vUv.x);
    }

    float alpha = texture2D(outlineTexture, vUv).a;

    vec4 coverColor = mix(texture2D(normalTexture, vUv), mix(texture2D(playTexture, vUv), texture2D(pauseTexture, vUv), playState), hoverState);


    gl_FragColor = vec4( colRGB/255. + coverColor.rgb * coverColor.a, alpha );
}