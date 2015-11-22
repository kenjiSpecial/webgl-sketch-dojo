
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uRandom;
uniform vec2 uWindow;

void main(){
//    vec2 texCoord =  vec2( vUv.x + sin(uTime * 5. + vUv.y * 100.) * 10./uWindow.x , vUv.y + cos(uTime * 10. + vUv.x * 100.) * 10./uWindow.y  );
    
    float val2 = 10.;
    float val3 = 20.;

    vec2 texCoord = vec2( max( 0.0, min( uWindow.x, gl_FragCoord.x+sin(gl_FragCoord.y/(153.25*uRandom*uRandom)*uRandom+uRandom*val2+uTime/3.0)*val3)   ),
						  max( 0.0, min( uWindow.y, gl_FragCoord.y+cos(gl_FragCoord.x/(251.57*uRandom*uRandom)*uRandom+uRandom*val2+uTime/2.4)*val3) ) );


    vec4 texel = texture2D( tDiffuse, texCoord/uWindow );
    gl_FragColor = texel;
}