/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

var glslify = require('glslify')

THREE.OutputAddBlur = {
	uniforms: {
		"tDiffuse": { value: null },
		"tBlur"   : { value: null},
		"tText"	  : {value: null},
		"uColor"  : {value: new THREE.Color(0xffffff)},
		"uTime"	  : {value: 0}

	},
	vertexShader  : glslify("./shaders/shader.vert"),
	fragmentShader: glslify("./shaders/shader.frag")
};
