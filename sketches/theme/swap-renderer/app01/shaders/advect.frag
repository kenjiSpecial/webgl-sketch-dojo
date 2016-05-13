uniform sampler2D velocity;
uniform sampler2D target;
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
float kernel[9];
vec2  offset[9];
  //texelCoord refers to the center of the texel! Not a corner!
    vec4 col = vec4(0.0);

  vec2 tracedPos = vec2(vUv.x * uWindow.x, vUv.y * uWindow.y) - 500. * dt * rdx * (texture2D(velocity, vUv ).xy - vec2(0.5, 0.5));
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

  float dx = 1.0/uWindow.x;
  float dy = 1.0/uWindow.y;

  offset[0] = vec2(-dx, -dy);
  offset[1] = vec2(0.0, -dy);
  offset[2] = vec2(dx, -dy);

  offset[3] = vec2(-dx, 0.0);
  offset[4] = vec2(0.0, 0.0);
  offset[5] = vec2(dx, 0.0);

  offset[6] = vec2(-dx, dy);
  offset[7] = vec2(0.0, dy);
  offset[8] = vec2(dx, dy);

  kernel[0] = 1.0/16.0;   kernel[1] = 2.0/16.0;   kernel[2] = 1.0/16.0;
  kernel[3] = 2.0/16.0;   kernel[4] = 4.0/16.0;   kernel[5] = 2.0/16.0;
  kernel[6] = 1.0/16.0;   kernel[7] = 2.0/16.0;   kernel[8] = 1.0/16.0;

  for(int i = 0; i < 9; i++){
      vec4 tmp = texture2D( target, vec2(tracedPos.x/uWindow.x, tracedPos.y/uWindow.y) + offset[i]);
      col += tmp * kernel[i];
  }

  //need to bilerp this result
  gl_FragColor = col;// mix(mix(tex11, tex21, t.x), mix(tex12, tex22, t.x), t.y);
}