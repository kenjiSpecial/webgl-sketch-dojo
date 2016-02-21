varying float zDepth;

void main() {
	vec4 color;

	float alpha = clamp(zDepth/2700. * 10., 0.0, 1.);
	color = vec4(70./255., 79./255., 87./255., alpha * alpha * 0.6);


	gl_FragColor = color;
}