
varying vec2 vUv;

uniform sampler2D tMain;
uniform float uRate;
uniform float tTime;
uniform vec2 uMouse;


/**
void main(){
    vec4 col;

     if(uMouse.x > 10.){
        col = texture2D(tMain, vUv);
     }else{
        col = texture2D(tMain, vUv+ vec2( abs( length( uMouse - vUv) - 0.5 ) / 2. * uRate   ));
     }

    gl_FragColor = col;
} */

vec2 getDistortion(vec2 uv, float d, float t) {

	uv.x += (0.1 + uRate)/10. * cos(d + t * 0.9) * uRate;
	uv.y += (0.1 + uRate)/10. * sin(d + t * 0.75) * uRate;
	return uv;
}

vec4 getDistortedTexture(sampler2D iChannel, vec2 uv) {
	vec4 rgb = texture2D(iChannel, uv);
	return rgb;
}

void main(){
	vec2 mid = vec2(0.5,0.5);
	vec2 focus = uMouse;
	float d1 = distance(focus+sin(tTime * 0.25) * 0.5,vUv);
	//float d2 = distance(focus+cos(tTime),vUv);
	vec4 rgb = getDistortedTexture( tMain, getDistortion(vUv, d1, tTime));

//	rgb.r /= d2;
//	rgb.g += -0.5 + d1;
//	rgb.b = -0.5 + (d1 + d2) / 2.0;
//	vec4 col = uRate * rgb + (1. - uRate) * texture2D(tMain, vUv);

	gl_FragColor = rgb;
}