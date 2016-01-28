uniform float amplitude;
//uniform float uTime;

attribute float randomTexture;
//attribute vec3 velocity;
//attribute vec3 customColor;

varying float vRandomTexture;
varying float zDepth;

void main() {
	vec4 worldPosition = modelMatrix * vec4(position, 1.0); // + vec4( , 1.0);
	vec4 mvPosition = viewMatrix * worldPosition; //vec4( worldPosition , 1.0 );

	//gl_PointSize = size;
	gl_PointSize = clamp(8. * clamp(( 300.0 / abs(mvPosition.z)), 0.0, 3.0), 1., 9.);
	zDepth = abs(mvPosition.z);
	vRandomTexture = randomTexture;

	gl_Position = projectionMatrix * mvPosition;
}