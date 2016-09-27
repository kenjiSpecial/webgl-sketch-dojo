uniform sampler2D tDiffuse;
uniform sampler2D tBlur;
uniform sampler2D tText;
uniform vec3 uColor;
uniform float uTime;
varying vec2 vUv;


vec3 blendAdd(vec3 base, vec3 blend) {
	return min(base+blend,vec3(1.0));
}

vec3 blendAdd(vec3 base, vec3 blend, float opacity) {
	return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 test(){
    return vec3(1.0, 1.0, 1.0);
}


highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
 }

float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {
	vec4 sum = vec4( 0.0 );

	vec4 baseColor = texture2D( tDiffuse, vUv);
	vec4 blurColor = texture2D( tBlur, vUv);
	vec4 textColor = texture2D( tText, vUv);
	vec3 randomColor = vec3(random(vUv + vec2(sin(uTime) + 1.0, 0.0)));
	vec3 addedColor = blendOverlay(blendAdd(blurColor.rgb, uColor, 0.2), randomColor, 0.1);
	sum.rgb = textColor.a * addedColor.rgb + (1.0 - textColor.a) * baseColor.rgb;
	sum.a   = 1.0;
	gl_FragColor = sum;

}