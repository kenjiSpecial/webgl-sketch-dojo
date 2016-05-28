uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform vec2 uWindow;
uniform bool uMouseDown;
varying vec2 vUv;

float distanceToSegment(vec2 a, vec2 b, vec2 p, out float fp){
	vec2 d = p - a;
	vec2 x = b - a;

	fp = 0.0; //fractional projection, 0 - 1 in the length of vec2(b - a)
	float lx = length(x);

	if(lx <= 0.0001) return length(d);//#! needs improving; hot fix for normalization of 0 vector

	float projection = dot(d, x / lx); //projection in pixel units

	fp = projection / lx;

	if(projection < 0.0)            return length(d);
	else if(projection > length(x)) return length(p - b);
	return sqrt(abs(dot(d,d) - projection*projection));
}

float distanceToSegment(vec2 a, vec2 b, vec2 p){
	float fp;
	return distanceToSegment(a, b, p, fp);
}


void main(){
    vec3 col = texture2D(uTexture, vUv).xyz;
    vec2 v = col.xy;
    vec2 p = vec2(gl_FragCoord.x * 2.0, -(gl_FragCoord.y * 2.0 - uWindow.y/2.) + uWindow.y/2.) ;

    v.xy *= 0.99;

    float l = 0.0;
    if(uMouseDown){
        float dt = 1./60.;
        vec2 mouseVelocity = -(uPrevMouse - uMouse)/dt;

        float fp;
        l = distanceToSegment(uMouse, uPrevMouse, p, fp)/100.; ///sqrt(uWindow.x * uWindow.x + uWindow.y * uWindow.y);
//        l = l/1000.;
        float tapperFactor = 0.6;
        float projectedFraction = 1.0 - clamp(fp, 0.0, 1.0)*tapperFactor;

        float R = 0.015;
        float m = exp(-l/R);
        m *= projectedFraction * projectedFraction;

        float dx = 2.0; //1000.0;
        vec2 targetVelocity = mouseVelocity*dx;
        v += (targetVelocity - v)*m;
    }

    gl_FragColor = vec4(v, col.z, 1.);
}