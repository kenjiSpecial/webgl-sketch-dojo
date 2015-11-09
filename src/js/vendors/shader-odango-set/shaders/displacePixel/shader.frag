
varying vec2 vUv;

uniform vec2 uWindow;
uniform sampler2D backBuffer;
uniform sampler2D normalTexture;

void main(){

    vec4 newFrame = texture2D(backBuffer, vUv);
    vec4 color = vec4(0., 0., 0., 0.);
    vec2 norm = ( texture2D(normalTexture, vUv).rg - vec2(0.5) ) * 2.0;
    float inc = (abs(norm.x) + abs(norm.y)) * 0.5;

    vec2 offset[36];
    float fTotal = 36.0;

    float pi = 3.14159265358979323846;
    float step = (pi*2.0)/fTotal;
    float angle = 0.0;
    for (int i = 0; i < 36; i++) {
       offset[i].x = cos(angle)/uWindow.x;
       offset[i].y = sin(angle)/uWindow.y;
       angle += step;
    }

    float sources = 0.0;
    for(int i = 0; i < 36; i++){
        vec4 goingTo = (texture2D( normalTexture, vUv + offset[i] ) - vec4(0.5)) * 2.0;

        if ( dot( goingTo.xy ,offset[i]) < -1.0/36.0 ){
           sources += 1.0;
           color += texture2D(backBuffer, vUv + offset[i]);
        }
    }

    if(sources > 0.){
        color = color / sources;
    }else{
        color = vec4(0.0);
     }

    gl_FragColor =  color*(1.0 - inc) + newFrame * inc;

}
