uniform sampler2D velocity;
uniform sampler2D target;
uniform sampler2D randomTex;
uniform float dt;
uniform float rdx; //reciprocal of grid scale, used to scale velocity into simulation domain
uniform vec2 uWindow;

varying vec2 texelCoord;

uniform vec2 invresolution;
uniform float aspectRatio;


varying vec2 vUv;

//Segment
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

vec2 simToTexelSpace(vec2 simSpace){
    return vec2(simSpace.x / aspectRatio + 1.0 , simSpace.y + 1.0)*.5;
}


void main(void){
  //texelCoord refers to the center of the texel! Not a corner!


    vec2 tracedPos = vec2(vUv.x * uWindow.x, vUv.y * uWindow.y) -  dt * rdx * texture2D(velocity, vUv ).xy;
    vec4 st;
    st.xy = floor(tracedPos - .5) + 0.5;
    st.zy = st.xy + 1.;

    vec2 t = tracedPos - st.xy;
    st*= invresolution.xyxy;

    vec4 tex11 = texture2D(target, st.xy );
    vec4 tex21 = texture2D(target, st.zy );
    vec4 tex12 = texture2D(target, st.xw );
    vec4 tex22 = texture2D(target, st.zw );


//  vec4 col = texture2D(target, vec2(tracedPos.x/uWindow.x, tracedPos.y/uWindow.y) );

/**
  //Bilinear Interpolation of the target field value at tracedPos
  tracedPos = simToTexelSpace(tracedPos)/invresolution; // texel coordinates

  vec4 st;
  st.xy = floor(tracedPos-.5)+.5; //left & bottom cell centers
  st.zw = st.xy+1.;               //right & top centers

  vec2 t = tracedPos - st.xy;

  st*=invresolution.xyxy; //to unitary coords

  vec4 tex11 = texture2D(target, st.xy );
  vec4 tex21 = texture2D(target, st.zy );
  vec4 tex12 = texture2D(target, st.xw );
  vec4 tex22 = texture2D(target, st.zw ); */

  //need to bilerp this result
  gl_FragColor =  mix(mix(mix(tex11, tex21, t.x), mix(tex12, tex22, t.x), t.y), texture2D(randomTex, vUv), 0.5);
}