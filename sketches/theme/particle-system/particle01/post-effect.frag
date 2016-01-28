varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform sampler2D bgTex;
uniform float uOpacity;

uniform vec2 uWindow;

// 1400 * 790

float getOpacity(float dis){
	float opacity;
	float rad = uWindow.x * 0.3;
	if(dis < rad){
//		opacity = 0.8;
//	}else if(dis < uWindow.x / 10. * 2.){
		opacity = mix(0.3, .0, dis/rad );
	}else {
		opacity = 0.0;
	}

	return opacity ;
}

void main() {
    vec4 texel = texture2D( tDiffuse, vUv );

    vec4 bgTexel = vec4( 5./255., 92./255., 182./255., 1. );


    float dis = distance( gl_FragCoord.xy, vec2(0.5 * uWindow.x, uWindow.y - 10. - 1000. * (uOpacity - 1.)) );
    float opacity = getOpacity(dis) * uOpacity;


    gl_FragColor = bgTexel * opacity + texel;
}
