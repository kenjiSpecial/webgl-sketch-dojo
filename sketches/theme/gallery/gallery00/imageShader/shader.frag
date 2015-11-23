
varying vec2 vUv;

uniform sampler2D tMain;
uniform sampler2D tNext;
uniform float uRate;
uniform float uNext;
uniform vec2 uImage;

void main(){
    vec4 col;

    if(uNext < 0.5){
        col = texture2D(tMain, vUv);
    }else{
        float curRate = uRate * (1.-uRate) * 4.0;
        curRate = clamp(curRate, 0., 1.);
        float imgHeight = curRate * uImage.y/100.;
        if(imgHeight < 1.0) imgHeight = 1.0;
        float yPos = (floor(gl_FragCoord.y / imgHeight) + 0.5) * imgHeight / uImage.y;
        float xPos;
        if(uNext > 0.75){
            xPos = (vUv.x  * (1.-curRate ) + vUv.y /4. * curRate  + uRate *2. * curRate * curRate * curRate);
        }else{
            xPos = (vUv.x  * (1.-curRate ) + (1.-vUv.y /4.) * curRate  - uRate *2. * curRate * curRate * curRate);
        }
        xPos = clamp(xPos, 0., 1.);
        vec2 vPos = vec2(xPos, yPos);

        float finalRate = clamp(uRate * uRate * uRate, 0.0, 1.0);

        vec4 transCol =  texture2D(tMain, vPos ) * (1.-finalRate) + texture2D(tNext, vPos ) * finalRate;
        col = transCol;// * (1. - curRate) + blackCol * (curRate);
    }

    gl_FragColor = col;
}