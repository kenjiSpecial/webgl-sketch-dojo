varying float zDepth;

void main() {
	vec4 worldPosition = modelMatrix * vec4(position, 1.0); // + vec4( , 1.0);
	vec4 mvPosition = viewMatrix * worldPosition; //vec4( worldPosition , 1.0 );
	zDepth = abs(mvPosition.z);

	gl_Position = projectionMatrix * mvPosition;
}