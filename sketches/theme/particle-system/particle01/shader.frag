uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;

varying float vRandomTexture;
varying float zDepth;

void main() {
	vec4 color;

	if(vRandomTexture < 0.25)       color = texture2D( texture0, gl_PointCoord );
	else if(vRandomTexture < 0.50)  color = texture2D( texture1, gl_PointCoord );
	else if(vRandomTexture < 0.75)  color = texture2D( texture2, gl_PointCoord );
	else                            color = texture2D( texture3, gl_PointCoord );

	float alpha = clamp(zDepth/2700. * 10., 0.0, 1.);
	color = vec4(color.r * 70./255., color.g * 79./255., color.b * 87./255., alpha * color.a * alpha);

	gl_FragColor = color;

}